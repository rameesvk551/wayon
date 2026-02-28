/**
 * Packing Assistant Service
 * Proxies packing-list CRUD operations to the itinerary editor service.
 */
export class PackingAssistantService {
    #editorBaseUrl;

    /**
     * @param {string} editorBaseUrl — e.g. "http://localhost:4015"
     */
    constructor(editorBaseUrl) {
        this.#editorBaseUrl = editorBaseUrl;
    }

    /* ── helpers ──────────────────────────────────────────── */

    async #fetchTrip(tripId) {
        const res = await fetch(`${this.#editorBaseUrl}/api/trips/${tripId}`, {
            headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json.error || `Failed to fetch trip ${tripId}`);
        }
        return json.data;
    }

    async #updateTrip(tripId, updates) {
        const res = await fetch(`${this.#editorBaseUrl}/api/trips/${tripId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
            throw new Error(json.error || `Failed to update trip ${tripId}`);
        }
        return json.data;
    }

    /* ── public API ──────────────────────────────────────── */

    /**
     * Get the packing list for a trip.
     * @param {string} tripId
     */
    async getPackingList(tripId) {
        const trip = await this.#fetchTrip(tripId);
        return {
            tripId,
            items: trip.packing || [],
        };
    }

    /**
     * Add a packing item to the trip.
     * @param {string} tripId
     * @param {{ id: string, label: string, categoryId: string, checked: boolean, suggestedByWeather?: boolean }} item
     */
    async addPackingItem(tripId, item) {
        const trip = await this.#fetchTrip(tripId);
        const packing = [...(trip.packing || []), item];
        const updated = await this.#updateTrip(tripId, { packing });
        return { tripId, items: updated.packing || packing };
    }

    /**
     * Toggle the checked state of a packing item.
     * @param {string} tripId
     * @param {string} itemId
     */
    async togglePackingItem(tripId, itemId) {
        const trip = await this.#fetchTrip(tripId);
        const packing = (trip.packing || []).map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        const updated = await this.#updateTrip(tripId, { packing });
        return { tripId, items: updated.packing || packing };
    }

    /**
     * Remove a packing item by id.
     * @param {string} tripId
     * @param {string} itemId
     */
    async removePackingItem(tripId, itemId) {
        const trip = await this.#fetchTrip(tripId);
        const packing = (trip.packing || []).filter((item) => item.id !== itemId);
        const updated = await this.#updateTrip(tripId, { packing });
        return { tripId, items: updated.packing || packing };
    }

    /**
     * Bulk replace the entire packing list (used for weather suggestions, etc.).
     * @param {string} tripId
     * @param {Array} items
     */
    async replacePackingList(tripId, items) {
        const updated = await this.#updateTrip(tripId, { packing: items });
        return { tripId, items: updated.packing || items };
    }
}
