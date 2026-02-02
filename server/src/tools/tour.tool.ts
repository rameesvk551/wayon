import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * Fallback tour data
 */
const FALLBACK_TOURS = [
    {
        id: 'tour-1',
        name: 'City Highlights Walking Tour',
        category: 'Walking Tour',
        duration: '3 hours',
        price: '$35/person',
        rating: 4.8,
        groupSize: 'Small group (max 12)',
        includes: ['Local guide', 'Entrance fees', 'Light refreshments'],
        highlights: ['Historic landmarks', 'Hidden gems', 'Local stories'],
        image: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8f4a4?w=400',
    },
    {
        id: 'tour-2',
        name: 'Food & Culture Experience',
        category: 'Food Tour',
        duration: '4 hours',
        price: '$65/person',
        rating: 4.9,
        groupSize: 'Small group (max 8)',
        includes: ['Food tastings', 'Local guide', 'Drinks'],
        highlights: ['Street food', 'Local markets', 'Traditional restaurants'],
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    },
    {
        id: 'tour-3',
        name: 'Adventure Day Trip',
        category: 'Adventure',
        duration: 'Full day',
        price: '$120/person',
        rating: 4.7,
        groupSize: 'Group (max 20)',
        includes: ['Transport', 'Lunch', 'Equipment', 'Guide'],
        highlights: ['Nature trails', 'Scenic views', 'Adventure activities'],
        image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=400',
    },
    {
        id: 'tour-4',
        name: 'Sunset Photography Tour',
        category: 'Photography',
        duration: '3 hours',
        price: '$55/person',
        rating: 4.6,
        groupSize: 'Small group (max 6)',
        includes: ['Photography tips', 'Best viewpoints', 'Light refreshments'],
        highlights: ['Sunset spots', 'Photo opportunities', 'Expert guidance'],
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    },
    {
        id: 'tour-5',
        name: 'Private Guided Tour',
        category: 'Private Tour',
        duration: 'Flexible',
        price: '$200/group',
        rating: 5.0,
        groupSize: 'Private (1-4)',
        includes: ['Private guide', 'Customized itinerary', 'Hotel pickup'],
        highlights: ['Personalized experience', 'Flexible schedule', 'Insider access'],
        image: 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=400',
    },
];

/**
 * Tour search tool
 */
export const tourTool: Tool = {
    name: 'search_tours',
    description: 'Search for guided tours and experiences in a destination',
    parameters: {
        destination: {
            type: 'string',
            description: 'City or location to find tours',
        },
        categories: {
            type: 'string',
            description: 'Tour categories (e.g., "walking,food,adventure")',
        },
        date: {
            type: 'string',
            description: 'Date for the tour (YYYY-MM-DD)',
        },
    },
    required: ['destination'],

    async execute(params): Promise<ToolResult> {
        const { destination, categories, date } = params as {
            destination: string;
            categories?: string;
            date?: string;
        };

        const cacheKey = generateCacheKey('tours', {
            destination: destination.toLowerCase(),
            categories,
            date,
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Build query string
                    const queryParams = new URLSearchParams({
                        destination,
                        ...(categories && { categories }),
                        ...(date && { date }),
                    });

                    // Try to fetch from tour service
                    const result = await fetchFromService<{ tours: typeof FALLBACK_TOURS }>(
                        SERVICE_URLS.tours,
                        `/api/tours/search?${queryParams.toString()}`
                    );

                    if (result.success && result.data?.tours) {
                        return {
                            success: true,
                            data: result.data.tours,
                            source: 'api' as const,
                        };
                    }

                    // Use fallback data
                    let tours = FALLBACK_TOURS.map((tour) => ({
                        ...tour,
                        location: destination,
                    }));

                    // Filter by category if specified
                    if (categories) {
                        const categoryList = categories.toLowerCase().split(',');
                        tours = tours.filter((tour) =>
                            categoryList.some((cat) =>
                                tour.category.toLowerCase().includes(cat.trim())
                            )
                        );
                    }

                    return {
                        success: true,
                        data: tours,
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.tours
            );

            return data as ToolResult;
        } catch (error) {
            return {
                success: true,
                data: FALLBACK_TOURS.map((tour) => ({
                    ...tour,
                    location: destination,
                })),
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(tourTool);
