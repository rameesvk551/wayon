import { Router } from "express";

/**
 * Registers all visa routes on an Express Router.
 * @param {import('../controller/visa.controller.js').VisaController} controller
 * @returns {Router}
 */
export function createVisaRoutes(controller) {
    const router = Router();

    // Single visa check
    router.get("/", controller.getVisa);

    // Bulk visa check
    router.post("/bulk", controller.getBulkVisa);

    // Visa map (all destinations for a passport)
    router.post("/map", controller.getVisaMap);

    // List all passport countries
    router.get("/passports", controller.getPassports);

    // List all destination countries
    router.get("/destinations", controller.getDestinations);

    // Health check
    router.get("/health", controller.healthCheck);

    return router;
}
