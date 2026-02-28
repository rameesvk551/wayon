import { BudgetTrackerService } from "./services/budget-tracker.service.js";
import { BudgetTrackerController } from "./controller/budget-tracker.controller.js";
import { createBudgetTrackerRoutes } from "./routes/budget-tracker.routes.js";

/**
 * Bootstraps the Budget Tracker module and returns a ready-to-mount Express Router.
 *
 * Composition:  Service → Controller → Routes
 *
 * @returns {import('express').Router}
 */
export default function createBudgetTrackerModule() {
    const editorBaseUrl =
        process.env.ITINERARY_EDITOR_SERVICE || "http://localhost:4015";

    console.log(`💰 Budget Tracker module: proxying to ${editorBaseUrl}`);

    const service = new BudgetTrackerService(editorBaseUrl);
    const controller = new BudgetTrackerController(service);
    const router = createBudgetTrackerRoutes(controller);

    return router;
}
