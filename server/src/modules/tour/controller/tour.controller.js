import { tourSearchSchema, tourIdSchema } from "../models/tour.dtos.js";

/**
 * Express controller for tour endpoints.
 * Validates input with Zod, delegates to TourService, returns JSON.
 */
export class TourController {
    #service;

    /**
     * @param {import('../services/tour.service.js').TourService} service
     */
    constructor(service) {
        this.#service = service;

        this.searchTours = this.searchTours.bind(this);
        this.getTourById = this.getTourById.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** GET /tours/search?latitude=&longitude=&radius=&category=&keyword=&limit= */
    async searchTours(req, res, next) {
        try {
            const parsed = tourSearchSchema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const { latitude, longitude, radius, category, keyword, limit } = parsed.data;

            const query = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                radius: radius ? parseInt(radius) : 20,
                category,
                keyword,
                limit: limit ? parseInt(limit) : 30,
            };

            const tours = await this.#service.search(query);

            return res.json({
                success: true,
                tours,
                count: tours.length,
                searchedAt: new Date().toISOString(),
            });
        } catch (err) {
            next(err);
        }
    }

    /** GET /tours/:id */
    async getTourById(req, res, next) {
        try {
            const parsed = tourIdSchema.safeParse(req.params);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const tour = await this.#service.getById(parsed.data.id);

            if (!tour) {
                return res.status(404).json({
                    success: false,
                    error: "Tour not found. Try searching first to populate the cache.",
                });
            }

            return res.json({
                success: true,
                tour,
                fetchedAt: new Date().toISOString(),
            });
        } catch (err) {
            next(err);
        }
    }

    /** GET /tours/health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "tour-module" });
    }
}
