import dotenv from "dotenv";

dotenv.config();

const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toFloat = (value, fallback) => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const config = {
  port: toInt(process.env.PORT, 4000),
  ollamaHost: process.env.OLLAMA_HOST || "http://localhost:11434",
  modelName: process.env.MODEL_NAME || "functiongemma",
  modelTemperature: toFloat(process.env.MODEL_TEMPERATURE, 0.2),
  requestTimeoutMs: toInt(process.env.REQUEST_TIMEOUT_MS, 15000),
  memoryMaxMessages: toInt(process.env.MEMORY_MAX_MESSAGES, 40),
  memoryTtlMs: toInt(process.env.MEMORY_TTL_MS, 60 * 60 * 1000),
  services: {
    hotel: {
      baseUrl: process.env.HOTEL_SERVICE || "http://localhost:4001",
      path: process.env.HOTEL_PATH || "/search",
      method: (process.env.HOTEL_METHOD || "POST").toUpperCase(),
    },
    flight: {
      baseUrl: process.env.FLIGHT_SERVICE || "http://localhost:4002",
      path: process.env.FLIGHT_PATH || "/search",
      method: (process.env.FLIGHT_METHOD || "POST").toUpperCase(),
    },
    tour: {
      baseUrl: process.env.TOUR_SERVICE || "http://localhost:4003",
      path: process.env.TOUR_PATH || "/search",
      method: (process.env.TOUR_METHOD || "POST").toUpperCase(),
    },
    attraction: {
      baseUrl: process.env.ATTRACTION_SERVICE || "http://localhost:4004",
      path: process.env.ATTRACTION_PATH || "/search",
      method: (process.env.ATTRACTION_METHOD || "POST").toUpperCase(),
    },
    blog: {
      baseUrl: process.env.BLOG_SERVICE || "http://localhost:4005",
      path: process.env.BLOG_PATH || "/search",
      method: (process.env.BLOG_METHOD || "POST").toUpperCase(),
    },
    pdf: {
      baseUrl: process.env.PDF_SERVICE || "http://localhost:4006",
      path: process.env.PDF_PATH || "/generate",
      method: (process.env.PDF_METHOD || "POST").toUpperCase(),
    },
    weather: {
      baseUrl: process.env.WEATHER_SERVICE || "http://localhost:4007",
      path: process.env.WEATHER_PATH || "/current",
      method: (process.env.WEATHER_METHOD || "POST").toUpperCase(),
    },
    transport: {
      baseUrl: process.env.TRANSPORT_SERVICE || "http://localhost:4008",
      path: process.env.TRANSPORT_PATH || "/options",
      method: (process.env.TRANSPORT_METHOD || "POST").toUpperCase(),
    },
  },
};

export default config;
