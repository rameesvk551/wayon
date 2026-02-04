import { Router } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { graph } from "../agent.js";
import { getOrCreateSession, setSessionMessages } from "../memory.js";
import { safeJsonParse } from "../utils/http.js";

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
    totalDays: totalDays || Math.max(1, normalizedPlan.length || 3),
    dailyPlan: normalizedPlan.length
      ? normalizedPlan
      : [
          { day: 1, type: "travel", description: "Arrival, check-in, and local orientation." },
          { day: 2, type: "leisure", description: "Explore key sights and local cuisine." },
          { day: 3, type: "leisure", description: "Flexible day for experiences and departure prep." },
        ],
    warnings: warnings.length ? warnings : itinerary.warnings,
  };
};

const buildFallbackItinerary = ({ destination, totalDays, warnings }) => {
  const days = totalDays && totalDays > 0 ? totalDays : 3;
  const dailyPlan = Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    type: index === 0 ? "travel" : "leisure",
    description:
      index === 0
        ? "Arrival, check-in, and a light local activity."
        : "Explore highlights, dining, and optional experiences.",
  }));

  return {
    destination: destination || "Your destination",
    totalDays: days,
    dailyPlan,
    warnings: warnings?.length ? warnings : undefined,
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

  return buildFallbackItinerary({
    destination,
    totalDays,
    warnings,
  });
};

const buildResponse = (messages) => {
  const finalAi = extractFinalAiMessage(messages);
  const content = finalAi?.content || "";
  const structured = safeJsonParse(content);

  const itinerary = deriveItinerary(structured, messages);
  const structuredPayload = structured
    ? { ...structured, itinerary }
    : {
        reply: content || "Here is your updated trip plan.",
        summary: "",
        recommendations: [],
        next_questions: [],
        itinerary,
      };

  return {
    message: structuredPayload.reply || content,
    structured: structuredPayload,
    itinerary,
    toolCalls: extractToolCalls(messages),
  };
};

router.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({
      error: "Missing 'message' in request body.",
    });
  }

  try {
    const session = getOrCreateSession(sessionId);
    const userMessage = new HumanMessage(message);
    const inputMessages = [...session.messages, userMessage];

    const result = await graph.invoke(
      { messages: inputMessages },
      { recursionLimit: 8 }
    );

    setSessionMessages(session.id, result.messages || inputMessages);

    const responsePayload = buildResponse(result.messages || []);
    return res.json({
      sessionId: session.id,
      ...responsePayload,
    });
  } catch (error) {
    console.error("/api/chat error", error);
    const fallbackItinerary = buildFallbackItinerary({
      destination: "Your destination",
      totalDays: 3,
      warnings: ["Services are temporarily unavailable. Showing a sample itinerary."],
    });
    return res.status(500).json({
      error: "Failed to process request.",
      fallback: {
        reply: "Sorry, I hit an issue while planning your trip. Please try again.",
        recommendations: [],
        next_questions: ["Where would you like to go?"],
        itinerary: fallbackItinerary,
      },
      itinerary: fallbackItinerary,
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
    const fallbackItinerary = buildFallbackItinerary({
      destination: "Your destination",
      totalDays: 3,
      warnings: ["Services are temporarily unavailable. Showing a sample itinerary."],
    });
    sendEvent("error", {
      message: "Streaming failed. Please retry.",
    });
    sendEvent("final", {
      message: "Here is a sample itinerary while services recover.",
      structured: {
        reply: "Here is a sample itinerary while services recover.",
        summary: "",
        recommendations: [],
        next_questions: ["Where would you like to go?"],
        itinerary: fallbackItinerary,
      },
      itinerary: fallbackItinerary,
      toolCalls: [],
    });
    res.end();
  }
});

export default router;
