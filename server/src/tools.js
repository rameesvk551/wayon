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

  // ── PDF tool: keep schema FLAT so small LLMs (functiongemma) can fill it.
  //    The heavy lifting happens in mapInput which builds the complex body
  //    the pdf-service expects.
  const itineraryPdf = createRestTool({
    name: "generate_itinerary_pdf",
    description:
      "Generate a downloadable PDF itinerary. Provide the trip name, destination, " +
      "number of days, start date, and a comma-separated list of attraction/activity " +
      "names the traveler wants to visit. Example activities: " +
      "'Eiffel Tower, Louvre Museum, Notre-Dame, Montmartre, Seine River Cruise'.",
    serviceKey: "pdf",
    schema: z.object({
      tripName: z.string().describe("Short title, e.g. '3 Days in Paris'"),
      destination: z.string().describe("Main destination city and country, e.g. 'Paris, France'"),
      totalDays: z.number().int().min(1).max(30).describe("Number of trip days"),
      startDate: z.string().optional().describe("Trip start date YYYY-MM-DD, default today"),
      activities: z.string().describe(
        "Comma-separated list of attraction/activity names to spread across days"
      ),
    }),
    mapInput: (input) => {
      // Parse the flat comma-separated activities string into an array of names
      const activityNames = (input.activities || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const totalDays = input.totalDays || 3;
      const destination = input.destination || "Unknown";
      const start = input.startDate || new Date().toISOString().split("T")[0];

      // Spread activities roughly evenly across days
      const perDay = Math.max(1, Math.ceil(activityNames.length / totalDays));
      const days = [];
      const startTimes = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "19:00"];

      for (let d = 0; d < totalDays; d++) {
        const dayDate = new Date(start);
        dayDate.setDate(dayDate.getDate() + d);
        const dateStr = dayDate.toISOString().split("T")[0];

        const slice = activityNames.slice(d * perDay, (d + 1) * perDay);
        // Ensure every day has at least one activity
        const dayActivities = slice.length > 0
          ? slice
          : [`Explore ${destination} – Day ${d + 1}`];

        days.push({
          dayNumber: d + 1,
          date: dateStr,
          city: destination.split(",")[0].trim(),
          activities: dayActivities.map((name, idx) => ({
            name,
            description: "",
            duration: "2 hours",
            startTime: startTimes[idx % startTimes.length],
            category: "sightseeing",
          })),
        });
      }

      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + totalDays - 1);

      return {
        trip: {
          title: input.tripName || `Trip to ${destination}`,
          destination,
          dateRange: { start, end: endDate.toISOString().split("T")[0] },
          totalDays,
        },
        map: {
          style: "goa-infographic",
          center: { lat: 0, lng: 0 },
          zoom: 12,
          markers: [],
        },
        days,
        output: { format: "A4", includeInfographicCover: true },
      };
    },
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

  const generateItinerary = createRestTool({
    name: "generate_itinerary",
    description:
      "Generate an optimised multi-day itinerary from a list of selected attractions. " +
      "Uses the TOPTW algorithm to assign attractions to days respecting time windows, " +
      "priorities, and daily time budgets. Call this AFTER the user has selected or confirmed " +
      "attractions they want to visit.",
    serviceKey: "itinerary",
    schema: z.object({
      destination: z.string().describe("Trip destination (e.g. 'Paris, France')"),
      numDays: z.number().int().min(1).max(14).describe("Number of trip days"),
      attractions: z
        .array(
          z.object({
            id: z.string().describe("Attraction ID"),
            name: z.string().describe("Attraction name"),
            lat: z.number().describe("Latitude"),
            lng: z.number().describe("Longitude"),
            priority: z.number().optional().describe("1-10, higher = more important"),
            visitDuration: z.number().optional().describe("Visit duration in minutes"),
            timeWindow: z
              .object({
                open: z.string().optional().describe("Opening time HH:MM"),
                close: z.string().optional().describe("Closing time HH:MM"),
              })
              .optional(),
            category: z.string().optional().describe("Category like historical, nature, food"),
            image: z.string().optional().describe("Image URL"),
            description: z.string().optional().describe("Short description"),
          })
        )
        .describe("List of attractions to include in the itinerary"),
      preferences: z
        .object({
          dayStartTime: z.string().optional().describe("Day start time HH:MM, default 09:00"),
          maxDailyMinutes: z.number().optional().describe("Max active minutes per day, default 600"),
          travelType: z.string().optional().describe("WALKING, DRIVING, PUBLIC_TRANSPORT, CYCLING"),
          budget: z.number().optional().describe("Trip budget"),
          currency: z.string().optional().describe("Currency code"),
        })
        .optional(),
      startLocation: z
        .object({
          lat: z.number().describe("Hotel / base latitude"),
          lng: z.number().describe("Hotel / base longitude"),
        })
        .optional(),
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
    generateItinerary,
  ];
};
