import { RouteOptimizerService } from "./services/route-optimizer.service.js";
import { RouteOptimizerController } from "./controller/route-optimizer.controller.js";
import { createRouteOptimizerRoutes } from "./routes/route-optimizer.routes.js";

/**
 * Bootstraps the Route Optimizer module and returns a ready-to-mount Express Router.
 *
 * Composition:  Service → Controller → Routes
 *
 * @returns {import('express').Router}
 */
export default function createRouteOptimizerModule() {
    console.log("🗺️  Route Optimizer module: initializing");

    const service = new RouteOptimizerService();
    const controller = new RouteOptimizerController(service);
    const router = createRouteOptimizerRoutes(controller);

    console.log("🗺️  Route Optimizer module: ready");

    return router;
}
