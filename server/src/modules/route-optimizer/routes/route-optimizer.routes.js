import { Router } from "express";

/**
 * Registers all route-optimizer routes on an Express Router.
 * @param {import('../controller/route-optimizer.controller.js').RouteOptimizerController} controller
 * @returns {Router}
 */
export function createRouteOptimizerRoutes(controller) {
    const router = Router();

    router.post("/optimize", controller.optimizeRoute);
    router.get("/jobs/:jobId", controller.getJob);
    router.post("/generate-itinerary", controller.generateItinerary);
    router.get("/health", controller.healthCheck);

    return router;
}
