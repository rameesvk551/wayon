import { Router } from "express";

/**
 * Registers all packing-assistant routes on an Express Router.
 * @param {import('../controller/packing-assistant.controller.js').PackingAssistantController} controller
 * @returns {Router}
 */
export function createPackingAssistantRoutes(controller) {
    const router = Router();

    // Health check
    router.get("/health", controller.healthCheck);

    // List packing items for a trip
    router.get("/:tripId/items", controller.getPackingList);

    // Add a packing item
    router.post("/:tripId/items", controller.addPackingItem);

    // Toggle item checked status
    router.patch("/:tripId/items/:itemId/toggle", controller.togglePackingItem);

    // Remove a packing item
    router.delete("/:tripId/items/:itemId", controller.removePackingItem);

    // Bulk replace packing list
    router.put("/:tripId/items", controller.replacePackingList);

    return router;
}
