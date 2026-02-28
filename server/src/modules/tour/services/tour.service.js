/**
 * TourService — Aggregates tour results from multiple providers.
 * Handles search, deduplication, and getById.
 */
export class TourService {
    #providers;

    /**
     * @param {Array<{getName(): string, search(q: any): Promise<any[]>, getById?(id: string): Promise<any>}>} providers
     */
    constructor(providers) {
        this.#providers = providers;
    }

    /**
     * @param {import('../models/tour.models.js').TourSearchQuery} query
     * @returns {Promise<import('../models/tour.models.js').Tour[]>}
     */
    async search(query) {
        console.log(
            `TourService: Searching ${this.#providers.length} providers for (${query.latitude}, ${query.longitude})`
        );

        const results = await Promise.allSettled(
            this.#providers.map((p) => p.search(query))
        );

        const allTours = [];
        results.forEach((result, index) => {
            const providerName = this.#providers[index].getName();
            if (result.status === "fulfilled") {
                console.log(`  ✓ ${providerName}: ${result.value.length} results`);
                allTours.push(...result.value);
            } else {
                console.error(`  ✗ ${providerName}: ${result.reason}`);
            }
        });

        const deduplicated = this.#deduplicateByName(allTours);

        // Sort: AI recommended first, then by rating
        deduplicated.sort((a, b) => {
            if (a.isAIRecommended !== b.isAIRecommended) {
                return b.isAIRecommended ? 1 : -1;
            }
            return b.rating - a.rating;
        });

        console.log(`TourService: Returning ${deduplicated.length} unique tours`);
        return deduplicated;
    }

    /**
     * @param {string} id
     * @returns {Promise<import('../models/tour.models.js').Tour | null>}
     */
    async getById(id) {
        for (const provider of this.#providers) {
            if (provider.getById) {
                const tour = await provider.getById(id);
                if (tour) {
                    console.log(`TourService: Found tour "${tour.name}" from ${provider.getName()}`);
                    return tour;
                }
            }
        }
        console.log(`TourService: Tour "${id}" not found in any provider`);
        return null;
    }

    #deduplicateByName(tours) {
        const seen = new Map();
        for (const tour of tours) {
            const key = tour.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            if (!seen.has(key)) {
                seen.set(key, tour);
            }
        }
        return Array.from(seen.values());
    }
}
