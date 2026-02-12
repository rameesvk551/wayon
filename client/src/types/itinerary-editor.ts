// ═══════════════════════════════════════════════════════════════════════════
// ITINERARY EDITOR — Frontend Type Definitions
// ═══════════════════════════════════════════════════════════════════════════

export type TripStatus = 'draft' | 'final';
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type ItemCategory =
    | 'sightseeing' | 'food' | 'adventure' | 'culture'
    | 'relaxation' | 'shopping' | 'nightlife' | 'nature'
    | 'historical' | 'general';

export interface EditableItem {
    _id?: string;
    itemId: string;
    attractionId?: string;
    name: string;
    description?: string;
    lat: number;
    lng: number;
    startTime: string;
    duration: number;        // minutes
    category: ItemCategory;
    image?: string;
    isLocked: boolean;
    userModified: boolean;
    aiSuggested: boolean;
    order: number;
}

export interface EditableDay {
    dayNumber: number;
    date: string;
    title?: string;
    items: EditableItem[];
}

export interface EditableTrip {
    _id?: string;
    tripId: string;
    userId?: string;
    destination: string;
    tripName: string;
    status: TripStatus;
    startDate: string;
    totalDays: number;
    days: EditableDay[];
    unassigned: EditableItem[];
    metadata?: {
        algorithmMs?: number;
        source?: string;
    };
    currentVersion: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface VersionEntry {
    _id: string;
    tripId: string;
    version: number;
    changeDescription: string;
    changedBy: string;
    createdAt: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    details?: any[];
}

export interface ReorderPayload {
    itemId: string;
    sourceDayNumber: number;
    targetDayNumber: number;
    newOrder: number;
}

export interface AddItemInput {
    dayNumber: number;
    name: string;
    lat?: number;
    lng?: number;
    startTime?: string;
    duration?: number;
    category?: ItemCategory;
    description?: string;
    image?: string;
}

// Category icon mapping
export const CATEGORY_ICONS: Record<ItemCategory, string> = {
    sightseeing: '🏛️',
    food: '🍽️',
    adventure: '🧗',
    culture: '🎭',
    relaxation: '🧘',
    shopping: '🛍️',
    nightlife: '🌃',
    nature: '🌿',
    historical: '🏰',
    general: '📍',
};

export const CATEGORY_COLORS: Record<ItemCategory, string> = {
    sightseeing: '#6366f1',
    food: '#f59e0b',
    adventure: '#ef4444',
    culture: '#8b5cf6',
    relaxation: '#06b6d4',
    shopping: '#ec4899',
    nightlife: '#7c3aed',
    nature: '#22c55e',
    historical: '#d97706',
    general: '#64748b',
};
