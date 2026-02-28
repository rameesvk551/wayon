import { Router } from "express";

/**
 * Registers all budget-tracker routes on an Express Router.
 * @param {import('../controller/budget-tracker.controller.js').BudgetTrackerController} controller
 * @returns {Router}
 */
export function createBudgetTrackerRoutes(controller) {
    const router = Router();

    // Health check
    router.get("/health", controller.healthCheck);

    // List expenses for a trip
    router.get("/:tripId/expenses", controller.getExpenses);

    // Add an expense
    router.post("/:tripId/expenses", controller.addExpense);

    // Remove an expense
    router.delete("/:tripId/expenses/:expenseId", controller.removeExpense);

    // Update budget settings (total budget, categories)
    router.put("/:tripId/settings", controller.updateBudgetSettings);

    return router;
}
