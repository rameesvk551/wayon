import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * Fallback flight data
 */
const FALLBACK_FLIGHTS = [
    {
        id: 'flight-1',
        airline: 'Emirates',
        flightNumber: 'EK-512',
        departure: '10:30 AM',
        arrival: '4:00 PM',
        duration: '5h 30m',
        price: '$450',
        stops: 0,
        aircraft: 'Boeing 777-300ER',
        class: 'Economy',
        departureAirport: 'DEL',
        arrivalAirport: 'BKK',
        departureCity: 'Delhi',
        arrivalCity: 'Bangkok',
    },
    {
        id: 'flight-2',
        airline: 'Qatar Airways',
        flightNumber: 'QR-556',
        departure: '2:15 PM',
        arrival: '8:45 PM',
        duration: '6h 30m',
        price: '$380',
        stops: 1,
        aircraft: 'Airbus A350',
        class: 'Economy',
        departureAirport: 'DEL',
        arrivalAirport: 'BKK',
        departureCity: 'Delhi',
        arrivalCity: 'Bangkok',
    },
    {
        id: 'flight-3',
        airline: 'Singapore Airlines',
        flightNumber: 'SQ-421',
        departure: '11:45 PM',
        arrival: '7:15 AM (+1)',
        duration: '7h 30m',
        price: '$520',
        stops: 0,
        aircraft: 'Airbus A380',
        class: 'Economy',
        departureAirport: 'DEL',
        arrivalAirport: 'BKK',
        departureCity: 'Delhi',
        arrivalCity: 'Bangkok',
    },
    {
        id: 'flight-4',
        airline: 'Air India',
        flightNumber: 'AI-302',
        departure: '6:00 AM',
        arrival: '2:30 PM',
        duration: '8h 30m',
        price: '$280',
        stops: 1,
        aircraft: 'Boeing 787',
        class: 'Economy',
        departureAirport: 'DEL',
        arrivalAirport: 'BKK',
        departureCity: 'Delhi',
        arrivalCity: 'Bangkok',
    },
    {
        id: 'flight-5',
        airline: 'IndiGo',
        flightNumber: '6E-1234',
        departure: '8:15 AM',
        arrival: '12:45 PM',
        duration: '4h 30m',
        price: '$220',
        stops: 0,
        aircraft: 'Airbus A320neo',
        class: 'Economy',
        departureAirport: 'DEL',
        arrivalAirport: 'BKK',
        departureCity: 'Delhi',
        arrivalCity: 'Bangkok',
    },
];

/**
 * Flight search tool
 */
export const flightTool: Tool = {
    name: 'search_flights',
    description: 'Search for available flights between cities',
    parameters: {
        origin: {
            type: 'string',
            description: 'Departure city or airport code',
        },
        destination: {
            type: 'string',
            description: 'Arrival city or airport code',
        },
        date: {
            type: 'string',
            description: 'Travel date (YYYY-MM-DD)',
        },
        passengers: {
            type: 'number',
            description: 'Number of passengers',
        },
        travel_class: {
            type: 'string',
            description: 'Travel class',
            enum: ['economy', 'premium_economy', 'business', 'first'],
        },
    },
    required: ['origin', 'destination'],

    async execute(params): Promise<ToolResult> {
        const { origin, destination, date, passengers, travel_class } = params as {
            origin: string;
            destination: string;
            date?: string;
            passengers?: number;
            travel_class?: string;
        };

        const cacheKey = generateCacheKey('flights', {
            origin: origin.toLowerCase(),
            destination: destination.toLowerCase(),
            date,
            passengers,
            travel_class,
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Build query string
                    const queryParams = new URLSearchParams({
                        origin,
                        destination,
                        ...(date && { date }),
                        ...(passengers && { passengers: String(passengers) }),
                        ...(travel_class && { class: travel_class }),
                    });

                    // Try to fetch from flight service
                    const result = await fetchFromService<{ flights: typeof FALLBACK_FLIGHTS }>(
                        SERVICE_URLS.flights,
                        `/api/flights/search?${queryParams.toString()}`
                    );

                    if (result.success && result.data?.flights) {
                        return {
                            success: true,
                            data: result.data.flights,
                            source: 'api' as const,
                        };
                    }

                    // Use fallback data with route context
                    const flights = FALLBACK_FLIGHTS.map((flight) => ({
                        ...flight,
                        route: `${origin} → ${destination}`,
                    }));

                    return {
                        success: true,
                        data: flights,
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.flights
            );

            return data as ToolResult;
        } catch (error) {
            // Return fallback
            const flights = FALLBACK_FLIGHTS.map((flight) => ({
                ...flight,
                route: `${origin} → ${destination}`,
            }));

            return {
                success: true,
                data: flights,
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(flightTool);
