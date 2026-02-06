import { Router } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent.js";
import { getOrCreateSession, setSessionMessages } from "../memory.js";
import { safeJsonParse } from "../utils/http.js";
import { parseAiResponse } from "../utils/ai-response.js";
import { deriveIntent } from "../utils/intent.js";
import { buildUiForIntent } from "../services/ui/builders.js";

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

    const userMessage = new HumanMessage(message);
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
  });

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const session = getOrCreateSession(sessionId);
    const userMessage = new HumanMessage(message);
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

export default router;
