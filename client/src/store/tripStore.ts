import { create } from 'zustand';
import type { Trip, DayItinerary, ChatMessage } from '../types';
import { trips } from '../data/trips';
import { greekItineraryDays } from '../data/itinerary';
import { initialChatMessage } from '../data/chatMessages';

interface TripState {
    // Current trip data
    currentTrip: Trip | null;
    currentItinerary: DayItinerary[];
    selectedDay: number;

    // Chat state
    messages: ChatMessage[];
    isTyping: boolean;

    // Map state
    mapCenter: { lat: number; lng: number };
    mapZoom: number;

    // Actions
    setCurrentTrip: (trip: Trip | null) => void;
    setSelectedDay: (dayNumber: number) => void;
    addMessage: (message: ChatMessage) => void;
    setIsTyping: (isTyping: boolean) => void;
    setMapCenter: (center: { lat: number; lng: number }) => void;
    setMapZoom: (zoom: number) => void;
    loadTrip: (tripId: string) => void;
}

export const useTripStore = create<TripState>((set, get) => ({
    // Initial state
    currentTrip: null,
    currentItinerary: [],
    selectedDay: 1,
    messages: [initialChatMessage],
    isTyping: false,
    mapCenter: { lat: 37.9838, lng: 23.7275 }, // Athens
    mapZoom: 1,

    // Actions
    setCurrentTrip: (trip) => set({ currentTrip: trip }),

    setSelectedDay: (dayNumber) => {
        set({ selectedDay: dayNumber });

        // Update map center based on selected day
        const day = get().currentItinerary.find(d => d.dayNumber === dayNumber);
        if (day) {
            // Map city to coordinates (simplified)
            const cityCoords: Record<string, { lat: number; lng: number }> = {
                'Athens': { lat: 37.9838, lng: 23.7275 },
                'Mykonos': { lat: 37.4467, lng: 25.3289 },
                'Santorini': { lat: 36.3932, lng: 25.4615 }
            };
            const coords = cityCoords[day.city];
            if (coords) {
                set({ mapCenter: coords });
            }
        }
    },

    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    setIsTyping: (isTyping) => set({ isTyping }),

    setMapCenter: (center) => set({ mapCenter: center }),

    setMapZoom: (zoom) => set({ mapZoom: zoom }),

    loadTrip: (tripId) => {
        const trip = trips.find(t => t.id === tripId);
        if (trip) {
            set({
                currentTrip: trip,
                currentItinerary: greekItineraryDays, // For demo, always use Greek itinerary
                selectedDay: 1
            });
        }
    }
}));
