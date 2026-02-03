// TypeScript interfaces for AI Travel Planner

// User types
export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    createdAt: string;
}

// Auth types
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Trip types
export interface Trip {
    id: string;
    userId: string;
    destination: string;
    startDate: string;
    endDate: string;
    budget: number;
    travelStyle: TravelStyle;
    companions: CompanionType;
    interests: string[];
    itinerary: DayPlan[];
    status: TripStatus;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export type TravelStyle = "budget" | "mid-range" | "luxury" | "adventure" | "family";
export type CompanionType = "solo" | "couple" | "family" | "friends" | "group";
export type TripStatus = "draft" | "planned" | "upcoming" | "ongoing" | "completed";

// Itinerary types
export interface DayPlan {
    id?: string;
    day: number;
    date: string;
    title?: string;
    activities: Activity[];
}

export interface Activity {
    id: string;
    title?: string;
    name?: string;
    description?: string;
    location?: string | Location;
    time?: string;
    startTime?: string;
    endTime?: string;
    duration?: string;
    type: ActivityType;
    cost?: number;
    image?: string;
    rating?: number;
    notes?: string;
}

export type ActivityType =
    | "attraction"
    | "restaurant"
    | "food"
    | "hotel"
    | "accommodation"
    | "transport"
    | "activity"
    | "shopping"
    | "entertainment"
    | "wellness";

export interface Location {
    name: string;
    address?: string;
    latitude?: number;
    longitude?: number;
}

// Hotel types
export interface Hotel {
    id: string;
    name: string;
    address: string;
    rating: number;
    pricePerNight: number;
    image: string;
    amenities: string[];
    location: Location;
}

// Flight types
export interface Flight {
    id: string;
    airline: string;
    flightNumber: string;
    departure: FlightPoint;
    arrival: FlightPoint;
    price: number;
    class: "economy" | "business" | "first";
}

export interface FlightPoint {
    airport: string;
    city: string;
    time: string;
    date: string;
}

// Destination types
export interface Destination {
    id: string;
    name: string;
    country: string;
    image: string;
    rating: number;
    description: string;
    priceRange: string;
    bestTime: string;
}

// Wizard types
export interface TripWizardData {
    destination: string | null;
    duration: string | null;
    companions: CompanionType | null;
    budget: number | null;
    travelStyle: TravelStyle | null;
    dates: {
        startDate: string;
        endDate: string;
        flexible: boolean;
    } | null;
    interests: string[];
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}
