import { SERVICE_URLS, CACHE_TTL } from '../config/env.js';
import { cachedFetch, generateCacheKey } from '../cache/redis.js';
import { type Tool, type ToolResult, fetchFromService, toolRegistry } from './types.js';

/**
 * City coordinates for map centering
 */
export const CITY_COORDINATES: Record<string, { lat: number; lng: number; zoom: number }> = {
    thailand: { lat: 13.7563, lng: 100.5018, zoom: 12 },
    bangkok: { lat: 13.7563, lng: 100.5018, zoom: 12 },
    delhi: { lat: 28.6139, lng: 77.2090, zoom: 12 },
    mumbai: { lat: 19.0760, lng: 72.8777, zoom: 12 },
    goa: { lat: 15.2993, lng: 74.1240, zoom: 11 },
    jaipur: { lat: 26.9124, lng: 75.7873, zoom: 12 },
    japan: { lat: 35.6762, lng: 139.6503, zoom: 11 },
    tokyo: { lat: 35.6762, lng: 139.6503, zoom: 12 },
    paris: { lat: 48.8566, lng: 2.3522, zoom: 12 },
    london: { lat: 51.5074, lng: -0.1278, zoom: 12 },
    new_york: { lat: 40.7128, lng: -74.0060, zoom: 12 },
    dubai: { lat: 25.2048, lng: 55.2708, zoom: 12 },
    singapore: { lat: 1.3521, lng: 103.8198, zoom: 12 },
    bali: { lat: -8.4095, lng: 115.1889, zoom: 11 },
    default: { lat: 20.0, lng: 0.0, zoom: 2 },
};

/**
 * Attraction data interface with coordinates
 */
export interface AttractionData {
    id: string;
    name: string;
    category: string;
    description: string;
    rating: number;
    image: string;
    duration: string;
    price?: string;
    lat: number;
    lng: number;
}

/**
 * Fallback attraction data by destination with coordinates
 */
