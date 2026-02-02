import { config } from 'dotenv';
import { z } from 'zod';

// Load .env file
config();

// Environment schema validation
const envSchema = z.object({
    // Server
    PORT: z.string().default('4000').transform(Number),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

    // Gemini API
    GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),

    // Redis
    REDIS_URL: z.string().default('redis://localhost:6379'),

    // Microservice URLs (defaults match actual running services)
    WEATHER_SERVICE_URL: z.string().default('http://localhost:4001'),
    HOTEL_SERVICE_URL: z.string().default('http://localhost:4005'),
    VISA_SERVICE_URL: z.string().default('http://localhost:4003'),
    ATTRACTION_SERVICE_URL: z.string().default('http://localhost:4007'),
    FLIGHT_SERVICE_URL: z.string().default('http://localhost:4004'),
    BLOG_SERVICE_URL: z.string().default('http://localhost:4006'),
    TOUR_SERVICE_URL: z.string().default('http://localhost:3007'),
    TRANSPORT_SERVICE_URL: z.string().default('http://localhost:3008'),
});

// Validate and export environment
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parseResult.error.format());
    process.exit(1);
}

export const env = parseResult.data;

// Service URLs grouped export
export const SERVICE_URLS = {
    weather: env.WEATHER_SERVICE_URL,
    hotels: env.HOTEL_SERVICE_URL,
    visa: env.VISA_SERVICE_URL,
    attractions: env.ATTRACTION_SERVICE_URL,
    flights: env.FLIGHT_SERVICE_URL,
    blog: env.BLOG_SERVICE_URL,
    tours: env.TOUR_SERVICE_URL,
    transport: env.TRANSPORT_SERVICE_URL,
} as const;

// Cache TTLs in seconds
export const CACHE_TTL = {
    visa: 24 * 60 * 60,      // 24 hours
    weather: 30 * 60,         // 30 minutes
    hotels: 5 * 60,           // 5 minutes
    flights: 5 * 60,          // 5 minutes
    attractions: 60 * 60,     // 1 hour
    tours: 60 * 60,           // 1 hour
    transport: 15 * 60,       // 15 minutes
    conversation: 24 * 60 * 60, // 24 hours
} as const;
