import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * Fallback transport options
 */
const FALLBACK_TRANSPORT = {
    metro: {
        type: 'Metro/Subway',
        description: 'Underground rail system',
        coverage: 'City center and major areas',
        operatingHours: '6:00 AM - 11:30 PM',
        ticketPrice: '$1-3 per trip',
        tips: ['Buy a day pass for unlimited rides', 'Avoid rush hours (7-9 AM, 5-7 PM)'],
    },
    bus: {
        type: 'Public Bus',
        description: 'Extensive bus network',
        coverage: 'Citywide',
        operatingHours: '5:30 AM - 10:30 PM',
        ticketPrice: '$0.50-2 per trip',
        tips: ['Cash only on some routes', 'Download local transit app for real-time updates'],
    },
    taxi: {
        type: 'Taxi/Ride-share',
        description: 'On-demand transportation',
        coverage: 'Everywhere',
        operatingHours: '24/7',
        ticketPrice: '$5-20+ depending on distance',
        tips: ['Use ride-hailing apps for best rates', 'Confirm meter is running'],
    },
    train: {
        type: 'Commuter Train',
        description: 'Regional rail service',
        coverage: 'City and suburbs',
        operatingHours: '5:00 AM - 12:00 AM',
        ticketPrice: '$2-10 depending on distance',
        tips: ['Book in advance for long distances', 'First class available on some routes'],
    },
    ferry: {
        type: 'Ferry/Water Taxi',
        description: 'Water-based transport',
        coverage: 'Waterfront areas',
        operatingHours: '6:00 AM - 8:00 PM',
        ticketPrice: '$1-5 per trip',
        tips: ['Great for sightseeing', 'Can be affected by weather'],
    },
};

/**
 * Transport search tool
 */
export const transportTool: Tool = {
    name: 'find_local_transport',
    description: 'Find local transportation options in a destination',
    parameters: {
        destination: {
            type: 'string',
            description: 'City or location to find transport',
        },
        transport_type: {
            type: 'string',
            description: 'Specific type of transport',
            enum: ['metro', 'bus', 'taxi', 'train', 'ferry', 'all'],
        },
    },
    required: ['destination'],

    async execute(params): Promise<ToolResult> {
        const { destination, transport_type = 'all' } = params as {
            destination: string;
            transport_type?: string;
        };

        const cacheKey = generateCacheKey('transport', {
            destination: destination.toLowerCase(),
            transport_type,
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Try to fetch from transport service
                    const queryParams = new URLSearchParams({
                        destination,
                        ...(transport_type && { type: transport_type }),
                    });

                    const result = await fetchFromService<{ options: unknown[] }>(
                        SERVICE_URLS.transport,
                        `/api/transport?${queryParams.toString()}`
                    );

                    if (result.success && result.data?.options) {
                        return {
                            success: true,
                            data: result.data.options,
                            source: 'api' as const,
                        };
                    }

                    // Use fallback data
                    let transportOptions;
                    if (transport_type && transport_type !== 'all') {
                        const option = FALLBACK_TRANSPORT[transport_type as keyof typeof FALLBACK_TRANSPORT];
                        transportOptions = option ? [option] : [];
                    } else {
                        transportOptions = Object.values(FALLBACK_TRANSPORT);
                    }

                    return {
                        success: true,
                        data: {
                            destination,
                            options: transportOptions,
                        },
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.transport
            );

            return data as ToolResult;
        } catch (error) {
            return {
                success: true,
                data: {
                    destination,
                    options: Object.values(FALLBACK_TRANSPORT),
                },
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(transportTool);
