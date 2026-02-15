// ═══════════════════════════════════════════════════════════════════════════
// ATTRACTION SERVICE — API Client
// Connects to attraction-service microservice (port 4007)
// ═══════════════════════════════════════════════════════════════════════════

import type { Attraction } from '../types/attraction';

const BASE_URL = import.meta.env.VITE_ATTRACTION_SERVICE_URL || 'http://localhost:4007';

// ── Backend PlaceResult shape ──────────────────────────────────────────────
export interface PlaceResult {
    id: string;
    name: string;
    description?: string;
    location: { lat: number; lng: number };
    address: string;
    rating?: number;
    userRatingsTotal?: number;
    photos: string[];
    types: string[];
    category: string;
    openNow?: boolean;
    priceLevel?: number;
}

interface SearchResponse {
    success: boolean;
    attractions: PlaceResult[];
    count: number;
    source: string;
    searchedAt: string;
}

interface DetailResponse {
    success: boolean;
    attraction: PlaceResult | null;
    source: string;
    fetchedAt: string;
}

// ── Category mapping from backend → frontend ──────────────────────────────
const categoryMap: Record<string, string> = {
    landmark: 'historical',
    museum: 'historical',
    park: 'nature',
    nature: 'nature',
    religious: 'spiritual',
    entertainment: 'adventure',
    culture: 'historical',
    education: 'historical',
    shopping: 'food',
    dining: 'food',
    beach: 'nature',
    outdoor: 'adventure',
    attraction: 'adventure',
};

// ── Estimate visit duration based on category ─────────────────────────────
function estimateDuration(category: string): { text: string; minutes: number } {
    switch (category) {
        case 'museum':
        case 'culture':
            return { text: '2-3 hours', minutes: 150 };
        case 'park':
        case 'nature':
        case 'beach':
        case 'outdoor':
            return { text: '1-2 hours', minutes: 90 };
        case 'religious':
            return { text: '1 hour', minutes: 60 };
        case 'entertainment':
            return { text: '2-3 hours', minutes: 150 };
        case 'landmark':
            return { text: '1-2 hours', minutes: 90 };
        default:
            return { text: '1-2 hours', minutes: 90 };
    }
}

// ── Map backend PlaceResult → frontend Attraction ─────────────────────────
export function mapPlaceToAttraction(place: PlaceResult, city: string): Attraction {
    const dur = estimateDuration(place.category);
    const frontendCategory = categoryMap[place.category] || 'adventure';

    return {
        id: place.id,
        name: place.name,
        city,
        image: place.photos[0] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=340&fit=crop',
        rating: place.rating ?? 4.0,
        reviewCount: place.userRatingsTotal ?? 0,
        description: place.description || `A popular ${place.category} in ${city}.`,
        duration: dur.text,
        durationMinutes: dur.minutes,
        category: frontendCategory as any,
        price: place.priceLevel ? place.priceLevel * 500 : 0,
        isFree: !place.priceLevel || place.priceLevel === 0,
        isOpenNow: place.openNow ?? true,
        coordinates: { lat: place.location.lat, lng: place.location.lng },
        tags: place.types.slice(0, 3).map(t => t.replace(/_/g, ' ')),
        // Extended API fields
        address: place.address,
        photos: place.photos,
        types: place.types,
    };
}

// ── Request cache to prevent duplicate API calls ──────────────────────────
// Deduplicates identical requests (React StrictMode, re-renders, etc.)
const CACHE_TTL_MS = 60_000; // 60 seconds
const requestCache = new Map<string, { promise: Promise<any>; timestamp: number }>();

function cachedFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return cached.promise as Promise<T>;
    }
    const promise = fetcher().catch((err) => {
        // Remove failed requests from cache so they can be retried
        requestCache.delete(key);
        throw err;
    });
    requestCache.set(key, { promise, timestamp: Date.now() });
    return promise;
}

// ── Search attractions by city ────────────────────────────────────────────
export function searchAttractions(
    city: string,
    options?: { country?: string; types?: string[]; limit?: number }
): Promise<Attraction[]> {
    const limit = options?.limit ?? 20;
    const cacheKey = `search:${city}:${options?.country || ''}:${(options?.types || []).join(',')}:${limit}`;

    return cachedFetch(cacheKey, async () => {
        const res = await fetch(`${BASE_URL}/api/attractions/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                city,
                country: options?.country,
                types: options?.types,
                limit,
            }),
        });

        if (!res.ok) throw new Error(`Attraction search failed: ${res.status}`);

        const data: SearchResponse = await res.json();
        if (!data.success) throw new Error('Attraction search returned no results');

        return data.attractions.map(a => mapPlaceToAttraction(a, city));
    });
}

// ── Get attraction detail by ID ───────────────────────────────────────────
export function getAttractionById(id: string): Promise<PlaceResult | null> {
    const cacheKey = `detail:${id}`;

    return cachedFetch(cacheKey, async () => {
        const res = await fetch(`${BASE_URL}/api/attractions/${encodeURIComponent(id)}`);
        if (!res.ok) return null;

        const data: DetailResponse = await res.json();
        if (!data.success || !data.attraction) return null;

        return data.attraction;
    });
}
