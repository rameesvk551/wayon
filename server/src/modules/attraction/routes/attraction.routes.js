import { Router } from "express";

/**
 * Registers all attraction routes on an Express Router.
 * @param {import('../controller/attraction.controller.js').AttractionController} controller
 * @returns {Router}
 */
export function createAttractionRoutes(controller) {
    const router = Router();

    // Search attractions (POST body: { city, country, types, limit })
    router.post("/search", controller.searchAttractions);

    // Also support GET for convenience
    router.get("/search", controller.searchAttractions);

    // Get categories
    router.get("/categories", controller.getCategories);

    // Status / health
    router.get("/status", controller.getStatus);
    router.get("/health", controller.healthCheck);

    // Get attraction by ID (must be after named routes)
    router.get("/:id", controller.getAttractionById);

    return router;
}
