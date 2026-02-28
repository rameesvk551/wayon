import {
    hotelSearchSchema,
    hotelLegacySearchSchema,
    hotelIdSchema,
} from "../models/hotel.dtos.js";

/**
 * Express controller for hotel endpoints.
 * Validates input with Zod, delegates to HotelService, returns JSON.
 */
export class HotelController {
    #service;

    /**
     * @param {import('../services/hotel.service.js').HotelService} service
     */
    constructor(service) {
        this.#service = service;

        this.searchHotels = this.searchHotels.bind(this);
        this.searchHotelsLegacy = this.searchHotelsLegacy.bind(this);
        this.getHotelById = this.getHotelById.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** GET /hotels/search?destination=&checkIn=&checkOut=&guests= */
    async searchHotels(req, res, next) {
        try {
            const parsed = hotelSearchSchema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const {
                destination, location,
                checkIn, checkin,
                checkOut, checkout,
                guests, limit, cursor,
            } = parsed.data;

            const dest = destination || location;
            const checkInDate = checkIn || checkin;
            const checkOutDate = checkOut || checkout;

            if (!dest) return res.status(400).json({ error: "destination is required" });
            if (!checkInDate) return res.status(400).json({ error: "checkIn is required" });
            if (!checkOutDate) return res.status(400).json({ error: "checkOut is required" });

            const guestsNum = parseInt(guests, 10);
            if (isNaN(guestsNum) || guestsNum < 1) {
                return res.status(400).json({ error: "guests must be a positive number" });
            }

            const query = {
                location: dest,
                checkin: checkInDate,
                checkout: checkOutDate,
                guests: guestsNum,
                limit: limit ? parseInt(limit, 10) : undefined,
                cursor: cursor ? parseInt(cursor, 10) : undefined,
            };

            const result = await this.#service.search(query);
            return res.json(result);
        } catch (err) {
            next(err);
        }
    }

    /** GET /hotels?city=&limit= (legacy endpoint) */
    async searchHotelsLegacy(req, res, next) {
        try {
            const parsed = hotelLegacySearchSchema.safeParse(req.query);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            const { city, limit } = parsed.data;

            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const query = {
                location: city,
                checkin: today.toISOString().split("T")[0],
                checkout: tomorrow.toISOString().split("T")[0],
                guests: 2,
                limit: limit ? parseInt(limit, 10) : 20,
            };

            const result = await this.#service.search(query);
            return res.json({
                city,
                count: result.hotels.length,
                hotels: result.hotels,
            });
        } catch (err) {
            next(err);
        }
    }

    /** GET /hotels/:id */
    async getHotelById(req, res, next) {
        try {
            const parsed = hotelIdSchema.safeParse(req.params);
            if (!parsed.success) {
                return res.status(400).json({
                    error: "Validation failed",
                    details: parsed.error.flatten().fieldErrors,
                });
            }

            return res.json({
                message: "Hotel details endpoint — search for hotels first using /search",
                hotelId: parsed.data.id,
            });
        } catch (err) {
            next(err);
        }
    }

    /** GET /hotels/health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "hotel-module" });
    }
}
