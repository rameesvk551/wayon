// ===== HOTEL LISTING TYPES & STATIC DATA =====

export interface HotelListingItem {
    id: string;
    name: string;
    images: string[];
    rating: number;
    reviewCount: number;
    price: number;
    originalPrice?: number;
    currency: string;
    location: string;
    distance: string;
    landmark: string;
    amenities: string[];
    badges: string[];
    isAIRecommended: boolean;
    coordinates: { lat: number; lng: number };
    description: string;
}

/**
 * @deprecated Use useHotelStore.fetchHotels() to get real data from the API.
 * This fallback data is kept only for offline/development scenarios.
 */
export const mockHotels: HotelListingItem[] = [];

export const destinationSuggestions = [
    { id: 'd1', name: 'Bali, Indonesia', subtitle: 'Popular', icon: '🏝️' },
    { id: 'd2', name: 'Paris, France', subtitle: 'Popular', icon: '🗼' },
    { id: 'd3', name: 'London, UK', subtitle: 'Popular', icon: '🇬🇧' },
    { id: 'd4', name: 'Tokyo, Japan', subtitle: 'Popular', icon: '🗾' },
    { id: 'd5', name: 'Dubai, UAE', subtitle: 'Popular', icon: '🏙️' },
    { id: 'd6', name: 'New York, USA', subtitle: 'Popular', icon: '🗽' },
    { id: 'd7', name: 'Singapore', subtitle: 'Popular', icon: '🇸🇬' },
    { id: 'd8', name: 'Bangkok, Thailand', subtitle: 'Popular', icon: '🏛️' },
    { id: 'd9', name: 'Maldives', subtitle: 'Popular', icon: '🐠' },
    { id: 'd10', name: 'Rome, Italy', subtitle: 'Popular', icon: '🏛️' },
];

export const allAmenities = [
    'Free WiFi', 'Pool', 'Spa', 'Breakfast', 'Restaurant',
    'Gym', 'Parking', 'Cafe', 'Beach Access', 'Room Service',
    'Air Conditioning', 'Bar', 'Laundry',
];

export type SortOption = 'recommended' | 'price_low' | 'price_high' | 'rating' | 'reviews' | 'distance';

export const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviews' },
    { value: 'distance', label: 'Nearest First' },
];
