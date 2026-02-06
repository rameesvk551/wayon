const TOOL_INTENT_MAP = {
  weather: "weather_lookup",
  hotel: "hotel_search",
  flight: "flight_search",
  attraction: "attraction_list",
  tour: "experience_list",
  transport: "transport_options",
  pdf: "itinerary_pdf",
};

export const deriveIntent = ({ structured, toolResults, itinerary }) => {
  if (structured?.intent?.name) {
    return {
      name: structured.intent.name,
      confidence: structured.intent.confidence ?? 0.7,
      slots: structured.intent.slots,
    };
  }

  if (Array.isArray(toolResults) && toolResults.length > 0) {
    for (const result of toolResults) {
      if (!result?.service) continue;
      const mapped = TOOL_INTENT_MAP[result.service];
      if (mapped) {
        return {
          name: mapped,
          confidence: 0.65,
          slots: result.request || undefined,
        };
      }
    }
  }

  if (itinerary) {
    return {
      name: "itinerary_generate",
      confidence: 0.6,
      slots: {
        destination: itinerary.destination,
        totalDays: itinerary.totalDays,
      },
    };
  }

  return {
    name: "general_chat",
    confidence: 0.4,
  };
};
