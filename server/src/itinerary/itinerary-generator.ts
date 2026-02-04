export type TransportMode = 'public' | 'private' | 'train' | 'flight';

export interface Attraction {
    name: string;
    region: string;
    latitude: number;
    longitude: number;
    estimatedDurationHours: number;
    category?: string;
}

export interface ItineraryInput {
    startLocation: string;
    destination: string;
    travelDates: { start: string; end: string };
    transportMode?: TransportMode | string;
    selectedAttractions: string[];
}

export interface ItineraryOptions {
    maxHoursPerDay: number;
    reserveTravelDays?: boolean;
    includeReturnTravelDay?: boolean;
}

export type DayPlan =
    | { day: number; type: 'travel'; description: string }
    | { day: number; type: 'leisure'; description: string }
    | { day: number; region: string; activities: string[]; totalDurationHours: number };

export interface ItineraryOutput {
    destination: string;
    totalDays: number;
    dailyPlan: DayPlan[];
    unassignedAttractions?: string[];
    warnings?: string[];
}

// Lightweight mock database for fallback attraction data
export const MOCK_ATTRACTIONS_DB: Attraction[] = [
    { name: 'Old Town Walking Tour', region: 'City Center', latitude: 0, longitude: 0, estimatedDurationHours: 3, category: 'culture' },
    { name: 'Riverfront Park', region: 'Waterfront', latitude: 0, longitude: 0, estimatedDurationHours: 2, category: 'nature' },
    { name: 'Local Food Market', region: 'Downtown', latitude: 0, longitude: 0, estimatedDurationHours: 1.5, category: 'food' },
    { name: 'Modern Art Museum', region: 'Museum District', latitude: 0, longitude: 0, estimatedDurationHours: 2.5, category: 'culture' },
    { name: 'Sunset Viewpoint', region: 'Hillside', latitude: 0, longitude: 0, estimatedDurationHours: 1.5, category: 'nature' },
];

function computeTotalDays(start: string, end: string): number {
    try {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate.getTime() - startDate.getTime();
        const diff = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        if (Number.isFinite(diff) && diff > 0) return diff;
    } catch {
        // Fallback to default below
    }
    return 5; // default to a long-weekend style trip
}

function sliceActivities(attractions: string[], maxPerDay: number): string[][] {
    const result: string[][] = [];
    for (let i = 0; i < attractions.length; i += maxPerDay) {
        result.push(attractions.slice(i, i + maxPerDay));
    }
    return result;
}

export function generateItinerary(
    input: ItineraryInput,
    options: ItineraryOptions,
    attractionsDb: Attraction[] = MOCK_ATTRACTIONS_DB
): ItineraryOutput {
    const totalDays = Math.max(3, computeTotalDays(input.travelDates.start, input.travelDates.end));
    const dailyPlan: DayPlan[] = [];
    const warnings: string[] = [];

    const normalizedMode = (input.transportMode || 'public') as string;

    // Reserve outbound travel day
    let currentDay = 1;
    if (options.reserveTravelDays) {
        dailyPlan.push({
            day: currentDay,
            type: 'travel',
            description: `Travel from ${input.startLocation} to ${input.destination} via ${normalizedMode}`,
        });
        currentDay += 1;
    }

    // Build attraction list (user provided first, then fallback)
    const userAttractions = input.selectedAttractions.filter(Boolean);
    const fallbackAttractions = attractionsDb.map(a => a.name).filter(name => !userAttractions.includes(name));
    const mergedAttractions = [...userAttractions, ...fallbackAttractions];

    const sightseeingDaysAvailable = options.includeReturnTravelDay ? totalDays - currentDay : totalDays - currentDay + 1;
    const maxActivitiesPerDay = Math.max(1, Math.floor(options.maxHoursPerDay / 3));
    const activityChunks = sliceActivities(mergedAttractions, maxActivitiesPerDay).slice(0, sightseeingDaysAvailable);

    activityChunks.forEach((activities, idx) => {
        dailyPlan.push({
            day: currentDay + idx,
            region: input.destination.split(',')[0]?.trim() || input.destination,
            activities,
            totalDurationHours: Math.min(options.maxHoursPerDay, activities.length * 3),
        });
    });

    currentDay += activityChunks.length;

    // Add a leisure buffer day if we still have time and no activities left
    if (currentDay <= totalDays - (options.includeReturnTravelDay ? 1 : 0) && activityChunks.length === 0) {
        dailyPlan.push({
            day: currentDay,
            type: 'leisure',
            description: 'Flex day for rest or spontaneous plans',
        });
        currentDay += 1;
    }

    // Return travel day if requested
    if (options.includeReturnTravelDay && currentDay <= totalDays) {
        dailyPlan.push({
            day: currentDay,
            type: 'travel',
            description: `Return travel from ${input.destination} to ${input.startLocation}`,
        });
    }

    const unassignedAttractions = mergedAttractions.slice(activityChunks.flat().length);
    if (unassignedAttractions.length > 0) {
        warnings.push('Some attractions were not scheduled due to time constraints.');
    }

    return {
        destination: input.destination,
        totalDays,
        dailyPlan,
        unassignedAttractions: unassignedAttractions.length ? unassignedAttractions : undefined,
        warnings: warnings.length ? warnings : undefined,
    };
}
