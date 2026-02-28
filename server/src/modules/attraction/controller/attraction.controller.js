import { attractionSearchSchema, attractionIdSchema } from "../models/attraction.dtos.js";
import { ATTRACTION_CATEGORIES } from "../models/attraction.models.js";

/**
 * Express controller for attraction endpoints.
 * Validates input with Zod, delegates to AttractionService, returns JSON.
 */
export class AttractionController {
    #service;

    /**
     * @param {import('../services/attraction.service.js').AttractionService} service
     */
    constructor(service) {
        this.#service = service;

        this.searchAttractions = this.searchAttractions.bind(this);
        this.getAttractionById = this.getAttractionById.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** POST /attractions/search  (body: { city, country, types, limit }) */
    async searchAttractions(req, res, next) {
        try {
            // Accept both query params and body
            const input = req.method === "POST" ? req.body : req.query;

            const { city, country } = input || {};

            if (!city && !country) {
                return res.status(400).json({
                    error: "Bad Request",
                    message: "Either city or country is required",
                    statusCode: 400,
                });
            }

            const types = input.types
                ? (Array.isArray(input.types) ? input.types : [input.types])
                : undefined;

            const limit = input.limit ? parseInt(input.limit, 10) : undefined;

            const result = await this.#service.search({
                city,
                country,
                types,
                limit,
            });

            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** GET /attractions/:id */
    async getAttractionById(req, res, next) {
        try {
            const parsed = attractionIdSchema.safeParse(req.params);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const result = await this.#service.getById(parsed.data.id);

            if (!result.success || !result.attraction) {
                return res.status(404).json({
                    error: "Not Found",
                    message: "Attraction not found",
                    statusCode: 404,
                });
            }

            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** GET /attractions/categories */
    getCategories(_req, res) {
        return res.json({
            success: true,
            categories: ATTRACTION_CATEGORIES,
        });
    }

    /** GET /attractions/status */
    async getStatus(_req, res) {
        return res.json({
            success: true,
            service: "attraction-module",
            providers: this.#service.getProviderStates(),
            timestamp: new Date().toISOString(),
        });
    }

    /** GET /attractions/health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "attraction-module" });
    }
}
