import { Router } from "express";

/**
 * Registers all transportation routes on an Express Router.
 * @param {import('../controller/transportation.controller.js').TransportationController} controller
 * @returns {Router}
 */
export function createTransportationRoutes(controller) {
    const router = Router();

    router.post("/multi-modal-route", controller.getMultiModalRoute);
    router.get("/nearby-stops", controller.getNearbyStops);
    router.get("/health", controller.healthCheck);

    return router;
}
