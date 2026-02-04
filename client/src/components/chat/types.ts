export interface TripPreferences {
    destination: string | null;
    companions: string | null;
    budget: string | null;
    dates: string | null;
    currentLocation: string | null;
    transportMode: string | null;
    interests: string[];
}

export interface DayPlan {
    day: number;
    type?: 'travel' | 'leisure';
    description?: string;
    region?: string;
    activities?: string[];
    totalDurationHours?: number;
}

export interface ItineraryOutput {
    destination: string;
    totalDays: number;
    dailyPlan: DayPlan[];
    unassignedAttractions?: string[];
    warnings?: string[];
}

export interface Attraction {
    id: string;
    name: string;
    category: string;
    rating: number;
    duration: string;
    price: string;
    image: string;
    description: string;
    highlights?: string[];
    openingHours?: string;
    address?: string;
    lat?: number;
    lng?: number;
}
