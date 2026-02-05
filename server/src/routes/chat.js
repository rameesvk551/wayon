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

const coerceArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const getNested = (obj, paths) => {
  if (!obj || typeof obj !== "object") return undefined;
  for (const path of paths) {
    const parts = path.split(".");
    let current = obj;
    let found = true;
    for (const part of parts) {
      if (!current || typeof current !== "object" || !(part in current)) {
        found = false;
        break;
      }
      current = current[part];
    }
    if (found && current !== undefined) return current;
  }
  return undefined;
};

const formatPrice = (value, currency) => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "number") {
    const suffix = currency ? ` ${currency}` : "";
    return `${value}${suffix}`;
  }
  if (typeof value === "object") {
    const amount = value.amount ?? value.value ?? value.price ?? value.total;
    const curr = value.currency ?? currency;
    if (amount !== undefined) {
      return formatPrice(amount, curr);
    }
  }
  return undefined;
};

const mapWeatherCondition = (description) => {
  const text = `${description || ""}`.toLowerCase();
  if (text.includes("snow")) return "snowy";
  if (text.includes("rain") || text.includes("storm")) return "rainy";
  if (text.includes("cloud")) return "cloudy";
  if (text.includes("partly")) return "partly_cloudy";
  return "sunny";
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

const buildBlocksFromTools = (messages) => {
  const toolResults = extractToolResults(messages);
  if (toolResults.length === 0) return null;

  const blocks = [];

  for (const result of toolResults) {
    if (!result.ok) {
      blocks.push({
        type: "alert",
        level: "warning",
        text: result.error || `${result.service || "Service"} is unavailable.`,
      });
      continue;
    }

    const data = result.data;
    switch (result.service) {
      case "weather": {
        const payload = data?.current ? data : data?.data ?? data;
        const current = payload?.current;
        if (current) {
          blocks.push({
            type: "weather",
            location: payload?.city
              ? `${payload.city}${payload?.country ? `, ${payload.country}` : ""}`
              : "Weather update",
            temperature: current.temperature ?? current.temp ?? 0,
            feelsLike: current.feelsLike ?? current.feels_like,
            condition: mapWeatherCondition(current.description),
            humidity: current.humidity ?? 0,
            wind: `${current.windSpeed ?? current.wind_speed ?? 0} m/s`,
            uvIndex: "N/A",
          });
        }
        break;
      }
      case "hotel": {
        const hotels = coerceArray(
          getNested(data, [
            "hotels",
            "data.hotels",
            "data.data.hotels",
            "data",
            "results",
          ]) ?? data
        );
        if (hotels.length > 0) {
          blocks.push({
            type: "hotel_carousel",
            title: "Hotel Options",
            hotels: hotels.map((hotel, index) => ({
              id: hotel.id || hotel.hotelId || `hotel-${index}`,
              name: hotel.name || hotel.title || "Hotel",
              image: hotel.image || hotel.imageUrl || hotel.images?.[0] || "",
              rating: Number(hotel.rating ?? hotel.reviewScore ?? 4.2),
              reviewCount: hotel.reviewCount ?? hotel.reviews,
              price:
                formatPrice(hotel.price, hotel.currency) ||
                formatPrice(hotel.pricePerNight, hotel.currency) ||
                "Contact for pricing",
              originalPrice: formatPrice(hotel.originalPrice, hotel.currency),
              location:
                hotel.location ||
                hotel.city ||
                [hotel.address, hotel.country].filter(Boolean).join(", "),
              amenities: hotel.amenities || [],
              badge: hotel.badge,
              badgeType: hotel.badgeType,
            })),
          });
        }
        break;
      }
      case "flight": {
        const flights = coerceArray(
          getNested(data, ["flights", "data.flights", "data", "results"]) ?? data
        );
        if (flights.length > 0) {
          blocks.push({
            type: "flight_carousel",
            title: "Flight Options",
            flights: flights.map((flight, index) => ({
              id: flight.id || `flight-${index}`,
              airline: flight.airline || flight.carrier || "Airline",
              airlineLogo: flight.airlineLogo || flight.logo,
              flightNumber: flight.flightNumber || flight.number || "N/A",
              departure: flight.departureTime || flight.departure || "",
              arrival: flight.arrivalTime || flight.arrival || "",
              departureAirport: flight.departureAirport || flight.origin || "",
              arrivalAirport: flight.arrivalAirport || flight.destination || "",
              departureCity: flight.departureCity,
              arrivalCity: flight.arrivalCity,
              duration: flight.duration || flight.totalDuration || "",
              price: formatPrice(flight.price, flight.currency) || "Contact",
              stops: Number.isFinite(Number(flight.stops)) ? Number(flight.stops) : 0,
              aircraft: flight.aircraft,
              class: flight.class,
              route: flight.route,
              gate: flight.gate,
              seat: flight.seat,
            })),
          });
        }
        break;
      }
      case "attraction": {
        const attractions = coerceArray(
          getNested(data, ["attractions", "data.attractions", "data", "results"]) ?? data
        );
        if (attractions.length > 0) {
          const source = data?.source ?? data?.data?.source;
          const requestCity = result.request?.city || result.request?.destination;
          const requestCountry = result.request?.country;
          const destinationLabel = requestCity
            ? `${requestCity}${requestCountry ? `, ${requestCountry}` : ""}`
            : attractions[0]?.city || attractions[0]?.location?.city || "Destination";
          if (source === "fallback") {
            blocks.push({
              type: "alert",
              level: "info",
              text: "Attraction results are sample data because the attraction service returned fallback results.",
            });
          }
          blocks.push({
            type: "attraction_carousel",
            title: "Top Attractions",
            destination: destinationLabel,
            attractions: attractions.map((attr, index) => ({
              id: attr.id || `attr-${index}`,
              name: attr.name || attr.title || "Attraction",
              category: attr.category || attr.type || "general",
              description: attr.description,
              rating: Number(attr.rating ?? 4.5),
              image: attr.image || attr.imageUrl || attr.photos?.[0],
              duration: attr.duration,
              price: formatPrice(attr.price, attr.currency),
              lat: attr.lat ?? attr.latitude ?? 0,
              lng: attr.lng ?? attr.longitude ?? 0,
            })),
          });
        }
        break;
      }
      case "tour": {
        const experiences = coerceArray(
          getNested(data, ["experiences", "data.experiences", "data", "results"]) ?? data
        );
        if (experiences.length > 0) {
          blocks.push({
            type: "list",
            ordered: false,
            items: experiences.map((exp, index) => ({
              id: exp.id || `exp-${index}`,
              text: `${exp.name || exp.title || "Experience"}${exp.location?.city ? ` • ${exp.location.city}` : ""}`,
            })),
          });
        }
        break;
      }
      case "blog": {
        const posts = coerceArray(
          getNested(data, ["posts", "data", "blogs", "articles", "results"]) ?? data
        );
        if (posts.length > 0) {
          blocks.push({
            type: "list",
            ordered: false,
            items: posts.map((post, index) => ({
              id: post.id || `post-${index}`,
              text: post.title || post.name || post.slug || "Blog post",
            })),
          });
        }
        break;
      }
      case "transport": {
        const legs = coerceArray(
          getNested(data, ["data", "legs", "routes", "results"]) ?? data
        );
        if (legs.length > 0) {
          blocks.push({
            type: "list",
            ordered: false,
            items: legs.map((leg, index) => ({
              id: `leg-${index}`,
              text: leg.origin?.name && leg.destination?.name
                ? `${leg.origin.name} → ${leg.destination.name}`
                : `Transport option ${index + 1}`,
            })),
          });
        }
        break;
      }
      case "pdf": {
        if (data?.pdfUrl || data?.pdfBytesBase64) {
          blocks.push({
            type: "alert",
            level: "success",
            text: "Itinerary PDF is ready to download.",
          });
        }
        break;
      }
      default:
        break;
    }
  }

  if (blocks.length === 0) return null;
  return { blocks };
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
  const uiBlocks = buildBlocksFromTools(messages);

  return {
    message: structuredPayload.reply || content,
    structured: structuredPayload,
    itinerary,
    uiBlocks,
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
