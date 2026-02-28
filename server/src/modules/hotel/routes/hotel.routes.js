import { Router } from "express";

/**
 * Registers all hotel routes on an Express Router.
 * @param {import('../controller/hotel.controller.js').HotelController} controller
 * @returns {Router}
 */
export function createHotelRoutes(controller) {
    const router = Router();

    // Search hotels (primary endpoint)
    router.get("/search", controller.searchHotels);

    // Legacy search by city
    router.get("/", controller.searchHotelsLegacy);

    // Get hotel by ID
    router.get("/health", controller.healthCheck);

    // Hotel details (must be after /health to avoid route conflict)
    router.get("/:id", controller.getHotelById);

    return router;
}
