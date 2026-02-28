// ═══════════════════════════════════════════════════════════════════════════
// PACKING ASSISTANT — API Client Layer
// ═══════════════════════════════════════════════════════════════════════════

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4333';

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

export interface PackingItemPayload {
    id?: string;
    label: string;
    categoryId: string;
    checked: boolean;
    suggestedByWeather?: boolean;
}

export interface PackingListResult {
    tripId: string;
    items: PackingItemPayload[];
}

// ── Get packing list for a trip ──────────────────────────────────────────
export async function getPackingItems(tripId: string): Promise<PackingListResult> {
    return request<PackingListResult>(`/api/packing/${tripId}/items`);
}

// ── Add a packing item ──────────────────────────────────────────────────
export async function addPackingItem(tripId: string, item: PackingItemPayload): Promise<PackingListResult> {
    return request<PackingListResult>(`/api/packing/${tripId}/items`, {
        method: 'POST',
        body: JSON.stringify(item),
    });
}

// ── Toggle packing item checked state ───────────────────────────────────
export async function togglePackingItem(tripId: string, itemId: string): Promise<PackingListResult> {
    return request<PackingListResult>(`/api/packing/${tripId}/items/${itemId}/toggle`, {
        method: 'PATCH',
    });
}

// ── Remove a packing item ───────────────────────────────────────────────
export async function removePackingItem(tripId: string, itemId: string): Promise<PackingListResult> {
    return request<PackingListResult>(`/api/packing/${tripId}/items/${itemId}`, {
        method: 'DELETE',
    });
}

// ── Bulk replace packing list ───────────────────────────────────────────
export async function replacePackingList(tripId: string, items: PackingItemPayload[]): Promise<PackingListResult> {
    return request<PackingListResult>(`/api/packing/${tripId}/items`, {
        method: 'PUT',
        body: JSON.stringify({ items }),
    });
}
