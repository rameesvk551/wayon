// ═══════════════════════════════════════════════════════════════════════════
// TOUR LISTING DATA — Type Definitions (data fetched from API)
// ═══════════════════════════════════════════════════════════════════════════

export interface TourItineraryDay {
    day: number;
    title: string;
    description: string;
    activities: string[];
}

export interface TourReview {
    id: string;
    userName: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    helpful: number;
}

export interface TourFAQ {
    question: string;
    answer: string;
}

export interface TourListingItem {
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
    category: TourCategory;
    rating: number;
    reviewCount: number;
    groupSize: string;
    maxGroupSize: number;
    language: string[];
    badges: string[];
    isAIRecommended: boolean;
    highlights: string[];
    itinerary: TourItineraryDay[];
    included: string[];
    excluded: string[];
    faq: TourFAQ[];
    reviews: TourReview[];
    availableDates: string[];
    meetingPoint: string;
    difficultyLevel: 'Easy' | 'Moderate' | 'Challenging';
}

export type TourCategory = 'Adventure' | 'Cultural' | 'Nature' | 'City Tours';
export type TourSortOption = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'popularity' | 'duration';

export const tourCategories: TourCategory[] = ['Adventure', 'Cultural', 'Nature', 'City Tours'];

export const tourLanguages = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin', 'Arabic', 'Portuguese'];

export const tourSortOptions: { value: TourSortOption; label: string }[] = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'duration', label: 'Shortest First' },
];

export const tourDestinations = [
    { id: 'td1', name: 'Paris, France', subtitle: 'Tours', icon: '🗼' },
    { id: 'td2', name: 'Bali, Indonesia', subtitle: 'Tours', icon: '🏝️' },
    { id: 'td3', name: 'Tokyo, Japan', subtitle: 'Tours', icon: '⛩️' },
    { id: 'td4', name: 'New York, USA', subtitle: 'Tours', icon: '🗽' },
    { id: 'td5', name: 'London, UK', subtitle: 'Tours', icon: '🏰' },
    { id: 'td6', name: 'Rome, Italy', subtitle: 'Tours', icon: '🏛️' },
    { id: 'td7', name: 'Barcelona, Spain', subtitle: 'Tours', icon: '🎭' },
    { id: 'td8', name: 'Dubai, UAE', subtitle: 'Tours', icon: '🏙️' },
];
