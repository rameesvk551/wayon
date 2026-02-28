// ═══════════════════════════════════════════════════════════════════════════
// ITINERARY EDITOR — API Client Layer
// ═══════════════════════════════════════════════════════════════════════════

import type {
    EditableTrip,
    VersionEntry,
    ReorderPayload,
    AddItemInput,
} from '../types/itinerary-editor';

const BASE_URL = import.meta.env.VITE_ITINERARY_EDITOR_URL || 'http://localhost:4015';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options,
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
        throw new Error(json.error || `API error: ${res.status}`);
    }
    return json.data;
}

// ── Generate trip from AI itinerary data ─────────────────────────────────
export async function generateTrip(data: any): Promise<EditableTrip> {
    return request<EditableTrip>('/api/trips/generate', {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// ── Get trip ─────────────────────────────────────────────────────────────
export async function getTrip(tripId: string): Promise<EditableTrip> {
    return request<EditableTrip>(`/api/trips/${tripId}`);
}

// ── Get User's Trips ─────────────────────────────────────────────────────
export async function getTripsByUser(userId: string): Promise<EditableTrip[]> {
    return request<EditableTrip[]>(`/api/trips?userId=${userId}`);
}

// ── Update trip (autosave) ───────────────────────────────────────────────
export async function updateTrip(tripId: string, updates: Partial<EditableTrip>): Promise<EditableTrip> {
    return request<EditableTrip>(`/api/trips/${tripId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
    });
}

// ── Reorder item (drag and drop) ─────────────────────────────────────────
export async function reorderItem(tripId: string, payload: ReorderPayload): Promise<EditableTrip> {
    return request<EditableTrip>(`/api/trips/${tripId}/reorder`, {
        method: 'POST',
        body: JSON.stringify(payload),
    });
}

// ── Add item to a day ────────────────────────────────────────────────────
export async function addItem(tripId: string, input: AddItemInput): Promise<EditableTrip> {
    return request<EditableTrip>(`/api/trips/${tripId}/items`, {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

// ── Remove item ──────────────────────────────────────────────────────────
export async function removeItem(tripId: string, itemId: string): Promise<EditableTrip> {
    return request<EditableTrip>(`/api/trips/${tripId}/items/${itemId}`, {
        method: 'DELETE',
    });
}

// ── Recalculate (AI re-optimize) ─────────────────────────────────────────
export async function recalculateTrip(tripId: string): Promise<EditableTrip> {
    return request<EditableTrip>(`/api/trips/${tripId}/recalculate`, {
        method: 'POST',
    });
}

// ── Get version history ──────────────────────────────────────────────────
export async function getVersions(tripId: string): Promise<VersionEntry[]> {
    return request<VersionEntry[]>(`/api/trips/${tripId}/versions`);
}

// ── Restore a version ────────────────────────────────────────────────────
export async function restoreVersion(tripId: string, version: number): Promise<EditableTrip> {
    return request<EditableTrip>(`/api/trips/${tripId}/versions/${version}/restore`, {
        method: 'POST',
    });
}
