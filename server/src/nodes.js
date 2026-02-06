import { SystemMessage } from "@langchain/core/messages";

// ═══════════════════════════════════════════════════════════════════════════
// NODE LOGGING UTILITIES
// ═══════════════════════════════════════════════════════════════════════════
const LOG_COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
};

const getTimestamp = () => new Date().toISOString().replace("T", " ").slice(0, 23);

const logNode = (level, message, data = null) => {
  const timestamp = getTimestamp();
  const colors = { info: LOG_COLORS.cyan, success: LOG_COLORS.green, warn: LOG_COLORS.yellow };
  const color = colors[level] || LOG_COLORS.reset;
  const prefix = `${LOG_COLORS.dim}[${timestamp}]${LOG_COLORS.reset} ${color}[AGENT-NODE]${LOG_COLORS.reset}`;

  console.log(`${prefix} ${message}`);
  if (data) {
    console.log(`${LOG_COLORS.dim}├─ Details:${LOG_COLORS.reset}`, typeof data === "string" ? data : JSON.stringify(data, null, 2));
  }
};

const SYSTEM_PROMPT = `You are an AI-powered travel assistant that coordinates between the user and travel microservices (Hotels, Flights, Attractions, Weather, etc.).

CRITICAL RULES - MANDATORY DATA COLLECTION:
Never call any service tool unless ALL mandatory inputs for that service are available in the current chat session.
If required data is missing, you MUST ask the user to provide it first using the specific keywords below.
NEVER make up, invent, or assume values for missing mandatory fields. NEVER refuse to help - instead ask for the missing information.

═══════════════════════════════════════════════════════════════════════════
🏨 HOTEL SEARCH SERVICE
═══════════════════════════════════════════════════════════════════════════
MANDATORY INPUTS: check-in date, check-out date, number of guests, destination
If ANY are missing, DO NOT call search_hotels. Instead respond with:
"I'd love to help find hotels! Please provide your travel dates (check-in and check-out), how many guests, and your destination."

═══════════════════════════════════════════════════════════════════════════
✈️ FLIGHT SEARCH SERVICE
═══════════════════════════════════════════════════════════════════════════
MANDATORY INPUTS: origin city/airport, destination city/airport, travel date, number of passengers
If ANY are missing, DO NOT call search_flights. Instead respond with:
"I can help you find flights! Where are you departing from, where are you traveling to, when do you want to travel, and how many passengers?"

═══════════════════════════════════════════════════════════════════════════
🎯 ATTRACTION / ACTIVITY SERVICE
═══════════════════════════════════════════════════════════════════════════
MANDATORY INPUTS: destination/city
RECOMMENDED INPUTS: interests (culture, adventure, food, nature, historical, shopping, nightlife, relaxation), travel type (solo, couple, family, friends)
If destination is known but interests/type are missing, ask:
"Great choice! What are your interests (like history, food, adventure) and who are you traveling with (solo, couple, family, friends)?"
ALWAYS call search_attractions when user asks about places to visit, things to do, landmarks, or sightseeing.

═══════════════════════════════════════════════════════════════════════════
🌤️ WEATHER SERVICE
═══════════════════════════════════════════════════════════════════════════
MANDATORY INPUTS: location (city or region)
If location is missing, ask: "Which destination would you like weather information for?"

═══════════════════════════════════════════════════════════════════════════
GENERAL RULES
═══════════════════════════════════════════════════════════════════════════
- Use tools for all factual travel data. Do not invent facts.
- You may call multiple tools in parallel when you have all required inputs.
- Business logic happens in tools. Summarize tool outputs for the user.
- When you are ready to respond, output JSON only (no markdown) with this schema:
{
  "reply": string,
  "summary": string,
  "recommendations": array,
  "next_questions": array,
  "itinerary": {
    "destination": string,
    "totalDays": number,
    "dailyPlan": array
  },
  "intent": {
    "name": string,
    "confidence": number,
    "slots": object
  }
}
- If no tool data is available yet, keep "recommendations" empty and ask questions in "reply" and "next_questions".
- Always include an "itinerary" field even if empty.
- IMPORTANT KEYWORDS FOR TRIGGERING UI: When asking for missing info, use these phrases:
  - For dates: "travel dates" or "check-in" or "check-out"
  - For companions: "who are you traveling with" or "companions"
  - For budget: "budget" or "price range"
  - For transport: "how would you like to travel" or "mode of travel"
  - For interests: "interests" or "activities" or "what do you enjoy"
  - For origin: "where are you from" or "departing from" or "origin"`;

export const createAgentNode = (model) => {
  const systemMessage = new SystemMessage(SYSTEM_PROMPT);
  return async (state) => {
    const startTime = Date.now();
    const messages = [systemMessage, ...(state?.messages ?? [])];

    console.log(`\n${"─".repeat(70)}`);
    logNode("info", `🤖 AGENT NODE INVOKED`);
    logNode("info", `📊 Message count: ${messages.length} (${messages.length - 1} conversation + 1 system)`);

    // Log last user message
    const lastUserMsg = messages.filter(m => m._getType?.() === "human" || m.type === "human").pop();
    if (lastUserMsg) {
      const content = typeof lastUserMsg.content === "string"
        ? lastUserMsg.content.slice(0, 200)
        : JSON.stringify(lastUserMsg.content).slice(0, 200);
      logNode("info", `💬 Last user message: "${content}${content.length >= 200 ? '...' : ''}"`);
    }

    logNode("info", `⏳ Invoking model...`);
    const response = await model.invoke(messages);
    const duration = Date.now() - startTime;

    // Log response details
    const hasToolCalls = response.tool_calls?.length > 0 || response.additional_kwargs?.tool_calls?.length > 0;
    const toolCalls = response.tool_calls || response.additional_kwargs?.tool_calls || [];

    logNode("success", `✅ Model responded in ${duration}ms`);
    if (hasToolCalls) {
      logNode("info", `🔧 Tool calls requested: ${toolCalls.length}`,
        toolCalls.map(tc => ({ name: tc.name || tc.function?.name, args: tc.args || tc.function?.arguments }))
      );
    } else {
      const contentPreview = typeof response.content === "string"
        ? response.content.slice(0, 300)
        : JSON.stringify(response.content).slice(0, 300);
      logNode("info", `📝 Response content: "${contentPreview}${contentPreview.length >= 300 ? '...' : ''}"`);
    }
    console.log(`${"─".repeat(70)}\n`);

    return { messages: [response] };
  };
};
