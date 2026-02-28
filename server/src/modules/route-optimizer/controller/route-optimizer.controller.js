/**
 * Express controller for route-optimizer endpoints.
 * Merged from OptimizeRouteController.ts + GenerateItineraryController.ts
 */
export class RouteOptimizerController {
    #service;

    /**
     * @param {import('../services/route-optimizer.service.js').RouteOptimizerService} service
     */
    constructor(service) {
        this.#service = service;

        this.optimizeRoute = this.optimizeRoute.bind(this);
        this.getJob = this.getJob.bind(this);
        this.generateItinerary = this.generateItinerary.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** POST /route-optimizer/optimize */
    async optimizeRoute(req, res, next) {
        try {
            const result = await this.#service.optimizeRoute(req.body);

            if (result.isFailure) {
                return res.status(400).json({
                    success: false,
                    error: result.error instanceof Error ? result.error.message : String(result.error),
                });
            }

            return res.json({
                success: true,
                data: result.getValue(),
            });
        } catch (err) {
            next(err);
        }
    }

    /** GET /route-optimizer/jobs/:jobId */
    async getJob(req, res, next) {
        try {
            const { jobId } = req.params;
            const result = await this.#service.getJob(jobId);

            if (result.isFailure) {
                return res.status(404).json({
                    success: false,
                    error: String(result.error),
                });
            }

            return res.json({ success: true, data: result.getValue() });
        } catch (err) {
            next(err);
        }
    }

    /** POST /route-optimizer/generate-itinerary */
    async generateItinerary(req, res, next) {
        try {
            const result = await this.#service.generateItinerary(req.body);

            if (result.isFailure) {
                return res.status(400).json({
                    success: false,
                    error: result.error instanceof Error ? result.error.message : String(result.error),
                });
            }

            return res.json({ success: true, data: result.getValue() });
        } catch (err) {
            next(err);
        }
    }

    /** GET /route-optimizer/health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "route-optimizer-module" });
    }
}
