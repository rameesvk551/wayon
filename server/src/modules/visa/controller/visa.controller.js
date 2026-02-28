import {
    getVisaSchema,
    getBulkVisaSchema,
    visaMapSchema,
} from "../models/visa.dtos.js";

/**
 * Express controller for visa endpoints.
 * Validates input with Zod, delegates to VisaService, returns JSON.
 */
export class VisaController {
    #service;

    /**
     * @param {import('../services/visa.service.js').VisaService} service
     */
    constructor(service) {
        this.#service = service;

        // Bind all methods so they work as Express route handlers
        this.getVisa = this.getVisa.bind(this);
        this.getBulkVisa = this.getBulkVisa.bind(this);
        this.getVisaMap = this.getVisaMap.bind(this);
        this.getPassports = this.getPassports.bind(this);
        this.getDestinations = this.getDestinations.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** GET /visa?from=XX&to=YY */
    async getVisa(req, res, next) {
        try {
            const parsed = getVisaSchema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const result = await this.#service.getVisaRequirement(
                parsed.data.from,
                parsed.data.to
            );
            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** POST /visa/bulk { from, destinations[] } */
    async getBulkVisa(req, res, next) {
        try {
            const parsed = getBulkVisaSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const result = await this.#service.getBulkVisaRequirements(
                parsed.data.from,
                parsed.data.destinations
            );
            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** POST /visa/map { passport } */
    async getVisaMap(req, res, next) {
        try {
            const parsed = visaMapSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const result = await this.#service.getVisaMap(parsed.data.passport);
            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** GET /visa/passports */
    async getPassports(_req, res, next) {
        try {
            const result = await this.#service.getPassports();
            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** GET /visa/destinations */
    async getDestinations(_req, res, next) {
        try {
            const result = await this.#service.getDestinations();
            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** GET /visa/health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "visa-module" });
    }
}
