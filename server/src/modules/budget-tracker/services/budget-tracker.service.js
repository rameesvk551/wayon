/**
 * Budget Tracker Service
 * Proxies budget CRUD operations to the itinerary editor service.
 */
export class BudgetTrackerService {
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
     * Get all expenses for a trip.
     * @param {string} tripId
     */
    async getExpenses(tripId) {
        const trip = await this.#fetchTrip(tripId);
        return {
            tripId,
            expenses: trip.budget || [],
            budgetSettings: trip.budgetSettings || null,
        };
    }

    /**
     * Add a new expense to the trip.
     * @param {string} tripId
     * @param {{ id: string, categoryId: string, amount: number, date: string, note?: string }} expense
     */
    async addExpense(tripId, expense) {
        const trip = await this.#fetchTrip(tripId);
        const budget = [expense, ...(trip.budget || [])];
        const updated = await this.#updateTrip(tripId, { budget });
        return { tripId, expenses: updated.budget || budget };
    }

    /**
     * Remove an expense by id.
     * @param {string} tripId
     * @param {string} expenseId
     */
    async removeExpense(tripId, expenseId) {
        const trip = await this.#fetchTrip(tripId);
        const budget = (trip.budget || []).filter((e) => e.id !== expenseId);
        const updated = await this.#updateTrip(tripId, { budget });
        return { tripId, expenses: updated.budget || budget };
    }

    /**
     * Update budget settings (totalBudget, categories).
     * @param {string} tripId
     * @param {object} settings
     */
    async updateBudgetSettings(tripId, settings) {
        const updated = await this.#updateTrip(tripId, { budgetSettings: settings });
        return { tripId, budgetSettings: updated.budgetSettings || settings };
    }
}
