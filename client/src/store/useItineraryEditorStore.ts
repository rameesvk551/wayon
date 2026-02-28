// ═══════════════════════════════════════════════════════════════════════════
// ITINERARY EDITOR — Zustand Store
// ═══════════════════════════════════════════════════════════════════════════
// State management with:
//   • Optimistic updates (instant UI, rollback on error)
//   • Debounced autosave (1.5s after last change)
//   • Clean local vs server state separation
// ═══════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import type {
    EditableTrip,
    EditableItem,
    SaveStatus,
    VersionEntry,
    ReorderPayload,
    AddItemInput,
} from '../types/itinerary-editor';
import * as api from '../api/itineraryEditorApi';

interface ItineraryEditorState {
    // State
    trip: EditableTrip | null;
    saveStatus: SaveStatus;
    isRecalculating: boolean;
    isLoading: boolean;
    error: string | null;
    versions: VersionEntry[];
    isVersionDrawerOpen: boolean;
    addPlaceModal: { isOpen: boolean; dayNumber: number | null };

    // Actions
    loadTrip: (tripId: string) => Promise<void>;
    generateTrip: (data: any) => Promise<string | null>;
    updateItem: (dayNumber: number, itemId: string, updates: Partial<EditableItem>) => void;
    toggleLock: (dayNumber: number, itemId: string) => void;
    reorderItem: (payload: ReorderPayload) => void;
    addItem: (input: AddItemInput) => Promise<void>;
    removeItem: (dayNumber: number, itemId: string) => void;
    recalculate: () => Promise<void>;
    loadVersions: () => Promise<void>;
    restoreVersion: (version: number) => Promise<void>;
    setVersionDrawerOpen: (open: boolean) => void;
    setAddPlaceModal: (state: { isOpen: boolean; dayNumber: number | null }) => void;
    updateTripName: (name: string) => void;
    setStatus: (status: 'draft' | 'final') => void;
}

// Debounce timer ref
let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
const DEMO_TRIP_ID = 'demo';

const createDemoTrip = (): EditableTrip => ({
    tripId: DEMO_TRIP_ID,
    destination: 'Paris',
    tripName: 'Demo Paris Itinerary',
    status: 'draft',
    startDate: '2026-03-10',
    totalDays: 2,
    currentVersion: 1,
    metadata: { source: 'demo' },
    unassigned: [
        {
            itemId: 'demo-unassigned-1',
            name: 'Montmartre Walk',
            description: 'Optional evening walk in Montmartre',
            lat: 48.8867,
            lng: 2.3431,
            startTime: '19:00',
            duration: 90,
            category: 'culture',
            isLocked: false,
            userModified: false,
            aiSuggested: true,
            order: 0,
        },
    ],
    days: [
        {
            dayNumber: 1,
            date: '2026-03-10',
            title: 'Historic Center',
            items: [
                {
                    itemId: 'demo-day1-1',
                    name: 'Notre-Dame Cathedral',
                    lat: 48.853,
                    lng: 2.3499,
                    startTime: '09:00',
                    duration: 90,
                    category: 'historical',
                    isLocked: false,
                    userModified: false,
                    aiSuggested: true,
                    order: 0,
                },
                {
                    itemId: 'demo-day1-2',
                    name: 'Louvre Museum',
                    lat: 48.8606,
                    lng: 2.3376,
                    startTime: '11:30',
                    duration: 180,
                    category: 'culture',
                    isLocked: true,
                    userModified: false,
                    aiSuggested: true,
                    order: 1,
                },
            ],
        },
        {
            dayNumber: 2,
            date: '2026-03-11',
            title: 'Classic Paris',
            items: [
                {
                    itemId: 'demo-day2-1',
                    name: 'Eiffel Tower',
                    lat: 48.8584,
                    lng: 2.2945,
                    startTime: '10:00',
                    duration: 120,
                    category: 'sightseeing',
                    isLocked: false,
                    userModified: false,
                    aiSuggested: true,
                    order: 0,
                },
                {
                    itemId: 'demo-day2-2',
                    name: 'Seine River Cruise',
                    lat: 48.8566,
                    lng: 2.3522,
                    startTime: '14:00',
                    duration: 90,
                    category: 'relaxation',
                    isLocked: false,
                    userModified: false,
                    aiSuggested: true,
                    order: 1,
                },
            ],
        },
    ],
});

