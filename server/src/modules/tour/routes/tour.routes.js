import { Router } from "express";

/**
 * Registers all tour routes on an Express Router.
 * @param {import('../controller/tour.controller.js').TourController} controller
 * @returns {Router}
 */
export function createTourRoutes(controller) {
    const router = Router();

    // Search tours by location
    router.get("/search", controller.searchTours);

    // Health check
    router.get("/health", controller.healthCheck);

    // Get tour by ID (must be after /search and /health to avoid route conflict)
    router.get("/:id", controller.getTourById);

    return router;
}