const FALLBACK_ATTRACTIONS: Record<string, AttractionData[]> = {
    thailand: [
        {
            id: 'thai-1',
            name: 'Grand Palace',
            category: 'Historical',
            description: 'Former royal residence with stunning architecture',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400',
            duration: '3-4 hours',
            price: '500 THB',
            lat: 13.7500,
            lng: 100.4913,
        },
        {
            id: 'thai-2',
            name: 'Wat Arun',
            category: 'Temple',
            description: 'Iconic riverside temple with intricate design',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400',
            duration: '1-2 hours',
            price: '100 THB',
            lat: 13.7437,
            lng: 100.4888,
        },
        {
            id: 'thai-3',
            name: 'Floating Markets',
            category: 'Cultural',
            description: 'Traditional markets on the water',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400',
            duration: 'Half day',
            lat: 13.5231,
            lng: 99.9572,
        },
    ],
    delhi: [
        {
            id: 'delhi-1',
            name: 'India Gate',
            category: 'Monument',
            description: 'Iconic war memorial and popular gathering spot in the heart of Delhi',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
            duration: '1 hour',
            price: 'Free',
            lat: 28.6129,
            lng: 77.2295,
        },
        {
            id: 'delhi-2',
            name: 'Red Fort',
            category: 'UNESCO Heritage',
            description: 'UNESCO World Heritage Site and symbol of Mughal power',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400',
            duration: '2-3 hours',
            price: '₹35 / ₹500',
            lat: 28.6562,
            lng: 77.2410,
        },
        {
            id: 'delhi-3',
            name: 'Qutub Minar',
            category: 'UNESCO Heritage',
            description: 'Tallest brick minaret in the world, a UNESCO World Heritage Site',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
            duration: '1-2 hours',
            price: '₹30 / ₹500',
            lat: 28.5244,
            lng: 77.1855,
        },
        {
            id: 'delhi-4',
            name: "Humayun's Tomb",
            category: 'Historical',
            description: 'Stunning Mughal architecture that inspired the Taj Mahal',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1623682242005-1dc8e1eb3e4e?w=400',
            duration: '1-2 hours',
            price: '₹30 / ₹500',
            lat: 28.5933,
            lng: 77.2507,
        },
        {
            id: 'delhi-5',
            name: 'Chandni Chowk',
            category: 'Market',
            description: 'Historic market with amazing street food and shopping',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400',
            duration: '3-4 hours',
            price: 'Free',
            lat: 28.6506,
            lng: 77.2303,
        },
        {
            id: 'delhi-6',
            name: 'Lotus Temple',
            category: 'Temple',
            description: 'Architectural marvel shaped like a lotus flower',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
            duration: '1 hour',
            price: 'Free',
            lat: 28.5535,
            lng: 77.2588,
        },
    ],
    mumbai: [
        {
            id: 'mumbai-1',
            name: 'Gateway of India',
            category: 'Monument',
            description: 'Iconic arch monument overlooking the Arabian Sea',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400',
            duration: '1 hour',
            price: 'Free',
            lat: 18.9220,
            lng: 72.8347,
        },
        {
            id: 'mumbai-2',
            name: 'Marine Drive',
            category: 'Landmark',
            description: "Famous seafront promenade known as the Queen's Necklace",
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400',
            duration: '1-2 hours',
            price: 'Free',
            lat: 18.9432,
            lng: 72.8235,
        },
        {
            id: 'mumbai-3',
            name: 'Elephanta Caves',
            category: 'UNESCO Heritage',
            description: 'UNESCO World Heritage Site with ancient rock-cut temples',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1590766940554-634a71e58ae2?w=400',
            duration: 'Half day',
            price: '₹40 / ₹600',
            lat: 18.9633,
            lng: 72.9315,
        },
    ],
    goa: [
        {
            id: 'goa-1',
            name: 'Baga Beach',
            category: 'Beach',
            description: 'Famous beach known for nightlife and water sports',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400',
            duration: 'Half day',
            price: 'Free',
            lat: 15.5523,
            lng: 73.7517,
        },
        {
            id: 'goa-2',
            name: 'Basilica of Bom Jesus',
            category: 'UNESCO Heritage',
            description: 'UNESCO World Heritage Site with remains of St. Francis Xavier',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1590766940554-634a71e58ae2?w=400',
            duration: '1-2 hours',
            price: 'Free',
            lat: 15.5009,
            lng: 73.9116,
        },
        {
            id: 'goa-3',
            name: 'Dudhsagar Falls',
            category: 'Nature',
            description: 'Spectacular four-tiered waterfall on the Goa-Karnataka border',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
            duration: 'Full day',
            price: '₹400',
            lat: 15.3144,
            lng: 74.3143,
        },
    ],
    jaipur: [
        {
            id: 'jaipur-1',
            name: 'Amber Fort',
            category: 'Historical',
            description: 'Magnificent hilltop fort with stunning architecture',
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400',
            duration: '2-3 hours',
            price: '₹100 / ₹500',
            lat: 26.9855,
            lng: 75.8513,
        },
        {
            id: 'jaipur-2',
            name: 'Hawa Mahal',
            category: 'Historical',
            description: 'Iconic Palace of Winds with 953 small windows',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400',
            duration: '1 hour',
            price: '₹50 / ₹200',
            lat: 26.9239,
            lng: 75.8267,
        },
        {
            id: 'jaipur-3',
            name: 'City Palace',
            category: 'Historical',
            description: 'Royal residence with museums and beautiful gardens',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400',
            duration: '2-3 hours',
            price: '₹200 / ₹700',
            lat: 26.9258,
            lng: 75.8237,
        },
    ],
    japan: [
        {
            id: 'japan-1',
            name: 'Fushimi Inari Shrine',
            category: 'Temple',
            description: 'Famous shrine with thousands of torii gates',
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=400',
            duration: '2-3 hours',
            price: 'Free',
            lat: 34.9671,
            lng: 135.7727,
        },
        {
            id: 'japan-2',
            name: 'Tokyo Skytree',
            category: 'Landmark',
            description: 'Tallest tower in Japan with observation decks',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
            duration: '2 hours',
            price: '¥2,100',
            lat: 35.7101,
            lng: 139.8107,
        },
        {
            id: 'japan-3',
            name: 'Senso-ji Temple',
            category: 'Temple',
            description: "Tokyo's oldest temple in the historic Asakusa district",
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400',
            duration: '1-2 hours',
            price: 'Free',
            lat: 35.7148,
            lng: 139.7967,
        },
    ],
    paris: [
        {
            id: 'paris-1',
            name: 'Eiffel Tower',
            category: 'Landmark',
            description: 'Iconic iron lattice tower and symbol of Paris',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400',
            duration: '2-3 hours',
            price: '€26',
            lat: 48.8584,
            lng: 2.2945,
        },
        {
            id: 'paris-2',
            name: 'Louvre Museum',
            category: 'Museum',
            description: "World's largest art museum, home to Mona Lisa",
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
            duration: 'Half day',
            price: '€17',
            lat: 48.8606,
            lng: 2.3376,
        },
        {
            id: 'paris-3',
            name: 'Notre-Dame Cathedral',
            category: 'Historical',
            description: 'Medieval Catholic cathedral on the Île de la Cité',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=400',
            duration: '1-2 hours',
            price: 'Free',
            lat: 48.8530,
            lng: 2.3499,
        },
    ],
    default: [
        {
            id: 'default-1',
            name: 'City Walking Tour',
            category: 'Tour',
            description: 'Explore the highlights of the city with a local guide',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
            duration: '3 hours',
            lat: 0,
            lng: 0,
        },
        {
            id: 'default-2',
            name: 'Local Food Market',
            category: 'Food & Drink',
            description: 'Discover local cuisine and street food',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
            duration: '2 hours',
            lat: 0,
            lng: 0,
        },
        {
            id: 'default-3',
            name: 'Historic Old Town',
            category: 'Historical',
            description: 'Wander through historic streets and architecture',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
            duration: 'Half day',
            lat: 0,
            lng: 0,
        },
    ],
};

