import { Router } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent.js";
import { getOrCreateSession, setSessionMessages } from "../memory.js";
import { safeJsonParse, requestJson } from "../utils/http.js";
import { parseAiResponse } from "../utils/ai-response.js";
import { deriveIntent } from "../utils/intent.js";
import { buildUiForIntent } from "../services/ui/builders.js";
import crypto from "crypto";
import config from "../config.js";

// ═══════════════════════════════════════════════════════════════════════════
// TEMPORARY PDF STORE  (in-memory, auto-expires after 10 min)
// ═══════════════════════════════════════════════════════════════════════════
const pdfStore = new Map(); // id → { buffer: Buffer, pageCount, createdAt, destination }
const PDF_TTL_MS = 10 * 60 * 1000; // 10 minutes

function storePdf(pdfBase64, pageCount, destination) {
  // Clean up expired entries on every store
  const now = Date.now();
  for (const [id, entry] of pdfStore) {
    if (now - entry.createdAt > PDF_TTL_MS) pdfStore.delete(id);
  }
  const id = crypto.randomUUID();
  const buffer = Buffer.from(pdfBase64, "base64");

  // Verify the buffer starts with %PDF- (valid PDF header)
  const header = buffer.slice(0, 5).toString("ascii");
  if (header !== "%PDF-") {
    console.error(`❌ [PdfStore] Invalid PDF! Header: "${header}" (expected "%PDF-"), base64 length: ${pdfBase64.length}, buffer length: ${buffer.length}`);
    console.error(`   First 100 chars of base64: ${pdfBase64.slice(0, 100)}`);
  } else {
    console.log(`✅ [PdfStore] Valid PDF header confirmed`);
  }

  pdfStore.set(id, { buffer, pageCount, createdAt: now, destination });
  console.log(`📦 [PdfStore] Stored PDF ${id} (${Math.round(buffer.length / 1024)}KB, ${pageCount} pages, TTL 10min)`);
  return id;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAT LOGGING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
const LOG_COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
};

const getTimestamp = () => new Date().toISOString().replace("T", " ").slice(0, 23);

const logChat = (level, tag, message, data = null) => {
  const timestamp = getTimestamp();
  const colors = {
    info: LOG_COLORS.cyan,
    success: LOG_COLORS.green,
    warn: LOG_COLORS.yellow,
    error: LOG_COLORS.red,
    request: LOG_COLORS.magenta,
    response: LOG_COLORS.blue,
    session: LOG_COLORS.white,
  };
  const color = colors[level] || LOG_COLORS.reset;
  const prefix = `${LOG_COLORS.dim}[${timestamp}]${LOG_COLORS.reset} ${color}[${tag}]${LOG_COLORS.reset}`;

  console.log(`${prefix} ${message}`);
  if (data) {
    const formatted = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    console.log(`${LOG_COLORS.dim}├─ Details:${LOG_COLORS.reset}`, formatted);
  }
};

const router = Router();

const getMessageType = (message) => {
  if (!message) return "unknown";
  if (typeof message._getType === "function") {
    return message._getType();
  }
  if (message.type) return message.type;
  if (message.role) return message.role;
  return "unknown";
};

const extractFinalAiMessage = (messages) => {
  const aiMessages = messages.filter((msg) => getMessageType(msg) === "ai");
  return aiMessages[aiMessages.length - 1] || null;
};

const extractToolCalls = (messages) => {
  const calls = [];
  for (const msg of messages) {
    if (getMessageType(msg) !== "ai") continue;
    const toolCalls = msg.tool_calls || msg.additional_kwargs?.tool_calls || [];
    if (Array.isArray(toolCalls)) {
      calls.push(...toolCalls);
    }
  }
  return calls;
};

const extractLastHumanMessage = (messages) => {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i];
    const type = getMessageType(msg);
    if (type === "human" || type === "user") {
      return msg;
    }
  }
  return null;
};

const parsePromptLine = (content, key) => {
  if (!content || typeof content !== "string") return null;
  const lines = content.split("\n");
  const match = lines.find((line) =>
    line.trim().toLowerCase().startsWith(`${key.toLowerCase()}:`)
  );
  if (!match) return null;
  return match.split(":").slice(1).join(":").trim() || null;
};

const extractTotalDaysFromDates = (datesLine) => {
  if (!datesLine) return null;
  const match = datesLine.match(/(\d+)\s*(day|days|night|nights|week|weeks)/i);
  if (!match) return null;
  const count = Number.parseInt(match[1], 10);
  if (!Number.isFinite(count)) return null;
  const unit = match[2].toLowerCase();
  if (unit.startsWith("week")) {
    return count * 7;
  }
  return count;
};

