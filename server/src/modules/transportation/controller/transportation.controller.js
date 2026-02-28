import { multiModalRouteSchema, nearbyStopsSchema } from "../models/transportation.dtos.js";

/**
 * Express controller for transportation endpoints.
 * Converted from transportation-service transport.routes.ts inline handlers.
 */
export class TransportationController {
    #routerService;

    /**
     * @param {import('../services/multi-modal-router.service.js').MultiModalRouterService} routerService
     */
    constructor(routerService) {
        this.#routerService = routerService;

        this.getMultiModalRoute = this.getMultiModalRoute.bind(this);
        this.getNearbyStops = this.getNearbyStops.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** POST /transportation/multi-modal-route */
    async getMultiModalRoute(req, res, next) {
        try {
            const parsed = multiModalRouteSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const routeOptions = await this.#routerService.route(parsed.data);

            return res.json({
                success: true,
                routes: routeOptions,
                count: routeOptions.length,
                computedAt: new Date().toISOString(),
            });
        } catch (err) {
            next(err);
        }
    }

    /** GET /transportation/nearby-stops?lat=&lng=&radius= */
    async getNearbyStops(req, res, next) {
        try {
            const parsed = nearbyStopsSchema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            // Nearby stops requires GTFS data which isn't available in the module version
            // Return empty for now — identical to the original service when GTFS is not loaded
            return res.json({
                success: true,
                stops: [],
                count: 0,
                message: "GTFS data not loaded in integrated mode",
            });
        } catch (err) {
            next(err);
        }
    }

    /** GET /transportation/health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "transportation-module" });
    }
}
