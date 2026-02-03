import { create } from 'zustand';
import type { Trip, TripWizardData, TravelStyle, CompanionType } from '../types';

// Rich dummy trips data
const dummyTrips: Trip[] = [
    {
        id: '1',
        userId: '1',
        destination: 'Paris, France',
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        budget: 2500,
        travelStyle: 'mid-range',
        companions: 'couple',
        interests: ['culture', 'food', 'photography'],
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
        itinerary: [
            {
                id: 'd1',
                day: 1,
                date: '2026-03-15',
                title: 'Arrival & Eiffel Tower',
                activities: [
                    { id: 'a1', time: '10:00', title: 'Arrive at Charles de Gaulle Airport', type: 'transport', duration: '2h', notes: 'Take RER B to city center' },
                    { id: 'a2', time: '14:00', title: 'Check-in at Hotel Le Marais', type: 'accommodation', duration: '1h', location: 'Le Marais District' },
                    { id: 'a3', time: '16:00', title: 'Visit Eiffel Tower', type: 'attraction', duration: '3h', cost: 25, location: 'Champ de Mars' },
                    { id: 'a4', time: '20:00', title: 'Dinner at Le Petit Cler', type: 'food', duration: '2h', cost: 60, notes: 'French bistro' },
                ],
            },
            {
                id: 'd2',
                day: 2,
                date: '2026-03-16',
                title: 'Louvre & Seine Cruise',
                activities: [
                    { id: 'a5', time: '09:00', title: 'Louvre Museum', type: 'attraction', duration: '4h', cost: 17, location: 'Rue de Rivoli' },
                    { id: 'a6', time: '14:00', title: 'Lunch at Café Marly', type: 'food', duration: '1.5h', cost: 45 },
                    { id: 'a7', time: '16:00', title: 'Walk along Champs-Élysées', type: 'activity', duration: '2h' },
                    { id: 'a8', time: '19:00', title: 'Seine River Cruise', type: 'activity', duration: '2h', cost: 35 },
                ],
            },
            {
                id: 'd3',
                day: 3,
                date: '2026-03-17',
                title: 'Montmartre & Art',
                activities: [
                    { id: 'a9', time: '10:00', title: 'Sacré-Cœur Basilica', type: 'attraction', duration: '2h', location: 'Montmartre' },
                    { id: 'a10', time: '12:30', title: 'Lunch at Pink Mamma', type: 'food', duration: '1.5h', cost: 40 },
                    { id: 'a11', time: '15:00', title: 'Musée d\'Orsay', type: 'attraction', duration: '3h', cost: 14 },
                    { id: 'a12', time: '20:00', title: 'Moulin Rouge Show', type: 'entertainment', duration: '3h', cost: 120 },
                ],
            },
        ],
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-15T10:00:00Z',
    },
    {
        id: '2',
        userId: '1',
        destination: 'Tokyo, Japan',
        startDate: '2026-04-01',
        endDate: '2026-04-14',
        budget: 4000,
        travelStyle: 'mid-range',
        companions: 'solo',
        interests: ['culture', 'food', 'adventure'],
        status: 'planned',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
        itinerary: [
            {
                id: 'd1',
                day: 1,
                date: '2026-04-01',
                title: 'Tokyo Arrival',
                activities: [
                    { id: 'a1', time: '14:00', title: 'Arrive at Narita Airport', type: 'transport', duration: '2h' },
                    { id: 'a2', time: '17:00', title: 'Check-in at Shinjuku Hotel', type: 'accommodation', duration: '1h' },
                    { id: 'a3', time: '19:00', title: 'Explore Shinjuku at night', type: 'activity', duration: '3h' },
                    { id: 'a4', time: '21:00', title: 'Ramen at Ichiran', type: 'food', duration: '1h', cost: 15 },
                ],
            },
            {
                id: 'd2',
                day: 2,
                date: '2026-04-02',
                title: 'Traditional Tokyo',
                activities: [
                    { id: 'a5', time: '08:00', title: 'Tsukiji Outer Market', type: 'food', duration: '2h', cost: 30 },
                    { id: 'a6', time: '11:00', title: 'Senso-ji Temple', type: 'attraction', duration: '2h', location: 'Asakusa' },
                    { id: 'a7', time: '14:00', title: 'Tokyo Skytree', type: 'attraction', duration: '2h', cost: 20 },
                    { id: 'a8', time: '18:00', title: 'Akihabara Electronics District', type: 'shopping', duration: '3h' },
                ],
            },
        ],
        createdAt: '2026-01-20T14:30:00Z',
        updatedAt: '2026-01-20T14:30:00Z',
    },
    {
        id: '3',
        userId: '1',
        destination: 'Bali, Indonesia',
        startDate: '2026-01-05',
        endDate: '2026-01-12',
        budget: 1800,
        travelStyle: 'budget',
        companions: 'friends',
        interests: ['beach', 'nature', 'wellness'],
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
        itinerary: [
            {
                id: 'd1',
                day: 1,
                date: '2026-01-05',
                title: 'Ubud Adventure',
                activities: [
                    { id: 'a1', time: '09:00', title: 'Tegallalang Rice Terraces', type: 'attraction', duration: '3h' },
                    { id: 'a2', time: '13:00', title: 'Monkey Forest Sanctuary', type: 'attraction', duration: '2h', cost: 10 },
                    { id: 'a3', time: '16:00', title: 'Yoga Session', type: 'wellness', duration: '1.5h', cost: 15 },
                    { id: 'a4', time: '19:00', title: 'Traditional Balinese dinner', type: 'food', duration: '2h', cost: 20 },
                ],
            },
        ],
        createdAt: '2025-12-01T08:00:00Z',
        updatedAt: '2026-01-12T18:00:00Z',
    },
    {
        id: '4',
        userId: '1',
        destination: 'New York, USA',
        startDate: '2026-05-10',
        endDate: '2026-05-17',
        budget: 3500,
        travelStyle: 'mid-range',
        companions: 'family',
        interests: ['culture', 'shopping', 'food'],
        status: 'planned',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
        itinerary: [
            {
                id: 'd1',
                day: 1,
                date: '2026-05-10',
                title: 'Manhattan Highlights',
                activities: [
                    { id: 'a1', time: '10:00', title: 'Statue of Liberty & Ellis Island', type: 'attraction', duration: '4h', cost: 24 },
                    { id: 'a2', time: '15:00', title: 'Walk the Brooklyn Bridge', type: 'activity', duration: '1.5h' },
                    { id: 'a3', time: '18:00', title: 'DUMBO Pizza', type: 'food', duration: '1h', cost: 25 },
                    { id: 'a4', time: '20:00', title: 'Times Square at Night', type: 'attraction', duration: '2h' },
                ],
            },
        ],
        createdAt: '2026-02-01T11:00:00Z',
        updatedAt: '2026-02-01T11:00:00Z',
    },
    {
        id: '5',
        userId: '1',
        destination: 'Dubai, UAE',
        startDate: '2026-06-01',
        endDate: '2026-06-07',
        budget: 5000,
        travelStyle: 'luxury',
        companions: 'couple',
        interests: ['shopping', 'adventure', 'food'],
        status: 'planned',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
        itinerary: [
            {
                id: 'd1',
                day: 1,
                date: '2026-06-01',
                title: 'Dubai Icons',
                activities: [
                    { id: 'a1', time: '10:00', title: 'Burj Khalifa At The Top', type: 'attraction', duration: '2h', cost: 45 },
                    { id: 'a2', time: '14:00', title: 'Dubai Mall Shopping', type: 'shopping', duration: '4h' },
                    { id: 'a3', time: '19:00', title: 'Dubai Fountain Show', type: 'entertainment', duration: '1h' },
                    { id: 'a4', time: '20:30', title: 'Fine Dining at Atmosphere', type: 'food', duration: '2h', cost: 200 },
                ],
            },
        ],
        createdAt: '2026-02-10T09:00:00Z',
        updatedAt: '2026-02-10T09:00:00Z',
    },
];

