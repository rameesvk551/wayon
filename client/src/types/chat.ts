import type { UIResponse } from './ui-schema';

export interface TripPreferences {
    destination: string | null;
    companions: string | null;
    budget: string | null;
    dates: string | null;
    currentLocation: string | null;
    transportMode: string | null;
    interests: string[];
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

// Day plan types matching backend itinerary-generator output
export interface TravelDayPlan {
    day: number;
    type: 'travel';
    description: string;
}

export interface SightseeingDayPlan {
    day: number;
    region: string;
    activities: string[];
    totalDurationHours: number;
}

export interface LeisureDayPlan {
    day: number;
    type: 'leisure';
    description: string;
}

export type DayPlan = TravelDayPlan | SightseeingDayPlan | LeisureDayPlan;

export interface ItineraryOutput {
    destination: string;
    totalDays: number;
    dailyPlan: DayPlan[];
    unassignedAttractions?: string[];
    warnings?: string[];
}

export interface Message {
    id: string;
    type: 'ai' | 'user' | 'interactive';
    content?: string;
    blocks?: UIResponse;
    interactiveType?: 'destination' | 'companions' | 'budget' | 'dates' | 'hotel_dates' | 'location' | 'transport' | 'attractions' | 'interests' | 'summary' | 'itinerary';
    timestamp: Date;
    itineraryData?: ItineraryOutput;
    isLoading?: boolean;
}

export interface ChatApiResponse {
    schemaVersion?: string;
    sessionId?: string;
    message?: string;
    structured?: {
        reply?: string;
        itinerary?: unknown;
        next_questions?: string[];
    };
    itinerary?: unknown;
    fallback?: { itinerary?: unknown };
    ui?: UIResponse;
    uiBlocks?: UIResponse;
    intent?: {
        name: string;
        confidence?: number;
        slots?: Record<string, unknown>;
    };
    errors?: string[];
    toolCalls?: unknown[];
}

export const TRANSPORT_LABELS: Record<string, string> = {
    public: 'Public Transport',
    train: 'Train',
    private: 'Private Vehicle',
    flight: 'Flight'
};