const extractToolWarnings = (messages) => {
  const warnings = [];
  const toolMessages = messages.filter((msg) => getMessageType(msg) === "tool");
  for (const toolMsg of toolMessages) {
    const parsed = safeJsonParse(toolMsg?.content);
    if (parsed?.ok === false) {
      warnings.push(`${parsed.service || "Service"} unavailable or returned an error.`);
      continue;
    }
    if (!parsed && typeof toolMsg?.content === "string" && toolMsg.content.length > 0) {
      if (/ECONNREFUSED|timeout|failed|error/i.test(toolMsg.content)) {
        warnings.push("A service returned an error while preparing your itinerary.");
      }
    }
  }
  return warnings;
};

const normalizeItinerary = (itinerary, warnings = []) => {
  if (!itinerary || typeof itinerary !== "object") return null;
  const destination = typeof itinerary.destination === "string" ? itinerary.destination : null;
  const dailyPlan = Array.isArray(itinerary.dailyPlan) ? itinerary.dailyPlan : [];
  const totalDays = Number.isFinite(Number(itinerary.totalDays))
    ? Number(itinerary.totalDays)
    : dailyPlan.length || null;

  if (!destination && dailyPlan.length === 0 && !totalDays) {
    return null;
  }

  const normalizedPlan = dailyPlan.map((day, index) => ({
    day: day?.day ?? index + 1,
    ...day,
  }));

  return {
    destination: destination || "Your destination",
    totalDays: totalDays || normalizedPlan.length || null,
    dailyPlan: normalizedPlan,
    warnings: warnings.length ? warnings : itinerary.warnings,
  };
};

const deriveItinerary = (structured, messages) => {
  const warnings = extractToolWarnings(messages);
  const normalized = normalizeItinerary(structured?.itinerary, warnings);
  if (normalized) return normalized;

  const lastUser = extractLastHumanMessage(messages);
  const destinationRaw = parsePromptLine(lastUser?.content, "Destination");
  const destination = destinationRaw && destinationRaw.toLowerCase() !== "unknown"
    ? destinationRaw
    : null;
  const datesLine = parsePromptLine(lastUser?.content, "Dates");
  const totalDays = extractTotalDaysFromDates(datesLine);

  if (!destination && !totalDays && warnings.length === 0) {
    return null;
  }

  return {
    destination: destination || "Your destination",
    totalDays: totalDays || null,
    dailyPlan: [],
    warnings: warnings.length ? warnings : undefined,
  };
};

const extractToolResults = (messages) => {
  const results = [];
  const toolMessages = messages.filter((msg) => getMessageType(msg) === "tool");
  for (const toolMsg of toolMessages) {
    const parsed = safeJsonParse(toolMsg?.content);
    if (!parsed) continue;
    results.push({
      service: parsed.service,
      ok: parsed.ok,
      status: parsed.status,
      data: parsed.data,
      error: parsed.error,
      request: parsed.request,
    });
  }
  return results;
};

// ═══════════════════════════════════════════════════════════════════════════
// PRE-PROCESSING: Detect user intent from keywords to improve fallback quality
// ═══════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════
// DIRECT ITINERARY GENERATION (bypasses LLM for selected-attraction messages)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse "Selected attraction details" blocks from the user prompt.
 * Returns null if no attractions found.
 */
