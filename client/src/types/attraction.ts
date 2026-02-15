// ===== ATTRACTION DISCOVERY TYPES =====

export interface TrendingCity {
    id: string;
    name: string;
    country: string;
    image: string;
    attractionCount: number;
    coordinates: { lat: number; lng: number };
}

export type AttractionCategoryId =
    | 'historical'
    | 'nature'
    | 'food'
    | 'spiritual'
    | 'adventure'
    | 'nightlife';

export interface AttractionCategory {
    id: AttractionCategoryId;
    label: string;
    icon: string; // emoji
}

export interface Attraction {
    id: string;
    name: string;
    city: string;
    image: string;
    rating: number;
    reviewCount: number;
    description: string;
    duration: string;       // e.g. "2-3 hours"
    durationMinutes: number;
    category: AttractionCategoryId;
    price: number;          // 0 = free
    isFree: boolean;
    isOpenNow: boolean;
    coordinates: { lat: number; lng: number };
    tags: string[];
    // Extended fields from API
    address?: string;
    photos?: string[];
    types?: string[];
}

export interface AttractionFilter {
    categories: AttractionCategoryId[];
    minRating: number;        // e.g. 4
    duration: string | null;  // '1-2h' | 'half-day' | 'full-day' | null
    freeOnly: boolean;
    openNow: boolean;
}

export interface TripAttraction {
    id: string;
    attraction: Attraction;
    order: number;
}
