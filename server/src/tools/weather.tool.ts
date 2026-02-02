import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * Fallback weather data by region
 */
const FALLBACK_WEATHER: Record<string, {
    location: string;
    current: { temp: string; condition: string; humidity: string; wind: string };
    forecast: Array<{ date: string; high: string; low: string; condition: string }>;
}> = {
    tropical: {
        location: 'Tropical Destination',
        current: {
            temp: '32°C',
            condition: 'Partly Cloudy',
            humidity: '75%',
            wind: '12 km/h',
        },
        forecast: [
            { date: 'Tomorrow', high: '33°C', low: '26°C', condition: 'Sunny' },
            { date: 'Day 2', high: '31°C', low: '25°C', condition: 'Scattered Showers' },
            { date: 'Day 3', high: '32°C', low: '26°C', condition: 'Partly Cloudy' },
            { date: 'Day 4', high: '34°C', low: '27°C', condition: 'Sunny' },
            { date: 'Day 5', high: '33°C', low: '26°C', condition: 'Thunderstorms' },
        ],
    },
    temperate: {
        location: 'Temperate Destination',
        current: {
            temp: '18°C',
            condition: 'Cloudy',
            humidity: '60%',
            wind: '20 km/h',
        },
        forecast: [
            { date: 'Tomorrow', high: '20°C', low: '12°C', condition: 'Partly Cloudy' },
            { date: 'Day 2', high: '19°C', low: '11°C', condition: 'Rain' },
            { date: 'Day 3', high: '17°C', low: '10°C', condition: 'Cloudy' },
            { date: 'Day 4', high: '21°C', low: '13°C', condition: 'Sunny' },
            { date: 'Day 5', high: '22°C', low: '14°C', condition: 'Sunny' },
        ],
    },
    default: {
        location: 'Destination',
        current: {
            temp: '24°C',
            condition: 'Clear',
            humidity: '55%',
            wind: '15 km/h',
        },
        forecast: [
            { date: 'Tomorrow', high: '26°C', low: '18°C', condition: 'Sunny' },
            { date: 'Day 2', high: '25°C', low: '17°C', condition: 'Partly Cloudy' },
            { date: 'Day 3', high: '24°C', low: '16°C', condition: 'Cloudy' },
            { date: 'Day 4', high: '27°C', low: '19°C', condition: 'Sunny' },
            { date: 'Day 5', high: '28°C', low: '20°C', condition: 'Clear' },
        ],
    },
};

// Tropical destinations
const TROPICAL_DESTINATIONS = [
    'thailand', 'bali', 'maldives', 'hawaii', 'caribbean', 'singapore',
    'malaysia', 'philippines', 'vietnam', 'indonesia', 'sri lanka',
];

/**
 * Weather forecast tool
 */
export const weatherTool: Tool = {
    name: 'get_weather_forecast',
    description: 'Get weather forecast for a destination',
    parameters: {
        destination: {
            type: 'string',
            description: 'City or location to get weather for',
        },
        date_range: {
            type: 'string',
            description: 'Date range for forecast (e.g., "next 5 days")',
        },
    },
    required: ['destination'],

    async execute(params): Promise<ToolResult> {
        const { destination, date_range } = params as {
            destination: string;
            date_range?: string;
        };

        const cacheKey = generateCacheKey('weather', {
            destination: destination.toLowerCase(),
            date_range,
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Try to fetch from weather service
                    const queryParams = new URLSearchParams({
                        city: destination,
                        ...(date_range && { range: date_range }),
                    });

                    const result = await fetchFromService<{
                        location: string;
                        current: unknown;
                        forecast: unknown[];
                    }>(SERVICE_URLS.weather, `/weather?${queryParams.toString()}`);

                    if (result.success && result.data) {
                        return {
                            success: true,
                            data: result.data,
                            source: 'api' as const,
                        };
                    }

                    // Use fallback data based on destination type
                    const destLower = destination.toLowerCase();
                    const isTropical = TROPICAL_DESTINATIONS.some((t) =>
                        destLower.includes(t)
                    );

                    const weatherType = isTropical ? 'tropical' : 'temperate';
                    const fallbackWeather = {
                        ...FALLBACK_WEATHER[weatherType],
                        location: destination,
                    };

                    return {
                        success: true,
                        data: fallbackWeather,
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.weather
            );

            return data as ToolResult;
        } catch (error) {
            const destLower = destination.toLowerCase();
            const isTropical = TROPICAL_DESTINATIONS.some((t) =>
                destLower.includes(t)
            );
            const weatherType = isTropical ? 'tropical' : 'temperate';

            return {
                success: true,
                data: {
                    ...FALLBACK_WEATHER[weatherType],
                    location: destination,
                },
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(weatherTool);