/**
 * Get city coordinates for map centering
 */
export function getCityCoordinates(destination: string): { lat: number; lng: number; zoom: number } {
    const key = destination.toLowerCase().replace(/\s+/g, '_');
    return CITY_COORDINATES[key] || CITY_COORDINATES.default;
}

/**
 * Attraction discovery tool
 */
export const attractionTool: Tool = {
    name: 'discover_attractions',
    description: 'Find tourist attractions and things to do in a destination',
    parameters: {
        destination: {
            type: 'string',
            description: 'City or location to find attractions',
        },
        categories: {
            type: 'string',
            description: 'Comma-separated categories (e.g., "temples,museums,nature")',
        },
        limit: {
            type: 'number',
            description: 'Maximum number of results to return',
        },
    },
    required: ['destination'],

    async execute(params): Promise<ToolResult> {
        const { destination, categories, limit = 10 } = params as {
            destination: string;
            categories?: string;
            limit?: number;
        };

        const cacheKey = generateCacheKey('attractions', {
            destination: destination.toLowerCase(),
            categories,
            limit,
        });

        try {
            const data = await cachedFetch(
                cacheKey,
                async () => {
                    // Try to fetch from attraction service (POST endpoint)
                    const result = await fetchFromService<{ attractions: Array<unknown> }>(
                        SERVICE_URLS.attractions,
                        `/api/attractions/search`,
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                city: destination,
                                country: 'any',
                                types: categories ? categories.split(',') : undefined,
                                limit,
                            }),
                        }
                    );

                    if (result.success && result.data?.attractions) {
                        return {
                            success: true,
                            data: result.data.attractions,
                            source: 'api' as const,
                        };
                    }

                    // Use fallback data
                    const destKey = destination.toLowerCase();
                    const attractions =
                        FALLBACK_ATTRACTIONS[destKey] || FALLBACK_ATTRACTIONS.default;

                    return {
                        success: true,
                        data: attractions.slice(0, limit),
                        source: 'fallback' as const,
                    };
                },
                CACHE_TTL.attractions
            );

            return data as ToolResult;
        } catch (error) {
            const destKey = destination.toLowerCase();
            const attractions =
                FALLBACK_ATTRACTIONS[destKey] || FALLBACK_ATTRACTIONS.default;

            return {
                success: true,
                data: attractions.slice(0, limit as number),
                source: 'fallback',
            };
        }
    },
};

// Register the tool
toolRegistry.register(attractionTool);
