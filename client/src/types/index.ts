// ===== DESTINATION TYPES =====
export interface Destination {
    id: string;
    name: string;
    country: string;
    image: string;
    rating: number;
    reviewCount: number;
    description: string;
    tags: string[];
    coordinates: {
        lat: number;
        lng: number;
    };
}

// ===== TRIP TYPES =====
export interface Trip {
    id: string;
    name: string;
    destinations: string[];
    startDate: string;
    endDate: string;
    coverImage: string;
    status: 'draft' | 'planned' | 'completed';
    totalDays: number;
    travelers: number;
}

// ===== CITY TYPES =====
export interface City {
    id: string;
    name: string;
    country: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    image: string;
    description: string;
}

// ===== TRANSPORT TYPES =====
export type TransportType = 'flight' | 'train' | 'ferry' | 'car' | 'bus' | 'walk';

export interface Transport {
    id: string;
    type: TransportType;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price?: number;
    carrier?: string;
}

// ===== HOTEL TYPES =====
export interface Hotel {
    id: string;
    name: string;
    city: string;
    image: string;
    rating: number;
    pricePerNight: number;
    amenities: string[];
    checkIn: string;
    checkOut: string;
}

// ===== ACTIVITY TYPES =====
export interface Activity {
    id: string;
    name: string;
    description: string;
    image: string;
    duration: string;
    price?: number;
    startTime: string;
    endTime: string;
    location: string;
    category: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'relaxation' | 'shopping';
}

// ===== ITINERARY TYPES =====
export interface DayItinerary {
    id: string;
    dayNumber: number;
    date: string;
    city: string;
    cityImage: string;
    activities: Activity[];
    transport?: Transport;
    hotel?: Hotel;
    isExpanded?: boolean;
}

export interface Itinerary {
    id: string;
    tripId: string;
    name: string;
    days: DayItinerary[];
}

// ===== CHAT TYPES =====
export interface ChatMessage {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
    suggestions?: string[];
}

// ===== MAP TYPES =====
export interface MapMarker {
    id: string;
    name: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    type: 'city' | 'hotel' | 'activity' | 'transport';
    isActive?: boolean;
}

export interface MapRoute {
    id: string;
    from: MapMarker;
    to: MapMarker;
    transportType: TransportType;
    isActive?: boolean;
}
