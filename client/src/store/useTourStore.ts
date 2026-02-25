import { create } from 'zustand';
import type { TourListingItem, TourSortOption, TourCategory } from '../data/tourListingData';
import { searchTours, getTourById, POPULAR_DESTINATIONS } from '../api/tourApi';

interface TourFilters {
    priceRange: [number, number];
    duration: string; // 'all' | '1-3' | '4-7' | '7+'
    categories: TourCategory[];
    minRating: number;
    groupSize: string; // 'all' | 'small' | 'medium' | 'large'
    languages: string[];
}

interface TourStoreState {
    // Data
    tours: TourListingItem[];
    selectedTour: TourListingItem | null;

    // Search
    searchQuery: string;
    destination: string;
    date: string;
    tourType: string;

    // Coordinates (for API search)
    searchLat: number;
    searchLng: number;

    // Filters
    filters: TourFilters;
    sortBy: TourSortOption;

    // View
    viewMode: 'grid' | 'list';

    // Wishlist
    wishlist: Set<string>;

    // Pagination
    page: number;
    pageSize: number;
    isLoading: boolean;
    hasMore: boolean;

    // Error
    error: string | null;

    // Actions
    setSearchQuery: (q: string) => void;
    setDestination: (d: string) => void;
    setDate: (d: string) => void;
    setTourType: (t: string) => void;
    setSortBy: (s: TourSortOption) => void;
    setFilters: (f: Partial<TourFilters>) => void;
    resetFilters: () => void;
    toggleWishlist: (id: string) => void;
    setViewMode: (m: 'grid' | 'list') => void;
    loadMore: () => void;
    refresh: () => void;

    // API actions
    fetchTours: (latitude?: number, longitude?: number) => Promise<void>;
    fetchTourById: (id: string) => Promise<TourListingItem | null>;

    // Derived
    getFilteredTours: () => TourListingItem[];
    getDisplayedTours: () => TourListingItem[];
    getActiveFilterCount: () => number;
    getTourById: (id: string) => TourListingItem | undefined;
    getRelatedTours: (tourId: string) => TourListingItem[];
}

const defaultFilters: TourFilters = {
    priceRange: [0, 5000],
    duration: 'all',
    categories: [],
    minRating: 0,
    groupSize: 'all',
    languages: [],
};

// Default: Paris
const DEFAULT_LAT = 48.8566;
const DEFAULT_LNG = 2.3522;

