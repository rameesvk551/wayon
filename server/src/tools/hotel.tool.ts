import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * Fallback hotel data
 */
const FALLBACK_HOTELS = [
    {
        id: 'hotel-1',
        name: 'Grand Palace Hotel',
        location: 'City Center',
        rating: 4.8,
        price: '$180/night',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        amenities: ['Pool', 'Spa', 'Restaurant', 'Gym', 'Free WiFi'],
        stars: 5,
    },
    {
        id: 'hotel-2',
        name: 'Riverside Inn',
        location: 'Waterfront District',
        rating: 4.5,
        price: '$120/night',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
        amenities: ['River View', 'Restaurant', 'Bar', 'Free WiFi'],
        stars: 4,
    },
    {
        id: 'hotel-3',
        name: 'Budget Stay Express',
        location: 'Near Airport',
        rating: 4.0,
        price: '$65/night',
        image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
        amenities: ['Breakfast', 'Shuttle', 'Free WiFi'],
        stars: 3,
    },
    {
        id: 'hotel-4',
        name: 'Boutique Heritage Hotel',
        location: 'Old Town',
        rating: 4.7,
        price: '$150/night',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
        amenities: ['Historic Building', 'Rooftop Bar', 'Concierge', 'Free WiFi'],
        stars: 4,
    },
    {
        id: 'hotel-5',
        name: 'Seaside Resort & Spa',
        location: 'Beach Area',
        rating: 4.9,
        price: '$250/night',
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
        amenities: ['Private Beach', 'Spa', 'Multiple Restaurants', 'Water Sports'],
        stars: 5,
    },
];

/**
 * Hotel search tool
 */
export const hotelTool: Tool = {
    name: 'search_hotels',
    description: 'Search for available hotels in a destination',
    parameters: {
        destination: {
            type: 'string',
            description: 'City or location to search hotels',
        },
        check_in: {
            type: 'string',
            description: 'Check-in date (YYYY-MM-DD)',
        },
        check_out: {
            type: 'string',
            description: 'Check-out date (YYYY-MM-DD)',
        },
        guests: {
            type: 'number',
            description: 'Number of guests',
        },
        budget: {
            type: 'string',
            description: 'Budget range (e.g., "budget", "mid-range", "luxury")',
            enum: ['budget', 'mid-range', 'luxury'],
        },
    },
    required: ['destination'],

    async execute(params): Promise<ToolResult> {
        const { destination, check_in, check_out, guests, budget } = params as {
            destination: string;
            check_in?: string;
            check_out?: string;
            guests?: number;
            budget?: string;
        };

        const cacheKey = generateCacheKey('hotels', {
            destination: destination.toLowerCase(),
            check_in,
            check_out,
            guests,
            budget,
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Build query string - Use legacy endpoint that only requires city
                    const queryParams = new URLSearchParams({
                        city: destination,
                        limit: '10',
                    });

                    // Try to fetch from hotel service (legacy endpoint)
                    const result = await fetchFromService<{ hotels: typeof FALLBACK_HOTELS }>(
                        SERVICE_URLS.hotels,
                        `/api/hotels?${queryParams.toString()}`
                    );

                    if (result.success && result.data?.hotels) {
                        return {
                            success: true,
                            data: result.data.hotels,
                            source: 'api' as const,
                        };
                    }

                    // Use fallback data with destination context
                    const hotels = FALLBACK_HOTELS.map((hotel) => ({
                        ...hotel,
                        location: `${hotel.location}, ${destination}`,
                    }));

                    // Filter by budget if specified
                    let filteredHotels = hotels;
                    if (budget === 'budget') {
                        filteredHotels = hotels.filter((h) => h.stars <= 3);
                    } else if (budget === 'luxury') {
                        filteredHotels = hotels.filter((h) => h.stars >= 5);
                    }

                    return {
                        success: true,
                        data: filteredHotels,
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.hotels
            );

            return data as ToolResult;
        } catch (error) {
            // Return fallback
            const hotels = FALLBACK_HOTELS.map((hotel) => ({
                ...hotel,
                location: `${hotel.location}, ${destination}`,
            }));

            return {
                success: true,
                data: hotels,
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(hotelTool);
