// ═══════════════════════════════════════════════════════════════════════════
// ROUTE OPTIMIZER — API Client
// Connects to route-optimizer microservice (port 3007)
// ═══════════════════════════════════════════════════════════════════════════

import type { Attraction } from '../types/attraction';

const BASE_URL = import.meta.env.VITE_ROUTE_OPTIMIZER_URL || 'http://localhost:4000';

// ── Request / Response types ──────────────────────────────────────────────
export interface OptimizeRoutePlace {
    id: string;
    name: string;
    lat: number;
    lng: number;
    imageUrl?: string;
    priority?: number;
    visitDuration?: number;
}

export interface OptimizeRouteRequest {
    userId?: string;
    places: OptimizeRoutePlace[];
    constraints: {
        startLocation?: { lat: number; lng: number };
        startTime?: string;
        timeBudgetMinutes?: number;
        travelTypes: ('PUBLIC_TRANSPORT' | 'WALKING' | 'DRIVING' | 'CYCLING' | 'E_SCOOTER')[];
        budget?: number;
    };
    options: {
        includeRealtimeTransit: boolean;
        algorithm?: 'TSP_2OPT' | 'RAPTOR' | 'GREEDY' | 'GENETIC' | 'auto';
    };
}

export interface OptimizedStop {
    placeId: string;
    name: string;
    lat: number;
    lng: number;
    order: number;
    arrivalTime?: string;
    departureTime?: string;
    visitDuration?: number;
}

export interface TransportLeg {
    from: { placeId: string; name: string; lat: number; lng: number; seq: number };
    to: { placeId: string; name: string; lat: number; lng: number; seq: number };
    travelType: string;
    travelTimeSeconds: number;
    distanceMeters: number;
    cost: number;
    provider: string;
}

export interface OptimizeRouteResponse {
    success: boolean;
    jobId: string;
    optimizedOrder: OptimizedStop[];
    legs: TransportLeg[];
    estimatedDurationMinutes: number;
    totalDistanceMeters: number;
    algorithmUsed: string;
    processingTime: string;
    notes?: string;
}

// ── Convert trip attractions → optimizer format ───────────────────────────
export function attractionsToPlaces(attractions: Attraction[]): OptimizeRoutePlace[] {
    return attractions.map((a) => ({
        id: a.id,
        name: a.name,
        lat: a.coordinates.lat,
        lng: a.coordinates.lng,
        imageUrl: a.image,
        priority: 5,
        visitDuration: a.durationMinutes,
    }));
}

// ── Optimize route ────────────────────────────────────────────────────────
export async function optimizeRoute(
    attractions: Attraction[],
    options?: {
        startLocation?: { lat: number; lng: number };
        travelTypes?: ('PUBLIC_TRANSPORT' | 'WALKING' | 'DRIVING')[];
    }
): Promise<OptimizeRouteResponse> {
    const payload: OptimizeRouteRequest = {
        places: attractionsToPlaces(attractions),
        constraints: {
            startLocation: options?.startLocation,
            travelTypes: options?.travelTypes || ['DRIVING'],
        },
        options: {
            includeRealtimeTransit: false,
            algorithm: 'auto',
        },
    };

    const res = await fetch(`${BASE_URL}/api/v1/optimize-route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Route optimization failed: ${res.status}`);
    }

    const data = await res.json();

    // Check if it's the new direct format
    if (data.jobId && (data.orderedAttractions || data.dailyPlan)) {
        return data as OptimizeRouteResponse;
    }

    if (!data.success) throw new Error(data.error || 'Route optimization failed');
    return data;
}

// ── Multi-Day Itinerary Generation ────────────────────────────────────────

export interface ItineraryStop {
    seq: number;
    attractionId: string;
    name: string;
    category: string;
    description: string;
    image: string;
    lat: number;
    lng: number;
    arrivalTime: string;
    departureTime: string;
    visitDurationMinutes: number;
    travelFromPrevMinutes: number;
    transportMode: string;
    distanceFromPrevKm: number;
}

export interface ItineraryDayPlan {
    day: number;
    date?: string;
    title: string;
    stops: ItineraryStop[];
    summary: {
        totalTravelMinutes: number;
        totalVisitMinutes: number;
        totalMinutes: number;
        score: number;
    };
}

export interface ItineraryResponse {
    jobId: string;
    destination: string;
    numDays: number;
    dailyPlan: ItineraryDayPlan[];
    unassigned: any[];
    summary: {
        totalAttractions: number;
        assignedAttractions: number;
        totalScore: number;
        totalTravelMinutes: number;
        totalVisitMinutes: number;
        algorithmMs: number;
    };
    mapData: {
        centre: { lat: number; lng: number };
        markers: Array<{ lat: number; lng: number; label: string; day: number }>;
    };
    notes: string[];
}

export async function generateMultiDayItinerary(
    attractions: Attraction[],
    numDays: number,
    destination: string,
    preferences?: {
        maxDailyMinutes?: number;
        travelType?: string;
        dayStartTime?: string;
        avgSpeedKmh?: number;
    },
): Promise<ItineraryResponse> {
    const payload = {
        destination,
        numDays,
        attractions: attractions.map(a => ({
            id: a.id,
            name: a.name,
            lat: a.coordinates.lat,
            lng: a.coordinates.lng,
            priority: 5,
            visitDuration: a.durationMinutes,
            category: a.category,
            image: a.image
        })),
        preferences: {
            dayStartTime: preferences?.dayStartTime ?? "09:00",
            maxDailyMinutes: preferences?.maxDailyMinutes ?? 600,
            avgSpeedKmh: preferences?.avgSpeedKmh ?? 30,
            travelType: preferences?.travelType ?? "DRIVING",
        },
    };

    const res = await fetch(`${BASE_URL}/api/v1/generate-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || `Itinerary generation failed: ${res.status}`);
    }

    const data = await res.json();

    // Check if it's the new direct format (has jobId) or legacy wrapper
    if (data.jobId && (data.dailyPlan || data.optimizedOrder)) {
        return data as ItineraryResponse;
    }

    if (!data.success) throw new Error(data.error || 'Itinerary generation failed');
    return data.data;
}
