/**
 * HotelService — Aggregates results from multiple providers.
 * Handles search, deduplication, and pagination.
 */
export class HotelService {
    #providers;

    /**
     * @param {Array<{getName(): string, search(q: any): Promise<any[]>}>} providers
     */
    constructor(providers) {
        this.#providers = providers;
    }

    /**
     * @param {import('../models/hotel.models.js').HotelSearchQuery} query
     * @returns {Promise<import('../models/hotel.models.js').PaginatedHotelResponse>}
     */
    async search(query) {
        const limit = query.limit ?? 20;
        const cursor = query.cursor ?? 0;

        const providerResults = await Promise.allSettled(
            this.#providers.map((p) => p.search(query))
        );

        const allHotels = [];
        for (let i = 0; i < providerResults.length; i++) {
            const result = providerResults[i];
            if (result.status === "fulfilled") {
                allHotels.push(...result.value);
            } else {
                console.warn(
                    `Provider ${this.#providers[i].getName()} failed:`,
                    result.reason
                );
            }
        }

        const deduped = this.#deduplicateHotels(allHotels);
        const sorted = deduped.sort((a, b) => a.price - b.price);
        const paginated = sorted.slice(cursor, cursor + limit);
        const hasMore = cursor + limit < sorted.length;

        return {
            hotels: paginated,
            cursor: cursor + paginated.length,
            hasMore,
            total: sorted.length,
        };
    }

    #deduplicateHotels(hotels) {
        const seen = new Map();
        for (const hotel of hotels) {
            const normalizedName = this.#normalizeHotelName(hotel.name);
            const locationKey = `${Math.round(hotel.lat * 1000)},${Math.round(hotel.lng * 1000)}`;
            const key = `${normalizedName}|${locationKey}`;

            const existing = seen.get(key);
            if (!existing || hotel.price < existing.price) {
                seen.set(key, hotel);
            }
        }
        return Array.from(seen.values());
    }

    #normalizeHotelName(name) {
        return name
            .toLowerCase()
            .replace(/[.,\-_]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }
}
