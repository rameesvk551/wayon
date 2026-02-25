/**
 * Hotel API Service
 * 
 * Communicates with the hotel-service backend to fetch real hotel data.
 * Maps backend responses to the frontend HotelListingItem type.
 */

import type { HotelListingItem } from '../data/hotelListingData';

// Backend API base URL — points to the hotel microservice
const HOTEL_API_URL = import.meta.env.VITE_HOTEL_API_URL || 'http://localhost:4005';

/**
 * Backend Hotel response type (from hotel-service domain model)
 */
interface BackendHotel {
    id: string;
    name: string;
    lat: number;
    lng: number;
    price: number;
    currency: string;
    rating?: number;
    provider: string;
    address?: string;
    city?: string;
    country?: string;
    amenities?: string[];
    images?: string[];
    url?: string;
    description?: string;
    reviewCount?: number;
    originalPrice?: number;
    badges?: string[];
    landmark?: string;
    distance?: string;
    stars?: number;
}

interface BackendSearchResponse {
    hotels: BackendHotel[];
    cursor: number;
    hasMore: boolean;
    total: number;
}

/**
 * Search hotels from the backend API
 */
export async function searchHotels(params: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    limit?: number;
    cursor?: number;
}): Promise<{ hotels: HotelListingItem[]; cursor: number; hasMore: boolean; total: number }> {
    const queryParams = new URLSearchParams({
        destination: params.destination,
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: String(params.guests),
    });

    if (params.limit) queryParams.set('limit', String(params.limit));
    if (params.cursor) queryParams.set('cursor', String(params.cursor));

    const response = await fetch(`${HOTEL_API_URL}/api/hotels/search?${queryParams}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error((errorData as { error?: string }).error || `Hotel search failed (${response.status})`);
    }

    const data: BackendSearchResponse = await response.json();

    return {
        hotels: data.hotels.map(mapBackendToFrontend),
        cursor: data.cursor,
        hasMore: data.hasMore,
        total: data.total,
    };
}

/**
 * Simple search by city (legacy endpoint)
 */
export async function searchHotelsByCity(city: string, limit = 20): Promise<HotelListingItem[]> {
    const response = await fetch(`${HOTEL_API_URL}/api/hotels?city=${encodeURIComponent(city)}&limit=${limit}`);

    if (!response.ok) {
        throw new Error(`Hotel search failed (${response.status})`);
    }

    const data: { hotels: BackendHotel[] } = await response.json();
    return data.hotels.map(mapBackendToFrontend);
}

/**
 * Map backend Hotel model to frontend HotelListingItem model
 */
function mapBackendToFrontend(hotel: BackendHotel): HotelListingItem {
    // Determine badges based on rating and price
    const badges: string[] = hotel.badges || [];
    if (!badges.length) {
        if (hotel.rating && hotel.rating >= 4.5) badges.push('Top Rated');
        if (hotel.price > 0 && hotel.price < 100) badges.push('Best Value');
        if (hotel.distance && parseFloat(hotel.distance) < 1) badges.push('Near Beach');
    }

    // Determine if AI recommended (high rating + good price)
    const isAIRecommended = (hotel.rating || 0) >= 4.5 && hotel.price > 0;

    return {
        id: hotel.id,
        name: hotel.name,
        images: hotel.images || [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop',
        ],
        rating: hotel.rating || 4.0,
        reviewCount: hotel.reviewCount || Math.floor(Math.random() * 2000) + 100,
        price: hotel.price,
        originalPrice: hotel.originalPrice,
        currency: hotel.currency === 'USD' ? '$' : hotel.currency,
        location: hotel.city || hotel.address || 'Unknown',
        distance: hotel.distance || `${(Math.random() * 5).toFixed(1)} km`,
        landmark: hotel.landmark || hotel.city || 'City Center',
        amenities: hotel.amenities || ['Free WiFi'],
        badges,
        isAIRecommended,
        coordinates: { lat: hotel.lat, lng: hotel.lng },
        description: hotel.description || `${hotel.name} — ${hotel.provider}`,
    };
}

/**
 * Get default check-in/check-out dates (today + 3 days, today + 5 days)
 */
export function getDefaultDates(): { checkIn: string; checkOut: string } {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 3);
    const checkOut = new Date(today);
    checkOut.setDate(today.getDate() + 5);

    return {
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
    };
}
