/**
 * Express controller for Budget Tracker endpoints.
 */
export class BudgetTrackerController {
    #service;

    /**
     * @param {import('../services/budget-tracker.service.js').BudgetTrackerService} service
     */
    constructor(service) {
        this.#service = service;

        this.getExpenses = this.getExpenses.bind(this);
        this.addExpense = this.addExpense.bind(this);
        this.removeExpense = this.removeExpense.bind(this);
        this.updateBudgetSettings = this.updateBudgetSettings.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** GET /:tripId/expenses */
    async getExpenses(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) return res.status(400).json({ error: "tripId is required" });

            const result = await this.#service.getExpenses(tripId);
            return res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** POST /:tripId/expenses */
    async addExpense(req, res, next) {
        try {
            const { tripId } = req.params;
            const { id, categoryId, amount, date, note } = req.body;

            if (!tripId) return res.status(400).json({ error: "tripId is required" });
            if (!categoryId || amount == null || !date) {
                return res.status(400).json({
                    error: "categoryId, amount, and date are required",
                });
            }

            const expense = {
                id: id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                categoryId,
                amount: Math.max(0, Number(amount)),
                date,
                note: note?.trim() || undefined,
            };

            const result = await this.#service.addExpense(tripId, expense);
            return res.status(201).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** DELETE /:tripId/expenses/:expenseId */
    async removeExpense(req, res, next) {
        try {
            const { tripId, expenseId } = req.params;
            if (!tripId || !expenseId) {
                return res.status(400).json({ error: "tripId and expenseId are required" });
            }

            const result = await this.#service.removeExpense(tripId, expenseId);
            return res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** PUT /:tripId/settings */
    async updateBudgetSettings(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) return res.status(400).json({ error: "tripId is required" });

            const result = await this.#service.updateBudgetSettings(tripId, req.body);
            return res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** GET /health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "budget-tracker-module" });
    }
}
