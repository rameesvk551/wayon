import { tool } from "@langchain/core/tools";
import { z } from "zod";
import config from "./config.js";
import { requestJson } from "./utils/http.js";

const normalizeServiceResult = (service, response) => {
  if (!response.ok) {
    return JSON.stringify({
      ok: false,
      service,
      status: response.status,
      error: response.json || response.text,
    });
  }

  return JSON.stringify({
    ok: true,
    service,
    data: response.json ?? response.text,
  });
};

const createRestTool = ({ name, description, schema, serviceKey }) => {
  const service = config.services[serviceKey];
  return tool(
    async (input) => {
      const response = await requestJson({
        baseUrl: service.baseUrl,
        path: service.path,
        method: service.method,
        body: input,
        timeoutMs: config.requestTimeoutMs,
      });
      return normalizeServiceResult(serviceKey, response);
    },
    {
      name,
      description,
      schema,
    }
  );
};

export const buildTools = () => {
  const hotelSearch = createRestTool({
    name: "search_hotels",
    description: "Search hotels for a destination and date range.",
    serviceKey: "hotel",
    schema: z.object({
      destination: z.string().describe("City or region to stay in"),
      checkIn: z.string().describe("Check-in date in YYYY-MM-DD"),
      checkOut: z.string().describe("Check-out date in YYYY-MM-DD"),
      guests: z.number().int().min(1).optional().describe("Number of guests"),
      budget: z.string().optional().describe("Budget range or category"),
      amenities: z.array(z.string()).optional().describe("Desired amenities"),
    }),
  });

  const flightSearch = createRestTool({
    name: "search_flights",
    description: "Find flight options between two locations.",
    serviceKey: "flight",
    schema: z.object({
      origin: z.string().describe("Origin city or airport"),
      destination: z.string().describe("Destination city or airport"),
      departDate: z.string().describe("Departure date in YYYY-MM-DD"),
      returnDate: z.string().optional().describe("Return date in YYYY-MM-DD"),
      passengers: z.number().int().min(1).optional().describe("Number of passengers"),
      cabin: z.string().optional().describe("Cabin class (economy, premium, business)")
    }),
  });

  const tourSearch = createRestTool({
    name: "search_tours",
    description: "Find tours and guided activities for a destination.",
    serviceKey: "tour",
    schema: z.object({
      destination: z.string().describe("City or region for the tour"),
      date: z.string().optional().describe("Preferred tour date in YYYY-MM-DD"),
      interests: z.array(z.string()).optional().describe("Interest tags for tour types"),
      budget: z.string().optional().describe("Budget range or category"),
    }),
  });

  const attractionSearch = createRestTool({
    name: "search_attractions",
    description: "Find attractions and landmarks to visit.",
    serviceKey: "attraction",
    schema: z.object({
      destination: z.string().describe("City or region to explore"),
      date: z.string().optional().describe("Visit date in YYYY-MM-DD"),
      categories: z.array(z.string()).optional().describe("Categories or themes"),
      radiusKm: z.number().optional().describe("Search radius in kilometers"),
    }),
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
  });

  const transportOptions = createRestTool({
    name: "get_transport_options",
    description: "Find local transport options within a destination.",
    serviceKey: "transport",
    schema: z.object({
      origin: z.string().describe("Starting point"),
      destination: z.string().describe("Destination point"),
      date: z.string().optional().describe("Travel date in YYYY-MM-DD"),
      modePreference: z.string().optional().describe("Preferred mode (train, bus, taxi, metro)")
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
