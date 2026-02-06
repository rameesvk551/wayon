import { tool } from "@langchain/core/tools";
import { z } from "zod";
import config from "./config.js";
import { requestJson } from "./utils/http.js";

// ═══════════════════════════════════════════════════════════════════════════
// LOGGING UTILITIES
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
};

const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace("T", " ").slice(0, 23);
};

const logTool = (level, serviceKey, message, data = null) => {
  const timestamp = getTimestamp();
  const colors = {
    info: LOG_COLORS.cyan,
    success: LOG_COLORS.green,
    warn: LOG_COLORS.yellow,
    error: LOG_COLORS.red,
    request: LOG_COLORS.magenta,
    response: LOG_COLORS.blue,
  };
  const color = colors[level] || LOG_COLORS.reset;
  const prefix = `${LOG_COLORS.dim}[${timestamp}]${LOG_COLORS.reset} ${color}[TOOL:${serviceKey.toUpperCase()}]${LOG_COLORS.reset}`;

  console.log(`${prefix} ${message}`);
  if (data) {
    console.log(`${LOG_COLORS.dim}├─ Details:${LOG_COLORS.reset}`, JSON.stringify(data, null, 2));
  }
};

const normalizeServiceResult = (service, response, request) => {
  if (!response.ok) {
    logTool("error", service, `❌ Service returned error`, {
      status: response.status,
      error: response.json || response.text,
    });
    return JSON.stringify({
      ok: false,
      service,
      status: response.status,
      error: response.json || response.text,
      request,
    });
  }

  const dataPreview = response.json
    ? (Array.isArray(response.json) ? `Array[${response.json.length}]` : typeof response.json)
    : "text";
  logTool("success", service, `✅ Result normalized: ${dataPreview}`);

  return JSON.stringify({
    ok: true,
    service,
    data: response.json ?? response.text,
    request,
  });
};

const createRestTool = ({ name, description, schema, serviceKey, mapInput }) => {
  const service = config.services[serviceKey];
  return tool(
    async (input) => {
      const startTime = Date.now();
      const body = typeof mapInput === "function" ? mapInput(input) : input;
      const url = `${service.baseUrl}${service.path}`;

      console.log(`\n${"═".repeat(70)}`);
      logTool("request", serviceKey, `🔧 TOOL INVOKED: ${name}`);
      logTool("info", serviceKey, `📍 Endpoint: ${service.method} ${url}`);
      logTool("info", serviceKey, `📦 Request payload:`, body);

      try {
        const response = await requestJson({
          baseUrl: service.baseUrl,
          path: service.path,
          method: service.method,
          body,
          timeoutMs: config.requestTimeoutMs,
        });

        const duration = Date.now() - startTime;
        logTool("response", serviceKey, `📥 Response received in ${duration}ms`, {
          ok: response.ok,
          status: response.status,
          hasJson: Boolean(response.json),
          jsonPreview: response.json
            ? (Array.isArray(response.json)
              ? `Array with ${response.json.length} items`
              : Object.keys(response.json).slice(0, 5).join(", "))
            : null,
          textPreview: typeof response.text === "string"
            ? response.text.slice(0, 200)
            : null,
        });

        console.log(`${"═".repeat(70)}\n`);
        return normalizeServiceResult(serviceKey, response, body);
      } catch (error) {
        const duration = Date.now() - startTime;
        logTool("error", serviceKey, `💥 Request failed after ${duration}ms`, {
          error: error.message,
          stack: error.stack?.split("\n").slice(0, 3),
        });
        console.log(`${"═".repeat(70)}\n`);
        throw error;
      }
    },
    {
      name,
      description,
      schema,
    }
  );
};

const parseCityCountry = (value) => {
  if (!value || typeof value !== "string") return {};
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return {};
  return { city: parts[0], country: parts[parts.length - 1] };
};

