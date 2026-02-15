import { create } from 'zustand';
import type { Attraction, AttractionFilter, TripAttraction } from '../types/attraction';
import { generateMultiDayItinerary, type OptimizeRouteResponse, type ItineraryResponse } from '../api/routeOptimizerApi';
import { generateItineraryPdf, downloadPdfFromBase64, type PdfResult } from '../api/pdfServiceApi';

export type TripPace = 'relaxed' | 'moderate' | 'packed';
export type TravelType = 'DRIVING' | 'WALKING' | 'PUBLIC_TRANSPORT' | 'CYCLING';

export interface TripSettings {
    numDays: number;
    pace: TripPace;
    travelType: TravelType;
}

const PACE_TO_MINUTES: Record<TripPace, number> = {
    relaxed: 480,
    moderate: 600,
    packed: 720,
};

interface AttractionStore {
    // Trip builder state
    tripAttractions: TripAttraction[];
    isTripSheetOpen: boolean;
    toastMessage: string | null;

    // Trip settings
    tripSettings: TripSettings;

    // Filters
    filters: AttractionFilter;
    isFilterOpen: boolean;

    // Map
    isMapView: boolean;
    selectedPinId: string | null;

    // Itinerary build state
    isBuilding: boolean;
    buildProgress: string;
    itineraryResult: OptimizeRouteResponse | ItineraryResponse | null;
    pdfResult: PdfResult | null;
    buildError: string | null;
    isResultSheetOpen: boolean;

    // Actions - Trip
    addAttraction: (attraction: Attraction) => void;
    removeAttraction: (id: string) => void;
    reorderAttractions: (from: number, to: number) => void;
    clearTrip: () => void;
    setTripSheetOpen: (open: boolean) => void;
    dismissToast: () => void;
    setTripSettings: (s: Partial<TripSettings>) => void;

    // Actions - Filters
    setFilters: (filters: Partial<AttractionFilter>) => void;
    resetFilters: () => void;
    setFilterOpen: (open: boolean) => void;

    // Actions - Map
    toggleMapView: () => void;
    setSelectedPin: (id: string | null) => void;

    // Actions - Itinerary
    buildItinerary: () => Promise<void>;
    downloadPdf: () => void;
    setResultSheetOpen: (open: boolean) => void;
    clearItineraryResult: () => void;

    // Computed
    totalDurationMinutes: () => number;
    tripCount: () => number;
    isInTrip: (id: string) => boolean;
}

const defaultFilters: AttractionFilter = {
    categories: [],
    minRating: 0,
    duration: null,
    freeOnly: false,
    openNow: false,
};