interface TripStore {
    // Trip wizard state
    wizardData: TripWizardData;
    currentStep: number;
    totalSteps: number;

    // Trips list
    trips: Trip[];
    currentTrip: Trip | null;
    isGenerating: boolean;

    // Wizard actions
    setDestination: (destination: string) => void;
    setDuration: (duration: string) => void;
    setCompanions: (companions: CompanionType) => void;
    setBudget: (budget: number) => void;
    setTravelStyle: (style: TravelStyle) => void;
    setDates: (dates: { startDate: string; endDate: string; flexible: boolean }) => void;
    toggleInterest: (interest: string) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetWizard: () => void;

    // Trip actions
    generateTrip: () => Promise<Trip | null>;
    setTrips: (trips: Trip[]) => void;
    setCurrentTrip: (trip: Trip | null) => void;
    addTrip: (trip: Trip) => void;
    updateTrip: (id: string, updates: Partial<Trip>) => void;
    deleteTrip: (id: string) => void;

    // Helpers
    getWizardSummary: () => string;
}

const initialWizardData: TripWizardData = {
    destination: null,
    duration: null,
    companions: null,
    budget: null,
    travelStyle: null,
    dates: null,
    interests: [],
};

export const useTripStore = create<TripStore>((set, get) => ({
    wizardData: initialWizardData,
    currentStep: 0,
    totalSteps: 6,
    trips: dummyTrips,
    currentTrip: null,
    isGenerating: false,

    // Wizard setters
    setDestination: (destination) =>
        set((state) => ({
            wizardData: { ...state.wizardData, destination },
        })),

    setDuration: (duration) =>
        set((state) => ({
            wizardData: { ...state.wizardData, duration },
        })),

    setCompanions: (companions) =>
        set((state) => ({
            wizardData: { ...state.wizardData, companions },
        })),

    setBudget: (budget) =>
        set((state) => ({
            wizardData: { ...state.wizardData, budget },
        })),

    setTravelStyle: (travelStyle) =>
        set((state) => ({
            wizardData: { ...state.wizardData, travelStyle },
        })),

    setDates: (dates) =>
        set((state) => ({
            wizardData: { ...state.wizardData, dates },
        })),

    toggleInterest: (interest) =>
        set((state) => ({
            wizardData: {
                ...state.wizardData,
                interests: state.wizardData.interests.includes(interest)
                    ? state.wizardData.interests.filter((i) => i !== interest)
                    : [...state.wizardData.interests, interest],
            },
        })),

    nextStep: () =>
        set((state) => ({
            currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
        })),

    prevStep: () =>
        set((state) => ({
            currentStep: Math.max(state.currentStep - 1, 0),
        })),

    resetWizard: () =>
        set({
            wizardData: initialWizardData,
            currentStep: 0,
        }),

    // Trip actions
    generateTrip: async () => {
        set({ isGenerating: true });
        try {
            // This will be replaced with actual API call
            const { wizardData } = get();
            const mockTrip: Trip = {
                id: Date.now().toString(),
                userId: '1',
                destination: wizardData.destination || 'Unknown',
                startDate: wizardData.dates?.startDate || new Date().toISOString(),
                endDate: wizardData.dates?.endDate || new Date().toISOString(),
                budget: wizardData.budget || 1000,
                travelStyle: wizardData.travelStyle || 'mid-range',
                companions: wizardData.companions || 'solo',
                interests: wizardData.interests,
                itinerary: [],
                status: 'planned',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            set((state) => ({
                trips: [...state.trips, mockTrip],
                currentTrip: mockTrip,
                isGenerating: false,
            }));

            return mockTrip;
        } catch (error) {
            set({ isGenerating: false });
            return null;
        }
    },

    setTrips: (trips) => set({ trips }),
    setCurrentTrip: (currentTrip) => set({ currentTrip }),

    addTrip: (trip) =>
        set((state) => ({
            trips: [...state.trips, trip],
        })),

    updateTrip: (id, updates) =>
        set((state) => ({
            trips: state.trips.map((trip) =>
                trip.id === id ? { ...trip, ...updates, updatedAt: new Date().toISOString() } : trip
            ),
        })),

    deleteTrip: (id) =>
        set((state) => ({
            trips: state.trips.filter((trip) => trip.id !== id),
        })),

    getWizardSummary: () => {
        const { wizardData } = get();
        let summary = "I want to plan a trip";

        if (wizardData.destination) summary += ` to ${wizardData.destination}`;
        if (wizardData.duration) summary += ` for ${wizardData.duration}`;
        if (wizardData.companions) summary += `, traveling ${wizardData.companions}`;
        if (wizardData.travelStyle) summary += `, ${wizardData.travelStyle} style`;
        if (wizardData.budget) summary += `, budget $${wizardData.budget}`;
        if (wizardData.interests.length > 0) summary += `. Interested in ${wizardData.interests.join(', ')}`;

        return summary + ".";
    },
}));
