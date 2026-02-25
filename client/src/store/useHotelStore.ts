import { create } from 'zustand';
import { type HotelListingItem, type SortOption } from '../data/hotelListingData';
import { searchHotels, getDefaultDates } from '../services/hotelApi';

interface HotelFilters {
    priceRange: [number, number];
    minRating: number;
    amenities: string[];
    badges: string[];
}

interface HotelStoreState {
    // Data
    hotels: HotelListingItem[];

    // Search
    searchQuery: string;
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: number;

    // Filters
    filters: HotelFilters;
    sortBy: SortOption;

    // View
    viewMode: 'list' | 'map';

    // Wishlist
    wishlist: Set<string>;

    // Pagination
    page: number;
    pageSize: number;
    isLoading: boolean;
    hasMore: boolean;
    error: string | null;
    cursor: number;
    totalResults: number;

    // Actions
    setSearchQuery: (q: string) => void;
    setDestination: (d: string) => void;
    setCheckIn: (d: string) => void;
    setCheckOut: (d: string) => void;
    setGuests: (n: number) => void;
    setSortBy: (s: SortOption) => void;
    setFilters: (f: Partial<HotelFilters>) => void;
    resetFilters: () => void;
    toggleWishlist: (id: string) => void;
    setViewMode: (m: 'list' | 'map') => void;
    loadMore: () => void;
    refresh: () => void;
    fetchHotels: (opts?: { append?: boolean }) => Promise<void>;

    // Derived
    getFilteredHotels: () => HotelListingItem[];
    getDisplayedHotels: () => HotelListingItem[];
    getActiveFilterCount: () => number;
}

const defaultFilters: HotelFilters = {
    priceRange: [0, 1000],
    minRating: 0,
    amenities: [],
    badges: [],
};

const defaultDates = getDefaultDates();

export const useHotelStore = create<HotelStoreState>((set, get) => ({
    // Data
    hotels: [],

    // Search
    searchQuery: '',
    destination: 'Bali, Indonesia',
    checkIn: defaultDates.checkIn,
    checkOut: defaultDates.checkOut,
    guests: 2,

    // Filters
    filters: { ...defaultFilters },
    sortBy: 'recommended',

    // View
    viewMode: 'list',

    // Wishlist
    wishlist: new Set<string>(),

    // Pagination
    page: 1,
    pageSize: 20,
    isLoading: false,
    hasMore: true,
    error: null,
    cursor: 0,
    totalResults: 0,

    // Actions
    setSearchQuery: (q) => set({ searchQuery: q }),
    setDestination: (d) => set({ destination: d }),
    setCheckIn: (d) => set({ checkIn: d }),
    setCheckOut: (d) => set({ checkOut: d }),
    setGuests: (n) => set({ guests: Math.max(1, Math.min(10, n)) }),
    setSortBy: (s) => set({ sortBy: s, page: 1 }),
    setFilters: (f) =>
        set((state) => ({
            filters: { ...state.filters, ...f },
            page: 1,
        })),
    resetFilters: () => set({ filters: { ...defaultFilters }, sortBy: 'recommended', page: 1 }),

    toggleWishlist: (id) =>
        set((state) => {
            const next = new Set(state.wishlist);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return { wishlist: next };
        }),

    setViewMode: (m) => set({ viewMode: m }),

    /**
     * Fetch hotels from the backend API
     */
    fetchHotels: async (opts?: { append?: boolean }) => {
        const { destination, checkIn, checkOut, guests, pageSize, cursor, isLoading } = get();

        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
            const result = await searchHotels({
                destination,
                checkIn,
                checkOut,
                guests,
                limit: pageSize,
                cursor: opts?.append ? cursor : 0,
            });

            set((state) => ({
                hotels: opts?.append
                    ? [...state.hotels, ...result.hotels]
                    : result.hotels,
                cursor: result.cursor,
                hasMore: result.hasMore,
                totalResults: result.total,
                isLoading: false,
                page: 1,
            }));
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : 'Failed to fetch hotels';
            console.error('Hotel fetch error:', errMsg);
            set({ error: errMsg, isLoading: false });
        }
    },

    loadMore: () => {
        const { hasMore, isLoading } = get();
        if (isLoading || !hasMore) return;
        get().fetchHotels({ append: true });
    },

    refresh: () => {
        set({ hotels: [], cursor: 0, page: 1, hasMore: true, error: null });
        get().fetchHotels();
    },

    // Derived — client-side filtering on top of API results
    getFilteredHotels: () => {
        const { hotels, searchQuery, filters, sortBy } = get();
        let results = [...hotels];

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            results = results.filter(
                (h) =>
                    h.name.toLowerCase().includes(q) ||
                    h.location.toLowerCase().includes(q) ||
                    h.landmark.toLowerCase().includes(q)
            );
        }

        // Price range
        results = results.filter(
            (h) => h.price >= filters.priceRange[0] && h.price <= filters.priceRange[1]
        );

        // Rating
        if (filters.minRating > 0) {
            results = results.filter((h) => h.rating >= filters.minRating);
        }

        // Amenities
        if (filters.amenities.length > 0) {
            results = results.filter((h) =>
                filters.amenities.every((a) => h.amenities.includes(a))
            );
        }

        // Badges
        if (filters.badges.length > 0) {
            results = results.filter((h) =>
                filters.badges.some((b) => h.badges.includes(b))
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
            case 'reviews':
                results.sort((a, b) => b.reviewCount - a.reviewCount);
                break;
            case 'distance':
                results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
            case 'recommended':
            default:
                results.sort((a, b) => (b.isAIRecommended ? 1 : 0) - (a.isAIRecommended ? 1 : 0));
                break;
        }

        return results;
    },

    getDisplayedHotels: () => {
        return get().getFilteredHotels();
    },

    getActiveFilterCount: () => {
        const { filters, sortBy } = get();
        let count = 0;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
        if (filters.minRating > 0) count++;
        count += filters.amenities.length;
        count += filters.badges.length;
        if (sortBy !== 'recommended') count++;
        return count;
    },
}));