export const buildTools = () => {
  const hotelSearch = createRestTool({
    name: "search_hotels",
    description: "Search hotels for a destination and date range.",
    serviceKey: "hotel",
    schema: z.object({
      destination: z.string().min(1).describe("City or region to stay in"),
      checkIn: z.string().min(1).describe("Check-in date in YYYY-MM-DD"),
      checkOut: z.string().min(1).describe("Check-out date in YYYY-MM-DD"),
      guests: z.number().int().min(1).describe("Number of guests"),
      budget: z.string().optional().describe("Budget range or category"),
      amenities: z.array(z.string()).optional().describe("Desired amenities"),
    }),
    mapInput: (input) => ({
      location: input.destination,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      guests: input.guests,
      amenities: input.amenities,
      budget: input.budget,
    }),
  });

  const flightSearch = createRestTool({
    name: "search_flights",
    description: "Find flight options between two locations.",
    serviceKey: "flight",
    schema: z.object({
      origin: z.string().describe("Origin city or airport"),
      destination: z.string().describe("Destination city or airport"),
      departDate: z.string().optional().describe("Departure date in YYYY-MM-DD"),
      departure: z.string().optional().describe("Departure date in YYYY-MM-DD (alias for departDate)"),
      returnDate: z.string().optional().describe("Return date in YYYY-MM-DD"),
      passengers: z.number().int().min(1).optional().describe("Number of passengers"),
      cabin: z.string().optional().describe("Cabin class (economy, premium, business)")
    }).superRefine((value, ctx) => {
      if (!value.departDate && !value.departure) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "departDate is required",
          path: ["departDate"],
        });
      }
    }),
    mapInput: (input) => ({
      ...input,
      departDate: input.departDate || input.departure,
    }),
  });

  const tourSearch = createRestTool({
    name: "search_tours",
    description: "Find local experiences and guided activities for a destination.",
    serviceKey: "tour",
    schema: z.object({
      city: z.string().describe("City for the tour"),
      country: z.string().describe("Country for the tour"),
      date: z.string().optional().describe("Preferred tour date in YYYY-MM-DD"),
      interests: z.array(z.string()).optional().describe("Interest tags for tour types"),
      budget: z.string().optional().describe("Budget range or category"),
    }),
    mapInput: (input) => ({
      city: input.city,
      country: input.country,
      type: input.interests?.[0],
    }),
  });

  const attractionSearch = createRestTool({
    name: "search_attractions",
    description: "Find attractions and landmarks to visit.",
    serviceKey: "attraction",
    schema: z.object({
      destination: z.string().optional().describe("City/region to explore (ex: Kerala, India)"),
      city: z.string().optional().describe("City to explore"),
      country: z.string().optional().describe("Country to explore"),
      date: z.string().optional().describe("Visit date in YYYY-MM-DD"),
      categories: z.array(z.string()).optional().describe("Categories or themes"),
      radiusKm: z.number().optional().describe("Search radius in kilometers"),
    }),
    mapInput: (input) => {
      const fromCity = parseCityCountry(input.city);
      const fromDestination = parseCityCountry(input.destination);
      return {
        city: fromCity.city || fromDestination.city || input.city || input.destination,
        country: input.country || fromCity.country || fromDestination.country,
        types: input.categories,
        limit: input.radiusKm ? Math.round(input.radiusKm) : undefined,
      };
    },
  });

  const blogSearch = createRestTool({
    name: "search_travel_blogs",
    description: "Retrieve travel blog tips and guides.",
    serviceKey: "blog",
    schema: z.object({
      destination: z.string().describe("Destination to search blog content for"),
      topic: z.string().optional().describe("Topic or theme to focus on"),
      style: z.string().optional().describe("Style like budget, luxury, family")
    }),
    mapInput: (input) => ({
      destination: input.destination,
      topic: input.topic,
      style: input.style,
    }),
  });

  const itineraryPdf = createRestTool({
    name: "generate_itinerary_pdf",
    description: "Generate a PDF itinerary from a prepared trip plan.",
    serviceKey: "pdf",
    schema: z.object({
      tripName: z.string().describe("Short name of the trip"),
      travelerName: z.string().optional().describe("Primary traveler name"),
      email: z.string().optional().describe("Email to send the PDF to"),
      itinerary: z.any().describe("Structured itinerary data or markdown content")
    }),
  });

  const weatherLookup = createRestTool({
    name: "get_weather",
    description: "Get weather info for a destination and date.",
    serviceKey: "weather",
    schema: z.object({
      location: z.string().describe("City or region"),
      date: z.string().optional().describe("Date in YYYY-MM-DD")
    }),
    mapInput: (input) => {
      const parts = typeof input.location === "string"
        ? input.location.split(",").map((part) => part.trim()).filter(Boolean)
        : [];
      return {
        city: parts[0] || input.location,
        country: parts[1],
      };
    },
  });

  const transportOptions = createRestTool({
    name: "get_transport_options",
    description: "Find local transport options within a destination.",
    serviceKey: "transport",
    schema: z.object({
      origin: z.object({
        name: z.string().describe("Starting point name"),
        lat: z.number().describe("Origin latitude"),
        lng: z.number().describe("Origin longitude"),
      }),
      destination: z.object({
        name: z.string().describe("Destination name"),
        lat: z.number().describe("Destination latitude"),
        lng: z.number().describe("Destination longitude"),
      }),
      date: z.string().optional().describe("Travel date in YYYY-MM-DD"),
      modePreference: z.string().optional().describe("Preferred mode (transit, walking, cycling, driving, escooter)")
    }),
    mapInput: (input) => ({
      origin: input.origin,
      destination: input.destination,
      departureTime: input.date,
      preferences: input.modePreference
        ? { modes: [input.modePreference] }
        : undefined,
    }),
  });

  return [
    hotelSearch,
    flightSearch,
    tourSearch,
    attractionSearch,
    blogSearch,
    itineraryPdf,
    weatherLookup,
    transportOptions,
  ];
};