export const useTourStore = create<TourStoreState>((set, get) => ({
    // Data
    tours: [],
    selectedTour: null,

    // Search
    searchQuery: '',
    destination: '',
    date: '',
    tourType: '',

    // Coordinates
    searchLat: DEFAULT_LAT,
    searchLng: DEFAULT_LNG,

    // Filters
    filters: { ...defaultFilters },
    sortBy: 'recommended',

    // View
    viewMode: 'grid',

    // Wishlist
    wishlist: new Set<string>(),

    // Pagination
    page: 1,
    pageSize: 6,
    isLoading: false,
    hasMore: true,

    // Error
    error: null,

    // ── Actions ──────────────────────────────────────────────────────────

    setSearchQuery: (q) => set({ searchQuery: q, page: 1 }),
    setDestination: (d) => {
        // Try to resolve destination name to coordinates
        const match = POPULAR_DESTINATIONS.find(
            (dest) => dest.name.toLowerCase().includes(d.toLowerCase())
        );
        if (match) {
            set({ destination: d, searchLat: match.lat, searchLng: match.lng });
        } else {
            set({ destination: d });
        }
    },
    setDate: (d) => set({ date: d }),
    setTourType: (t) => set({ tourType: t }),
    setSortBy: (s) => set({ sortBy: s, page: 1 }),
    setFilters: (f) =>
        set((state) => ({
            filters: { ...state.filters, ...f },
            page: 1,
            hasMore: true,
        })),
    resetFilters: () => set({ filters: { ...defaultFilters }, sortBy: 'recommended', page: 1, hasMore: true }),

    toggleWishlist: (id) =>
        set((state) => {
            const next = new Set(state.wishlist);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return { wishlist: next };
        }),

    setViewMode: (m) => set({ viewMode: m }),

    loadMore: () => {
        const { page, pageSize, isLoading } = get();
        if (isLoading) return;
        const filtered = get().getFilteredTours();
        if (page * pageSize >= filtered.length) {
            set({ hasMore: false });
            return;
        }
        set({ isLoading: true });
        setTimeout(() => {
            set((state) => ({
                page: state.page + 1,
                isLoading: false,
                hasMore: (state.page + 1) * state.pageSize < filtered.length,
            }));
        }, 300);
    },

    refresh: () => {
        const { searchLat, searchLng } = get();
        get().fetchTours(searchLat, searchLng);
    },

    // ── API Actions ──────────────────────────────────────────────────────

    fetchTours: async (latitude?: number, longitude?: number) => {
        const lat = latitude || get().searchLat;
        const lng = longitude || get().searchLng;

        set({ isLoading: true, error: null, page: 1, hasMore: true });

        try {
            const tours = await searchTours({
                latitude: lat,
                longitude: lng,
                radius: 20,
                limit: 30,
            });

            set({
                tours,
                isLoading: false,
                searchLat: lat,
                searchLng: lng,
                hasMore: tours.length > get().pageSize,
            });

            console.log(`✅ Loaded ${tours.length} tours from API`);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error('Failed to fetch tours:', errMsg);
            set({ isLoading: false, error: errMsg });
        }
    },

    fetchTourById: async (id: string) => {
        // Check local cache first
        const existing = get().tours.find((t) => t.id === id);
        if (existing) {
            set({ selectedTour: existing });
            return existing;
        }

        // Fetch from API
        try {
            const tour = await getTourById(id);
            if (tour) {
                set({ selectedTour: tour });
            }
            return tour;
        } catch (error) {
            console.error('Failed to fetch tour by ID:', error);
            return null;
        }
    },

    // ── Derived ──────────────────────────────────────────────────────────

    getFilteredTours: () => {
        const { tours, searchQuery, filters, sortBy } = get();
        let results = [...tours];

        // Text search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.location.toLowerCase().includes(q) ||
                    t.country.toLowerCase().includes(q) ||
                    t.category.toLowerCase().includes(q)
            );
        }

        // Price range
        results = results.filter(
            (t) => t.price >= filters.priceRange[0] && t.price <= filters.priceRange[1]
        );

        // Duration
        if (filters.duration !== 'all') {
            switch (filters.duration) {
                case '1-3':
                    results = results.filter((t) => t.durationDays >= 1 && t.durationDays <= 3);
                    break;
                case '4-7':
                    results = results.filter((t) => t.durationDays >= 4 && t.durationDays <= 7);
                    break;
                case '7+':
                    results = results.filter((t) => t.durationDays > 7);
                    break;
            }
        }

        // Categories
        if (filters.categories.length > 0) {
            results = results.filter((t) => filters.categories.includes(t.category));
        }

        // Rating
        if (filters.minRating > 0) {
            results = results.filter((t) => t.rating >= filters.minRating);
        }

        // Group size
        if (filters.groupSize !== 'all') {
            switch (filters.groupSize) {
                case 'small':
                    results = results.filter((t) => t.maxGroupSize <= 8);
                    break;
                case 'medium':
                    results = results.filter((t) => t.maxGroupSize > 8 && t.maxGroupSize <= 14);
                    break;
                case 'large':
                    results = results.filter((t) => t.maxGroupSize > 14);
                    break;
            }
        }

        // Languages
        if (filters.languages.length > 0) {
            results = results.filter((t) =>
                filters.languages.some((l) => t.language.includes(l))
            );
        }

        // Sort
        switch (sortBy) {
            case 'price_low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price_high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                results.sort((a, b) => b.rating - a.rating);
                break;
            case 'popularity':
                results.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            case 'duration':
                results.sort((a, b) => a.durationDays - b.durationDays);
                break;
            case 'recommended':
            default:
                results.sort((a, b) => (b.isAIRecommended ? 1 : 0) - (a.isAIRecommended ? 1 : 0));
                break;
        }

        return results;
    },

    getDisplayedTours: () => {
        const { page, pageSize } = get();
        const filtered = get().getFilteredTours();
        return filtered.slice(0, page * pageSize);
    },

    getActiveFilterCount: () => {
        const { filters, sortBy } = get();
        let count = 0;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) count++;
        if (filters.duration !== 'all') count++;
        count += filters.categories.length;
        if (filters.minRating > 0) count++;
        if (filters.groupSize !== 'all') count++;
        count += filters.languages.length;
        if (sortBy !== 'recommended') count++;
        return count;
    },

    getTourById: (id: string) => {
        return get().tours.find((t) => t.id === id);
    },

    getRelatedTours: (tourId: string) => {
        const tours = get().tours;
        const tour = tours.find((t) => t.id === tourId);
        if (!tour) return [];
        return tours
            .filter((t) => t.id !== tourId && (t.category === tour.category || t.country === tour.country))
            .slice(0, 4);
    },
}));
