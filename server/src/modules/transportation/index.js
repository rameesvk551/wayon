import { MultiModalRouterService } from "./services/multi-modal-router.service.js";
import { TransportationController } from "./controller/transportation.controller.js";
import { createTransportationRoutes } from "./routes/transportation.routes.js";

/**
 * Bootstraps the Transportation module and returns a ready-to-mount Express Router.
 *
 * Composition:  MultiModalRouterService → Controller → Routes
 *
 * @returns {import('express').Router}
 */
export default function createTransportationModule() {
    console.log("🚌  Transportation module: initializing");

    const routerService = new MultiModalRouterService();
    const controller = new TransportationController(routerService);
    const router = createTransportationRoutes(controller);

    console.log("🚌  Transportation module: ready");

    return router;
}
