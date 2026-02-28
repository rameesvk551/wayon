/**
 * Tour API Service
 *
 * Communicates with the tour-service backend (port 4004) to fetch
 * real tours & activities from Amadeus and Geoapify.
 * Maps backend responses to the frontend TourListingItem type.
 *
 * Pattern follows: hotelApi.ts / attractionApi.ts
 */

import type { TourListingItem } from '../data/tourListingData';

// ── Backend base URL ─────────────────────────────────────────────────────

const TOUR_API_URL = import.meta.env.VITE_TOUR_SERVICE_URL || 'http://localhost:4333';

// ── Backend response types ───────────────────────────────────────────────

interface BackendTour {
    id: string;
    name: string;
    images: string[];
    description: string;
    shortDescription: string;
    location: string;
    country: string;
    coordinates: { lat: number; lng: number };
    duration: string;
    durationDays: number;
    price: number;
    originalPrice?: number;
    currency: string;
    category: string;
    rating: number;
    reviewCount: number;
    groupSize: string;
    maxGroupSize: number;
    language: string[];
    badges: string[];
    isAIRecommended: boolean;
    highlights: string[];
    itinerary: Array<{
        day: number;
        title: string;
        description: string;
        activities: string[];
    }>;
    included: string[];
    excluded: string[];
    faq: Array<{ question: string; answer: string }>;
    reviews: Array<{
        id: string;
        userName: string;
        avatar: string;
        rating: number;
        date: string;
        comment: string;
        helpful: number;
    }>;
    availableDates: string[];
    meetingPoint: string;
    difficultyLevel: string;
    provider: string;
    bookingUrl?: string;
}

interface SearchResponse {
    success: boolean;
    tours: BackendTour[];
    count: number;
    searchedAt: string;
}

interface DetailResponse {
    success: boolean;
    tour: BackendTour | null;
    fetchedAt: string;
}

// ── Request cache ────────────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60_000; // 5 minutes
const requestCache = new Map<string, { promise: Promise<any>; timestamp: number }>();

function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.promise as Promise<T>;
    }
    const promise = fetcher().catch((err) => {
        requestCache.delete(key);
        throw err;
    });
    requestCache.set(key, { promise, timestamp: Date.now() });
    return promise;
}

// ── Map backend → frontend ───────────────────────────────────────────────

function mapBackendToFrontend(tour: BackendTour): TourListingItem {
    return {
        id: tour.id,
        name: tour.name,
        images: tour.images.length > 0 ? tour.images : [
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        ],
        description: tour.description,
        shortDescription: tour.shortDescription,
        location: tour.location,
        country: tour.country,
        coordinates: tour.coordinates,
        duration: tour.duration,
        durationDays: tour.durationDays || 1,
        price: tour.price,
        originalPrice: tour.originalPrice,
        currency: tour.currency === 'USD' ? '$' : (tour.currency || '$'),
        category: (tour.category as any) || 'City Tours',
        rating: tour.rating || 4.0,
        reviewCount: tour.reviewCount || 0,
        groupSize: tour.groupSize || '2-15',
        maxGroupSize: tour.maxGroupSize || 15,
        language: tour.language || ['English'],
        badges: tour.badges || [],
        isAIRecommended: tour.isAIRecommended || false,
        highlights: tour.highlights || [],
        itinerary: tour.itinerary || [],
        included: tour.included || [],
        excluded: tour.excluded || [],
        faq: tour.faq || [],
        reviews: tour.reviews || [],
        availableDates: tour.availableDates || [],
        meetingPoint: tour.meetingPoint || '',
        difficultyLevel: (tour.difficultyLevel as any) || 'Easy',
    };
}

// ── Public API ───────────────────────────────────────────────────────────

/**
 * Search tours by coordinates
 */
export function searchTours(params: {
    latitude: number;
    longitude: number;
    radius?: number;
    category?: string;
    keyword?: string;
    limit?: number;
}): Promise<TourListingItem[]> {
    const cacheKey = `tours:${params.latitude}:${params.longitude}:${params.radius || 20}:${params.category || ''}`;

    return cachedFetch(cacheKey, async () => {
        const queryParams = new URLSearchParams({
            latitude: String(params.latitude),
            longitude: String(params.longitude),
        });
        if (params.radius) queryParams.set('radius', String(params.radius));
        if (params.category) queryParams.set('category', params.category);
        if (params.keyword) queryParams.set('keyword', params.keyword);
        if (params.limit) queryParams.set('limit', String(params.limit));

        const res = await fetch(`${TOUR_API_URL}/api/tours/search?${queryParams}`);

        if (!res.ok) {
            throw new Error(`Tour search failed: ${res.status}`);
        }

        const data: SearchResponse = await res.json();
        if (!data.success || !data.tours) {
            throw new Error('Tour search returned no results');
        }

        return data.tours.map(mapBackendToFrontend);
    });
}

/**
 * Get a single tour by ID
 */
export function getTourById(id: string): Promise<TourListingItem | null> {
    const cacheKey = `tour:${id}`;

    return cachedFetch(cacheKey, async () => {
        const res = await fetch(`${TOUR_API_URL}/api/tours/${encodeURIComponent(id)}`);
        if (!res.ok) return null;

        const data: DetailResponse = await res.json();
        if (!data.success || !data.tour) return null;

        return mapBackendToFrontend(data.tour);
    });
}

// ── Popular destinations (for default search) ────────────────────────────

export const POPULAR_DESTINATIONS: { name: string; lat: number; lng: number }[] = [
    { name: 'Paris, France', lat: 48.8566, lng: 2.3522 },
    { name: 'Bali, Indonesia', lat: -8.4095, lng: 115.1889 },
    { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'New York, USA', lat: 40.7128, lng: -74.0060 },
    { name: 'London, UK', lat: 51.5074, lng: -0.1278 },
    { name: 'Rome, Italy', lat: 41.9028, lng: 12.4964 },
    { name: 'Barcelona, Spain', lat: 41.3851, lng: 2.1734 },
    { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
];