const debouncedAutosave = (tripId: string, trip: EditableTrip, set: any) => {
    if (autosaveTimer) clearTimeout(autosaveTimer);
    set({ saveStatus: 'saving' as SaveStatus });

    if (tripId === DEMO_TRIP_ID) {
        set({ saveStatus: 'saved' as SaveStatus });
        setTimeout(() => set({ saveStatus: 'idle' as SaveStatus }), 1200);
        return;
    }

    autosaveTimer = setTimeout(async () => {
        try {
            await api.updateTrip(tripId, {
                tripName: trip.tripName,
                status: trip.status,
                days: trip.days,
            } as any);
            set({ saveStatus: 'saved' as SaveStatus });
            // Reset to idle after 2s
            setTimeout(() => set({ saveStatus: 'idle' as SaveStatus }), 2000);
        } catch (err: any) {
            set({ saveStatus: 'error' as SaveStatus, error: err.message });
        }
    }, 1500);
};

export const useItineraryEditorStore = create<ItineraryEditorState>((set, get) => ({
    // Initial state
    trip: null,
    saveStatus: 'idle',
    isRecalculating: false,
    isLoading: false,
    error: null,
    versions: [],
    isVersionDrawerOpen: false,
    addPlaceModal: { isOpen: false, dayNumber: null },

    // ── Load trip from backend ─────────────────────────────────────────
    loadTrip: async (tripId: string) => {
        if (tripId === DEMO_TRIP_ID) {
            set({ trip: createDemoTrip(), isLoading: false, error: null });
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const trip = await api.getTrip(tripId);
            set({ trip, isLoading: false });
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
        }
    },

    // ── Generate new trip from AI data ─────────────────────────────────
    generateTrip: async (data: any) => {
        set({ isLoading: true, error: null });
        try {
            const trip = await api.generateTrip(data);
            set({ trip, isLoading: false });
            return trip.tripId;
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
            return null;
        }
    },

    // ── Update item inline (optimistic) ────────────────────────────────
    updateItem: (dayNumber, itemId, updates) => {
        const { trip } = get();
        if (!trip) return;

        const newDays = trip.days.map(day => {
            if (day.dayNumber !== dayNumber) return day;
            return {
                ...day,
                items: day.items.map(item =>
                    item.itemId === itemId
                        ? { ...item, ...updates, userModified: true, aiSuggested: false }
                        : item
                ),
            };
        });

        const newTrip = { ...trip, days: newDays };
        set({ trip: newTrip });
        debouncedAutosave(trip.tripId, newTrip, set);
    },

    // ── Toggle lock on item ────────────────────────────────────────────
    toggleLock: (dayNumber, itemId) => {
        const { trip } = get();
        if (!trip) return;

        const newDays = trip.days.map(day => {
            if (day.dayNumber !== dayNumber) return day;
            return {
                ...day,
                items: day.items.map(item =>
                    item.itemId === itemId
                        ? { ...item, isLocked: !item.isLocked }
                        : item
                ),
            };
        });

        const newTrip = { ...trip, days: newDays };
        set({ trip: newTrip });
        debouncedAutosave(trip.tripId, newTrip, set);
    },

    // ── Reorder item (drag-and-drop, optimistic) ──────────────────────
    reorderItem: (payload: ReorderPayload) => {
        const { trip } = get();
        if (!trip) return;

        // Optimistic: move item locally
        const newDays = [...trip.days.map(d => ({ ...d, items: [...d.items] }))];
        const sourceDay = newDays.find(d => d.dayNumber === payload.sourceDayNumber);
        if (!sourceDay) return;

        const itemIdx = sourceDay.items.findIndex(i => i.itemId === payload.itemId);
        if (itemIdx === -1) return;
        const [item] = sourceDay.items.splice(itemIdx, 1);
        item.userModified = true;

        const targetDay = newDays.find(d => d.dayNumber === payload.targetDayNumber);
        if (!targetDay) return;
        targetDay.items.splice(payload.newOrder, 0, item);

        // Re-assign order
        sourceDay.items.forEach((it, idx) => { it.order = idx; });
        if (payload.sourceDayNumber !== payload.targetDayNumber) {
            targetDay.items.forEach((it, idx) => { it.order = idx; });
        }

        const newTrip = { ...trip, days: newDays };
        set({ trip: newTrip });

        if (trip.tripId === DEMO_TRIP_ID) return;

        // Persist to backend (fire-and-forget with rollback)
        const previousTrip = trip;
        api.reorderItem(trip.tripId, payload).catch(err => {
            console.error('Reorder failed, rolling back:', err);
            set({ trip: previousTrip, error: 'Reorder failed' });
        });
    },

    // ── Add item ───────────────────────────────────────────────────────
    addItem: async (input: AddItemInput) => {
        const { trip } = get();
        if (!trip) return;

        if (trip.tripId === DEMO_TRIP_ID) {
            const newDays = trip.days.map(day => {
                if (day.dayNumber !== input.dayNumber) return day;
                const nextOrder = day.items.length;
                return {
                    ...day,
                    items: [
                        ...day.items,
                        {
                            itemId: `demo-item-${Date.now()}`,
                            name: input.name,
                            description: input.description || '',
                            lat: input.lat ?? 0,
                            lng: input.lng ?? 0,
                            startTime: input.startTime || '09:00',
                            duration: input.duration ?? 60,
                            category: input.category || 'general',
                            image: input.image,
                            isLocked: false,
                            userModified: true,
                            aiSuggested: false,
                            order: nextOrder,
                        },
                    ],
                };
            });
            set({
                trip: { ...trip, days: newDays },
                addPlaceModal: { isOpen: false, dayNumber: null },
            });
            return;
        }

        try {
            const updated = await api.addItem(trip.tripId, input);
            set({ trip: updated, addPlaceModal: { isOpen: false, dayNumber: null } });
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    // ── Remove item (optimistic) ───────────────────────────────────────
    removeItem: (dayNumber, itemId) => {
        const { trip } = get();
        if (!trip) return;

        const previousTrip = trip;
        const newDays = trip.days.map(day => {
            if (day.dayNumber !== dayNumber) return day;
            return {
                ...day,
                items: day.items.filter(item => item.itemId !== itemId),
            };
        });

        set({ trip: { ...trip, days: newDays } });

        if (trip.tripId === DEMO_TRIP_ID) return;

        api.removeItem(trip.tripId, itemId).catch(err => {
            console.error('Remove failed, rolling back:', err);
            set({ trip: previousTrip, error: 'Remove failed' });
        });
    },

    // ── Recalculate (AI re-optimization) ───────────────────────────────
    recalculate: async () => {
        const { trip } = get();
        if (!trip) return;
        if (trip.tripId === DEMO_TRIP_ID) {
            set({ isRecalculating: true, error: null });
            setTimeout(() => set({ isRecalculating: false }), 600);
            return;
        }

        set({ isRecalculating: true, error: null });
        try {
            const updated = await api.recalculateTrip(trip.tripId);
            set({ trip: updated, isRecalculating: false });
        } catch (err: any) {
            set({ isRecalculating: false, error: err.message });
        }
    },

    // ── Version history ────────────────────────────────────────────────
    loadVersions: async () => {
        const { trip } = get();
        if (!trip) return;
        if (trip.tripId === DEMO_TRIP_ID) {
            set({ versions: [] });
            return;
        }
        try {
            const versions = await api.getVersions(trip.tripId);
            set({ versions });
        } catch (err: any) {
            set({ error: err.message });
        }
    },

    restoreVersion: async (version: number) => {
        const { trip } = get();
        if (!trip) return;
        if (trip.tripId === DEMO_TRIP_ID) return;
        set({ isLoading: true });
        try {
            const restored = await api.restoreVersion(trip.tripId, version);
            set({ trip: restored, isLoading: false, isVersionDrawerOpen: false });
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
        }
    },

    // ── UI toggles ─────────────────────────────────────────────────────
    setVersionDrawerOpen: (open) => set({ isVersionDrawerOpen: open }),
    setAddPlaceModal: (state) => set({ addPlaceModal: state }),

    updateTripName: (name) => {
        const { trip } = get();
        if (!trip) return;
        const newTrip = { ...trip, tripName: name };
        set({ trip: newTrip });
        debouncedAutosave(trip.tripId, newTrip, set);
    },

    setStatus: (status) => {
        const { trip } = get();
        if (!trip) return;
        const newTrip = { ...trip, status };
        set({ trip: newTrip });
        debouncedAutosave(trip.tripId, newTrip, set);
    },
}));