export const useAttractionStore = create<AttractionStore>((set, get) => ({
    tripAttractions: [],
    isTripSheetOpen: false,
    toastMessage: null,
    tripSettings: { numDays: 1, pace: 'moderate', travelType: 'DRIVING' },
    filters: { ...defaultFilters },
    isFilterOpen: false,
    isMapView: false,
    selectedPinId: null,

    // Itinerary build state
    isBuilding: false,
    buildProgress: '',
    itineraryResult: null,
    pdfResult: null,
    buildError: null,
    isResultSheetOpen: false,

    addAttraction: (attraction) => {
        const { tripAttractions } = get();
        if (tripAttractions.some((t) => t.id === attraction.id)) return;
        set({
            tripAttractions: [
                ...tripAttractions,
                { id: attraction.id, attraction, order: tripAttractions.length },
            ],
            toastMessage: `${attraction.name} added to trip!`,
        });
        // Auto-dismiss toast after 2.5s
        setTimeout(() => set({ toastMessage: null }), 2500);
    },

    removeAttraction: (id) => {
        set((s) => ({
            tripAttractions: s.tripAttractions
                .filter((t) => t.id !== id)
                .map((t, i) => ({ ...t, order: i })),
        }));
    },

    reorderAttractions: (from, to) => {
        set((s) => {
            const items = [...s.tripAttractions];
            const [moved] = items.splice(from, 1);
            items.splice(to, 0, moved);
            return { tripAttractions: items.map((t, i) => ({ ...t, order: i })) };
        });
    },

    clearTrip: () => set({ tripAttractions: [], isTripSheetOpen: false }),
    setTripSheetOpen: (open) => set({ isTripSheetOpen: open }),
    dismissToast: () => set({ toastMessage: null }),
    setTripSettings: (partial) =>
        set((s) => ({ tripSettings: { ...s.tripSettings, ...partial } })),

    setFilters: (partial) =>
        set((s) => ({ filters: { ...s.filters, ...partial } })),
    resetFilters: () => set({ filters: { ...defaultFilters } }),
    setFilterOpen: (open) => set({ isFilterOpen: open }),

    toggleMapView: () => set((s) => ({ isMapView: !s.isMapView })),
    setSelectedPin: (id) => set({ selectedPinId: id }),

    // ── Build Itinerary ───────────────────────────────────────────────────
    buildItinerary: async () => {
        const { tripAttractions, tripSettings } = get();
        if (tripAttractions.length < 2) return;

        const attractions = tripAttractions.map((t) => t.attraction);
        const city = attractions[0]?.city || 'Trip';

        set({
            isBuilding: true,
            buildProgress: 'Optimizing route...',
            buildError: null,
            itineraryResult: null,
            pdfResult: null,
        });

        try {
            // Step 1: Optimize route (Multi-Day)
            const numDays = tripSettings.numDays;
            const maxDailyMinutes = PACE_TO_MINUTES[tripSettings.pace];
            const routeResult = await generateMultiDayItinerary(
                attractions,
                numDays,
                city,
                {
                    maxDailyMinutes,
                    travelType: tripSettings.travelType,
                },
            );
            set({
                itineraryResult: routeResult,
                buildProgress: 'Generating PDF...',
            });

            // Step 2: Generate PDF (Optional)
            try {
                // Flatten stops for PDF compatibility check
                const flatStops: any[] = [];
                let stopsForPdf: any[] = [];

                if ('dailyPlan' in routeResult) {
                    // Multi-day result
                    (routeResult as ItineraryResponse).dailyPlan.forEach(day => {
                        day.stops.forEach(stop => {
                            flatStops.push({
                                placeId: stop.attractionId,
                                name: stop.name,
                                lat: stop.lat,
                                lng: stop.lng,
                                order: stop.seq,
                                visitDuration: stop.visitDurationMinutes
                            });
                        });
                    });
                    stopsForPdf = flatStops;
                } else {
                    // Single-day / legacy result
                    stopsForPdf = (routeResult as OptimizeRouteResponse).optimizedOrder;
                }

                const pdf = await generateItineraryPdf(
                    attractions,
                    stopsForPdf,
                    city,
                );
                set({ pdfResult: pdf });
            } catch (pdfErr: any) {
                console.warn('PDF generation skipped:', pdfErr.message);
                set({ toastMessage: `PDF Error: ${pdfErr.message}` });
            }


            set({
                isBuilding: false,
                buildProgress: '',
                isResultSheetOpen: true,
                isTripSheetOpen: false,
            });
        } catch (err: any) {
            set({
                isBuilding: false,
                buildProgress: '',
                buildError: err.message || 'Failed to build itinerary',
            });
        }
    },

    downloadPdf: () => {
        const { pdfResult } = get();
        if (pdfResult?.pdfBytesBase64) {
            downloadPdfFromBase64(pdfResult.pdfBytesBase64);
        }
    },

    setResultSheetOpen: (open) => set({ isResultSheetOpen: open }),

    clearItineraryResult: () =>
        set({ itineraryResult: null, pdfResult: null, buildError: null, isResultSheetOpen: false }),

    totalDurationMinutes: () =>
        get().tripAttractions.reduce((sum, t) => sum + t.attraction.durationMinutes, 0),
    tripCount: () => get().tripAttractions.length,
    isInTrip: (id) => get().tripAttractions.some((t) => t.id === id),
}));