const parseSelectedAttractions = (text) => {
  if (!text || typeof text !== "string") return null;
  if (!/selected attract/i.test(text)) return null;

  const blocks = text.split(/(?=#\d+\s)/).filter(Boolean);
  const attractions = [];

  for (const block of blocks) {
    const nameMatch = block.match(/^#\d+\s+(.+?)$/m);
    if (!nameMatch) continue;

    const latMatch = block.match(/Latitude:\s*([\d.-]+)/i);
    const lngMatch = block.match(/Longitude:\s*([\d.-]+)/i);
    if (!latMatch || !lngMatch) continue;

    const lat = parseFloat(latMatch[1]);
    const lng = parseFloat(lngMatch[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

    const catMatch = block.match(/Category:\s*(.+)/i);
    const ratingMatch = block.match(/Rating:\s*([\d.]+)/i);
    const priceMatch = block.match(/Price:\s*(.+)/i);
    const durationMatch = block.match(/Duration:\s*(.+)/i);

    // ── Filter out non-attraction entries (travel agencies, services, people) ──
    const attractionName = nameMatch[1].trim();
    const category = catMatch ? catMatch[1].trim().toLowerCase() : "";
    const NON_ATTRACTION_PATTERNS = [
      /\b(travels?|agency|tour operator|taxi|cab|car rental|transport|logistics|courier|shipping)\b/i,
      /\b(consultanc|pvt\.?\s*ltd|llc|inc|corp|services?\s+(?:pvt|ltd|llp))\b/i,
      /\b(atm|bank|hospital|clinic|pharmacy|petrol|gas station|police|post office)\b/i,
    ];
    const NON_ATTRACTION_CATEGORIES = [
      "travel_agency", "taxi_stand", "car_rental", "bus_station",
      "gas_station", "atm", "bank", "hospital", "pharmacy",
      "police", "post_office", "insurance_agency", "real_estate_agency",
      "moving_company", "locksmith", "electrician", "plumber",
    ];
    const isNonAttraction =
      NON_ATTRACTION_PATTERNS.some((p) => p.test(attractionName)) ||
      NON_ATTRACTION_CATEGORIES.includes(category) ||
      // Single word names with no category are likely a person or business
      (attractionName.split(/\s+/).length === 1 && !category);
    if (isNonAttraction) {
      logChat("info", "PARSE-ATTRACTIONS", `⏭️  Skipping non-attraction: "${attractionName}" (category: ${category || "none"})`);
      continue;
    }

    // Derive visitDuration in minutes from duration text
    let visitDuration = 60; // default
    if (durationMatch) {
      const durText = durationMatch[1].toLowerCase();
      const hourM = durText.match(/(\d+)\s*h/); 
      const minM = durText.match(/(\d+)\s*min/);
      if (hourM) visitDuration = parseInt(hourM[1]) * 60;
      if (minM) visitDuration += parseInt(minM[1]);
    }

    // Derive priority from rating (scale 1-10)
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : 4.0;
    const priority = Math.min(10, Math.max(1, Math.round(rating * 2)));

    attractions.push({
      id: `attr-${attractions.length + 1}`,
      name: attractionName,
      lat,
      lng,
      priority,
      visitDuration,
      category: catMatch ? catMatch[1].trim().toLowerCase() : "general",
      image: "",
      description: "",
    });
  }

  return attractions.length > 0 ? attractions : null;
};

/**
 * Parse destination and numDays from the user prompt text.
 */
const parseItineraryMeta = (text) => {
  const destMatch = text.match(/Destination:\s*(.+)/i);
  let destination = destMatch ? destMatch[1].trim() : null;
  if (destination && destination.toLowerCase() === "unknown") destination = null;

  // Try to extract numDays from the text
  const dayMatch = text.match(/(\d+)\s*(?:day|days|night|nights)/i);
  let numDays = dayMatch ? parseInt(dayMatch[1]) : null;

  // Fallback: compute from dates if present
  if (!numDays) {
    const datesLine = text.match(/Dates:\s*(.+)/i);
    if (datesLine) numDays = extractTotalDaysFromDates(datesLine[1]);
  }

  return { destination, numDays };
};

/**
 * Call the itinerary planner service directly (no LLM needed).
 * Returns a full response payload ready to send to the client.
 */
const callItineraryServiceDirect = async (attractions, meta) => {
  const destination = meta.destination || (attractions[0]?.name ? attractions[0].name.split(",").pop()?.trim() : "Destination");

  // Smart numDays: estimate total visit time & compare to daily budget (600 min)
  // instead of the naive attractions.length / 4 which over-allocates days
  const totalVisitMinutes = attractions.reduce((sum, a) => sum + (a.visitDuration || 60), 0);
  const dailyBudget = meta.preferences?.maxDailyMinutes || 600;
  // Add ~20% overhead for travel between attractions
  const estimatedTotalMinutes = totalVisitMinutes * 1.2;
  const numDays = meta.numDays || Math.max(1, Math.ceil(estimatedTotalMinutes / dailyBudget));

  const itineraryService = config.services.itinerary;
  const url = `${itineraryService.baseUrl}${itineraryService.path}`;

  logChat("info", "DIRECT-ITINERARY", `🗓️  Calling itinerary service directly`, {
    destination,
    numDays,
    attractionCount: attractions.length,
    url,
  });

  const body = {
    destination,
    numDays,
    attractions,
    preferences: { dayStartTime: "09:00", maxDailyMinutes: 600 },
    generatePdf: true,
    pdfOptions: {
      startDate: new Date().toISOString().slice(0, 10),
      format: "A4",
      includeInfographicCover: true,
    },
  };

  logChat("info", "DIRECT-ITINERARY", `📤 REQUEST PAYLOAD`, {
    destination: body.destination,
    numDays: body.numDays,
    attractionCount: body.attractions.length,
    generatePdf: body.generatePdf,
    pdfOptions: body.pdfOptions,
    attractions: body.attractions.map((a) => ({ id: a.id, name: a.name, lat: a.lat, lng: a.lng, priority: a.priority, visitDuration: a.visitDuration, category: a.category })),
    preferences: body.preferences,
  });

  try {
    const startMs = Date.now();
    const response = await requestJson({
      baseUrl: itineraryService.baseUrl,
      path: itineraryService.path,
      method: itineraryService.method,
      body,
      timeoutMs: 45000,
    });
    const elapsedMs = Date.now() - startMs;

    logChat("info", "DIRECT-ITINERARY", `📥 Service responded`, {
      ok: response.ok,
      status: response.status,
      elapsedMs,
    });

    if (!response.ok) {
      logChat("error", "DIRECT-ITINERARY", `❌ Service error`, {
        status: response.status,
        elapsedMs,
        text: response.text?.slice(0, 500),
      });
      return null;
    }

    const result = response.json;
    const data = result?.data ?? result;

    // ── PDF result logging ───────────────────────────────────────────
    const pdfResult = result?.pdf ?? null;
    if (pdfResult) {
      logChat("info", "DIRECT-ITINERARY", `📄 PDF generated successfully`, {
        pageCount: pdfResult.pageCount,
        base64Length: pdfResult.pdfBase64?.length || 0,
        hasPdfData: !!pdfResult.pdfBase64,
      });
    } else {
      logChat("warn", "DIRECT-ITINERARY", `⚠️ No PDF in response (generatePdf was ${body.generatePdf})`, {
        hasResultPdf: !!result?.pdf,
        resultKeys: Object.keys(result || {}),
      });
    }

    logChat("info", "DIRECT-ITINERARY", `📥 RESPONSE DATA`, {
      success: result?.success,
      numDays: data?.numDays,
      dailyPlanDays: (data?.dailyPlan || []).length,
      hasPdf: !!pdfResult,
      pdfPageCount: pdfResult?.pageCount || 0,
      elapsedMs,
      dailyPlan: (data?.dailyPlan || []).map((d) => ({
        day: d.day,
        title: d.title,
        stopCount: (d.stops || []).length,
        stops: (d.stops || []).map((s) => ({ seq: s.seq, name: s.name, arrival: s.arrivalTime, departure: s.departureTime })),
        summary: d.summary,
      })),
      unassigned: (data?.unassigned || []).map((u) => u.name || u.id),
      summary: data?.summary,
      notes: data?.notes,
    });

    // Build tool-results array so builders.js can process it
    const toolResults = [{
      service: "itinerary",
      ok: true,
      data: result,
      request: body,
      pdf: pdfResult || null,
    }];

    const intent = { name: "itinerary_generate", confidence: 0.95, slots: { destination, numDays } };

    const dailyStopNames = (data.dailyPlan || []).map(
      (d) => `Day ${d.day}: ${d.stops?.map((s) => s.name).join(" → ") || "rest"}`
    );

    // Build the plan first so we can use actual counts in the reply
    const activeDays = (data.dailyPlan || []).filter((d) => (d.stops || []).length > 0);
    const actualDays = activeDays.length || 1;
    const assignedCount = data.summary?.assignedAttractions ?? attractions.length;

    const structured = {
      reply: `Here is your optimised ${actualDays}-day itinerary for ${destination} with ${assignedCount} attractions!`,
      summary: `Generated in ${data.summary?.algorithmMs ?? 0}ms using TOPTW algorithm.`,
      recommendations: dailyStopNames,
      next_questions: [
        "Would you like to adjust any day?",
        "Search for hotels near these attractions?",
        "Download this itinerary as PDF?",
      ],
      itinerary: {
        destination,
        totalDays: actualDays,
        dailyPlan: activeDays
          .map((d, idx) => {
            const stops = d.stops || [];
            const regionParts = stops.map((s) => s.name);
            return {
              day: idx + 1,   // re-number after filtering
              region: `${destination} – ${regionParts.slice(0, 2).join(", ")}${regionParts.length > 2 ? " & more" : ""}`,
              activities: regionParts,
              totalDurationHours: Math.round((d.summary?.totalMinutes || 0) / 60 * 10) / 10,
            };
          }),
        unassignedAttractions: (data.unassigned || []).map((u) => u.name || u.id || "Unknown"),
        warnings: data.notes || [],
      },
    };

    const ui = buildUiForIntent({ intent, structuredPayload: structured, toolResults });

    const finalResponse = {
      schemaVersion: "2026-02-05",
      message: structured.reply,
      structured,
      itinerary: structured.itinerary,
      intent,
      ui: ui || { version: "2026-02-05", blocks: [] },
      uiBlocks: ui ? { blocks: ui.blocks } : null,
      errors: [],
      toolCalls: [],
      ...(pdfResult?.pdfBase64 && (() => {
        const pdfId = storePdf(pdfResult.pdfBase64, pdfResult.pageCount, destination);
        return {
          pdf: {
            downloadUrl: `/api/chat/download-pdf/${pdfId}`,
            pageCount: pdfResult.pageCount,
            sizeBytes: Math.round(pdfResult.pdfBase64.length * 3 / 4),
          },
        };
      })()),
    };

    logChat("info", "DIRECT-ITINERARY", `✅ Final response built`, {
      hasPdf: !!finalResponse.pdf,
      pdfPageCount: finalResponse.pdf?.pageCount || 0,
      pdfDownloadUrl: finalResponse.pdf?.downloadUrl || null,
      uiBlockCount: finalResponse.ui?.blocks?.length || 0,
      elapsedMs,
    });

    return finalResponse;
  } catch (error) {
    logChat("error", "DIRECT-ITINERARY", `💥 Service call failed`, { error: error.message });
    return null;
  }
};

const detectUserIntent = (userText) => {
  if (!userText || typeof userText !== "string") return null;
  const text = userText.toLowerCase().trim();

  // Extract destination from common patterns
  const destPatterns = [
    /(?:in|to|at|for|near|around)\s+([a-zA-Z][\w\s,]+?)(?:\s+(?:from|on|for|between|check|with|please|thanks|$))/i,
    /^(?:hotels?|flights?|attractions?|weather|visit|explore|things to do)\s+(?:in|to|at|near)\s+(.+?)$/i,
  ];
  let destination = null;
  for (const pattern of destPatterns) {
    const match = text.match(pattern);
    if (match) { destination = match[1].trim().replace(/[.,!?]+$/, ""); break; }
  }

  // Detect service type
  if (/hotel|hotels|stay|accommodation|room|lodge|hostel|resort|booking/i.test(text)) {
    return { type: "hotel", destination };
  }
  if (/flight|flights|fly|flying|airline|plane|ticket|airfare/i.test(text)) {
    return { type: "flight", destination };
  }
  if (/attraction|visit|see|sightseeing|landmark|places|things to do|explore|tour|what to do/i.test(text)) {
    return { type: "attraction", destination };
  }
  if (/weather|temperature|forecast|rain|climate/i.test(text)) {
    return { type: "weather", destination };
  }
  if (/itinerary|plan my days|generate.*itinerary|create.*itinerary|selected attract/i.test(text)) {
    return { type: "itinerary", destination };
  }
  if (destination) {
    return { type: "general_travel", destination };
  }
  return null;
};

const buildResponse = (messages) => {
  logChat("info", "RESPONSE-BUILDER", "🔨 Building response from messages", { messageCount: messages.length });

  const finalAi = extractFinalAiMessage(messages);
  const content = finalAi?.content || "";
  const parsed = parseAiResponse(content);
  const structured = parsed.ok ? parsed.data : null;
  const parseErrors = parsed.ok ? [] : [parsed.error];

  if (!parsed.ok) {
    logChat("warn", "RESPONSE-BUILDER", `⚠️ AI response parse failed`, { error: parsed.error });
  }

  const itinerary = deriveItinerary(structured, messages);
  logChat("info", "RESPONSE-BUILDER", `📅 Itinerary derived`, {
    hasItinerary: !!itinerary,
    destination: itinerary?.destination,
    totalDays: itinerary?.totalDays,
    dailyPlanDays: itinerary?.dailyPlan?.length,
  });

  const structuredPayload = structured
    ? { ...structured, itinerary }
    : {
      reply: content || "Here is your updated trip plan.",
      summary: "",
      recommendations: [],
      next_questions: [],
      itinerary,
    };

  const toolResults = extractToolResults(messages);
  logChat("info", "RESPONSE-BUILDER", `🔧 Tool results extracted`, {
    count: toolResults.length,
    services: toolResults.map(r => ({ service: r.service, ok: r.ok })),
  });

  const intent = deriveIntent({ structured, toolResults, itinerary });
  logChat("info", "RESPONSE-BUILDER", `🎯 Intent derived`, intent);

  const ui = buildUiForIntent({ intent, structuredPayload, toolResults });
  logChat("info", "RESPONSE-BUILDER", `🖼️ UI blocks built`, {
    blockCount: ui?.blocks?.length || 0,
    blockTypes: ui?.blocks?.map(b => b.type) || [],
  });

  const uiBlocks = ui ? { blocks: ui.blocks } : null;

  const hasCollectInputs = ui?.blocks?.some((block) => block.type === "collect_input");
  if (hasCollectInputs && structuredPayload?.reply) {
    logChat("info", "RESPONSE-BUILDER", `📋 Collect input detected, adjusting reply`);
    structuredPayload.reply = "Sure — select the options below so I can tailor your plan.";
  }

  // 🚨 REFUSAL DETECTION: Detect and override "I cannot assist" type responses
  const refusalPatterns = [
    /i cannot assist/i,
    /i am unable to assist/i,
    /i apologize.*but.*cannot/i,
    /my current tools.*cannot/i,
    /i'm not able to/i,
    /i don't have the ability/i,
    /outside.*my capabilities/i,
    /let me know your destination/i,
    /what are your travel dates/i,
  ];

  const replyText = structuredPayload?.reply || content || "";
  const isRefusal = refusalPatterns.some(pattern => pattern.test(replyText));

  if (isRefusal && toolResults.length === 0) {
    logChat("warn", "RESPONSE-BUILDER", `🚨 REFUSAL DETECTED - Overriding with context-aware response`);

    // Detect what user was actually asking about from the last human message
    const lastHuman = extractLastHumanMessage(messages);
    const userText = (typeof lastHuman?.content === "string" ? lastHuman.content : "").toLowerCase();

    const hotelKeywords = /hotel|hotels|stay|accommodation|room|lodge|hostel|resort|booking/i;
    const flightKeywords = /flight|flights|fly|flying|airline|plane|ticket|airfare/i;
    const attractionKeywords = /attraction|visit|see|sightseeing|landmark|places|things to do|explore|tour/i;
    const weatherKeywords = /weather|temperature|forecast|rain|climate/i;

    // Extract destination from user message
    const destMatch = userText.match(/(?:in|to|at|for|near)\s+([a-zA-Z\s,]+?)(?:\s+(?:from|on|for|between|check|with)|$)/i);
    const destination = destMatch ? destMatch[1].trim() : null;

    if (hotelKeywords.test(userText)) {
      const dest = destination || "your chosen city";
      structuredPayload.reply = `Great, I can search hotels in ${dest}! To find the best options, I just need a few details:`;
      structuredPayload.next_questions = [
        "What are your check-in and check-out dates?",
        "How many guests will be staying?",
        "Do you have a budget preference (budget, mid-range, luxury)?",
      ];
    } else if (flightKeywords.test(userText)) {
      const dest = destination || "your destination";
      structuredPayload.reply = `I'll find flights to ${dest} for you! I just need a bit more info:`;
      structuredPayload.next_questions = [
        "Where are you flying from?",
        "What is your departure date?",
        "How many passengers?",
      ];
    } else if (attractionKeywords.test(userText) || destination) {
      const dest = destination || "your destination";
      structuredPayload.reply = `Let me find the best places to visit in ${dest}! What kind of activities interest you?`;
      structuredPayload.next_questions = [
        "Historical sites & museums",
        "Nature & outdoor activities",
        "Food & local cuisine",
        "Shopping & markets",
      ];
    } else if (weatherKeywords.test(userText)) {
      const dest = destination || "your destination";
      structuredPayload.reply = `I'll check the weather in ${dest}! When are you planning to visit?`;
      structuredPayload.next_questions = [
        "What dates are you planning to visit?",
      ];
    } else {
      structuredPayload.reply = "I'd love to help with your travel plans! What would you like to explore?";
      structuredPayload.next_questions = [
        "Search hotels in a city",
        "Find flights to a destination",
        "Discover attractions & things to do",
        "Check weather at a destination",
      ];
    }
  }

  logChat("success", "RESPONSE-BUILDER", `✅ Response built successfully`);
  return {
    schemaVersion: "2026-02-05",
    message: structuredPayload.reply || content,
    structured: structuredPayload,
    itinerary,
    intent,
    ui: ui || { version: "2026-02-05", blocks: [] },
    uiBlocks,
    errors: parseErrors,
    toolCalls: extractToolCalls(messages),
  };
};

router.post("/chat", async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const startTime = Date.now();
  const { message, sessionId } = req.body || {};

  console.log(`\n${"█".repeat(70)}`);
  logChat("request", "CHAT-API", `📨 POST /chat [${requestId}]`);
  logChat("info", "CHAT-API", `💬 Message: "${message?.slice(0, 100)}${message?.length > 100 ? '...' : ''}"`);
  logChat("info", "CHAT-API", `🔑 Session ID: ${sessionId || "(new session)"}`);

  if (!message || typeof message !== "string") {
    logChat("error", "CHAT-API", `❌ Invalid request: missing message`);
    console.log(`${"█".repeat(70)}\n`);
    return res.status(400).json({
      error: "Missing 'message' in request body.",
    });
  }

  try {
    const session = getOrCreateSession(sessionId);
    logChat("session", "CHAT-API", `📂 Session loaded`, {
      id: session.id,
      existingMessages: session.messages.length,
      isNew: !sessionId || sessionId !== session.id,
    });

    // ── DIRECT ITINERARY BYPASS ──────────────────────────────────────
    // When user sends selected attractions, skip LLM and call solver directly
    const selectedAttractions = parseSelectedAttractions(message);
    if (selectedAttractions) {
      logChat("info", "CHAT-API", `🗓️  Detected ${selectedAttractions.length} selected attractions — using direct itinerary path`);
      const meta = parseItineraryMeta(message);
      const directResult = await callItineraryServiceDirect(selectedAttractions, meta);
      if (directResult) {
        const totalDuration = Date.now() - startTime;
        logChat("success", "CHAT-API", `🏁 Request [${requestId}] completed via DIRECT ITINERARY in ${totalDuration}ms`);
        console.log(`${"█".repeat(70)}\n`);
        return res.json({ sessionId: session.id, ...directResult });
      }
      logChat("warn", "CHAT-API", `⚠️ Direct itinerary failed, falling back to LLM`);
    }
    // ── END DIRECT ITINERARY BYPASS ──────────────────────────────────

    // Enhance the user message with intent hints for the model
    const detectedIntent = detectUserIntent(message);
    let finalMessageText = message;
    if (detectedIntent) {
      logChat("info", "CHAT-API", `🎯 Pre-detected intent: ${detectedIntent.type}`, detectedIntent);
      if (detectedIntent.destination) {
        finalMessageText = `${message}\n[SYSTEM HINT: User is asking about ${detectedIntent.type} for "${detectedIntent.destination}". If you have enough data to call a tool, call it. Otherwise ask ONLY for the missing required fields. Do NOT ask for destination again.]`;
      }
    }

    const userMessage = new HumanMessage(finalMessageText);
    const inputMessages = [...session.messages, userMessage];
    logChat("info", "CHAT-API", `📊 Total messages to process: ${inputMessages.length}`);

    logChat("info", "CHAT-API", `⏳ Invoking LangGraph agent...`);
    const graphStartTime = Date.now();

    const result = await graph.invoke(
      { messages: inputMessages },
      { recursionLimit: 8 }
    );

    const graphDuration = Date.now() - graphStartTime;
    logChat("success", "CHAT-API", `✅ LangGraph completed in ${graphDuration}ms`, {
      outputMessageCount: result.messages?.length || 0,
    });

    setSessionMessages(session.id, result.messages || inputMessages);
    logChat("info", "CHAT-API", `💾 Session messages updated`);

    const responsePayload = buildResponse(result.messages || []);

    const totalDuration = Date.now() - startTime;
    logChat("success", "CHAT-API", `🏁 Request [${requestId}] completed in ${totalDuration}ms`, {
      intent: responsePayload.intent?.name,
      uiBlockCount: responsePayload.ui?.blocks?.length || 0,
      hasItinerary: !!responsePayload.itinerary,
    });
    console.log(`${"█".repeat(70)}\n`);

    return res.json({
      sessionId: session.id,
      ...responsePayload,
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    logChat("error", "CHAT-API", `💥 Request [${requestId}] failed after ${totalDuration}ms`, {
      error: error.message,
      stack: error.stack?.split("\n").slice(0, 5),
    });
    console.log(`${"█".repeat(70)}\n`);

    return res.status(500).json({
      error: "Failed to process request.",
      fallback: {
        reply: "Sorry, I hit an issue while planning your trip. Please try again.",
        recommendations: [],
        next_questions: ["Where would you like to go?"],
        itinerary: null,
      },
      itinerary: null,
    });
  }
});

router.post("/chat/stream", async (req, res) => {
  const { message, sessionId } = req.body || {};

  if (!message || typeof message !== "string") {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Missing 'message' in request body." }));
    return;
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const session = getOrCreateSession(sessionId);

    // ── DIRECT ITINERARY BYPASS (stream) ─────────────────────────────
    const streamAttractions = parseSelectedAttractions(message);
    if (streamAttractions) {
      const meta = parseItineraryMeta(message);
      const directResult = await callItineraryServiceDirect(streamAttractions, meta);
      if (directResult) {
        sendEvent("meta", { sessionId: session.id });
        sendEvent("final", directResult);
        res.end();
        return;
      }
    }
    // ── END DIRECT ITINERARY BYPASS (stream) ─────────────────────────

    // Enhance the user message with intent hints for the model
    const streamIntent = detectUserIntent(message);
    let streamMessageText = message;
    if (streamIntent?.destination) {
      streamMessageText = `${message}\n[SYSTEM HINT: User is asking about ${streamIntent.type} for "${streamIntent.destination}". If you have enough data to call a tool, call it. Otherwise ask ONLY for the missing required fields. Do NOT ask for destination again.]`;
    }

    const userMessage = new HumanMessage(streamMessageText);
    const inputMessages = [...session.messages, userMessage];

    sendEvent("meta", { sessionId: session.id });

    let finalState = null;
    let lastToolCount = 0;

    const stream = await graph.stream(
      { messages: inputMessages },
      { streamMode: ["messages", "values"], recursionLimit: 8 }
    );

    for await (const [mode, chunk] of stream) {
      if (mode === "messages") {
        const delta = typeof chunk?.content === "string"
          ? chunk.content
          : Array.isArray(chunk?.content)
            ? chunk.content.join("")
            : "";

        if (delta) {
          sendEvent("token", { delta });
        }
      }

      if (mode === "values") {
        finalState = chunk;
        const messages = chunk?.messages || [];
        const toolMessages = messages.filter((msg) => getMessageType(msg) === "tool");
        if (toolMessages.length > lastToolCount) {
          const latest = toolMessages[toolMessages.length - 1];
          console.log("[chat/stream] tool message", {
            name: latest?.name || latest?.tool_call_id || "tool",
            contentPreview: typeof latest?.content === "string"
              ? latest.content.slice(0, 300)
              : null,
          });
          sendEvent("tool", {
            name: latest?.name || latest?.tool_call_id || "tool",
            output: latest?.content || null,
          });
          lastToolCount = toolMessages.length;
        }
      }
    }

    const finalMessages = finalState?.messages || inputMessages;
    setSessionMessages(session.id, finalMessages);

    const responsePayload = buildResponse(finalMessages);
    sendEvent("final", responsePayload);
    res.end();
  } catch (error) {
    console.error("/api/chat/stream error", error);
    sendEvent("error", {
      message: "Streaming failed. Please retry.",
    });
    sendEvent("final", {
      message: "Streaming failed. Please retry.",
      structured: {
        reply: "Streaming failed. Please retry.",
        summary: "",
        recommendations: [],
        next_questions: ["Where would you like to go?"],
        itinerary: null,
      },
      itinerary: null,
      toolCalls: [],
    });
    res.end();
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// PDF DOWNLOAD ENDPOINT
// ═══════════════════════════════════════════════════════════════════════════
router.get("/chat/download-pdf/:id", (req, res) => {
  const { id } = req.params;
  const entry = pdfStore.get(id);

  if (!entry) {
    console.log(`⚠️ [PdfDownload] PDF ${id} not found or expired`);
    return res.status(404).json({ error: "PDF not found or expired. Please regenerate the itinerary." });
  }

  const safeName = (entry.destination || "trip").replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
  const filename = `${safeName}-itinerary.pdf`;
  const buf = entry.buffer;

  // Verify before sending
  const header = buf.slice(0, 5).toString("ascii");
  console.log(`📥 [PdfDownload] Serving PDF ${id} → ${filename} (${Math.round(buf.length / 1024)}KB, header: "${header}")`);

  // Use raw writeHead + end to bypass any Express response processing
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": buf.length,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store",
  });
  res.end(buf);

  // Remove after download (one-time use)
  pdfStore.delete(id);
});

export default router;
