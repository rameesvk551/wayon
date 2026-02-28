/**
 * Express controller for Packing Assistant endpoints.
 */
export class PackingAssistantController {
    #service;

    /**
     * @param {import('../services/packing-assistant.service.js').PackingAssistantService} service
     */
    constructor(service) {
        this.#service = service;

        this.getPackingList = this.getPackingList.bind(this);
        this.addPackingItem = this.addPackingItem.bind(this);
        this.togglePackingItem = this.togglePackingItem.bind(this);
        this.removePackingItem = this.removePackingItem.bind(this);
        this.replacePackingList = this.replacePackingList.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** GET /:tripId/items */
    async getPackingList(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) return res.status(400).json({ error: "tripId is required" });

            const result = await this.#service.getPackingList(tripId);
            return res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** POST /:tripId/items */
    async addPackingItem(req, res, next) {
        try {
            const { tripId } = req.params;
            const { id, label, categoryId, checked, suggestedByWeather } = req.body;

            if (!tripId) return res.status(400).json({ error: "tripId is required" });
            if (!label || !categoryId) {
                return res.status(400).json({
                    error: "label and categoryId are required",
                });
            }

            const item = {
                id: id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                label: label.trim(),
                categoryId,
                checked: !!checked,
                suggestedByWeather: !!suggestedByWeather,
            };

            const result = await this.#service.addPackingItem(tripId, item);
            return res.status(201).json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** PATCH /:tripId/items/:itemId/toggle */
    async togglePackingItem(req, res, next) {
        try {
            const { tripId, itemId } = req.params;
            if (!tripId || !itemId) {
                return res.status(400).json({ error: "tripId and itemId are required" });
            }

            const result = await this.#service.togglePackingItem(tripId, itemId);
            return res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** DELETE /:tripId/items/:itemId */
    async removePackingItem(req, res, next) {
        try {
            const { tripId, itemId } = req.params;
            if (!tripId || !itemId) {
                return res.status(400).json({ error: "tripId and itemId are required" });
            }

            const result = await this.#service.removePackingItem(tripId, itemId);
            return res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** PUT /:tripId/items */
    async replacePackingList(req, res, next) {
        try {
            const { tripId } = req.params;
            if (!tripId) return res.status(400).json({ error: "tripId is required" });

            const { items } = req.body;
            if (!Array.isArray(items)) {
                return res.status(400).json({ error: "items array is required" });
            }

            const result = await this.#service.replacePackingList(tripId, items);
            return res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    /** GET /health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "packing-assistant-module" });
    }
}
