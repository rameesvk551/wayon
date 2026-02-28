import { mapAttractionToView } from "../models/attraction.models.js";

/**
 * Fingerprint for deduplication.
 */
function fingerprint(record) {
    const normalizedName = record.name.trim().toLowerCase().replace(/\s+/g, " ");
    const roundedLat = Math.round(record.location.lat * 1000) / 1000;
    const roundedLng = Math.round(record.location.lng * 1000) / 1000;
    return `${normalizedName}:${roundedLat}:${roundedLng}`;
}

/**
 * Normalize search input.
 */
function normalizeQuery(query) {
    const normalizedTypes = query.types?.map((item) => item.trim().toLowerCase()).filter(Boolean);
    const limit = typeof query.limit === "number" && !isNaN(query.limit)
        ? Math.min(Math.max(Math.floor(query.limit), 1), 50)
        : 15;

    return {
        city: query.city?.trim() || undefined,
        country: query.country?.trim() || undefined,
        types: normalizedTypes && normalizedTypes.length > 0 ? normalizedTypes : undefined,
        limit,
    };
}

/**
 * Convert provider record to a transient attraction.
 */
function toTransientAttraction(record) {
    const now = new Date().toISOString();
    return {
        id: `tmp-${record.provider}-${record.externalId}-${Date.now()}`,
        name: record.name,
        description: record.description,
        location: record.location,
        address: record.address,
        city: record.city,
        country: record.country,
        rating: record.rating,
        userRatingsTotal: record.userRatingsTotal,
        photos: record.photos,
        types: record.types,
        category: record.category,
        openNow: record.openNow,
        priceLevel: record.priceLevel,
        sources: [
            {
                provider: record.provider,
                externalId: record.externalId,
                sourceUrl: record.sourceUrl,
                payload: record.payload,
                lastSyncedAt: now,
            },
        ],
        createdAt: now,
        updatedAt: now,
    };
}

/**
 * AttractionService — Aggregates results from multiple providers.
 * Handles search, deduplication, and getById.
 *
 * Merged from: provider-orchestrator.service.ts + search-attractions.use-case.ts + get-attraction-by-id.use-case.ts
 */
export class AttractionService {
    #providers;

    /**
     * @param {Array<{getName(): string, isEnabled(): boolean, search(q: any): Promise<any[]>, getByExternalId(id: string): Promise<any>}>} providers
     */
    constructor(providers) {
        this.#providers = providers;
    }

    /**
     * Search attractions across all enabled providers.
     * @param {{ city?: string, country?: string, types?: string[], limit?: number }} input
     * @returns {Promise<import('../models/attraction.models.js').SearchAttractionsOutput>}
     */
    async search(input) {
        const query = normalizeQuery(input);
        const now = new Date().toISOString();

        if (!query.city && !query.country) {
            return {
                success: false,
                attractions: [],
                count: 0,
                source: "fallback",
                searchedAt: now,
            };
        }

        const enabledProviders = this.#providers.filter((p) => p.isEnabled());

        if (enabledProviders.length === 0) {
            console.warn("No enabled attraction providers");
            return {
                success: true,
                attractions: [],
                count: 0,
                source: "providers",
                searchedAt: now,
            };
        }

        const aggregated = [];

        for (const provider of enabledProviders) {
            try {
                const start = Date.now();
                const items = await provider.search(query);
                const durationMs = Date.now() - start;
                console.log(`Provider ${provider.getName()} returned ${items.length} results in ${durationMs}ms`);
                aggregated.push(...items);

                if (aggregated.length >= query.limit * 2) {
                    break;
                }
            } catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                console.warn(`Provider ${provider.getName()} search failed: ${errMsg}`);
            }
        }

        const deduped = this.#deduplicate(aggregated).slice(0, query.limit);
        const attractions = deduped.map(toTransientAttraction).map(mapAttractionToView);

        return {
            success: true,
            attractions,
            count: attractions.length,
            source: "providers",
            searchedAt: now,
        };
    }

    /**
     * Get a single attraction by external ID.
     * @param {string} id
     * @returns {Promise<import('../models/attraction.models.js').GetAttractionByIdOutput>}
     */
    async getById(id) {
        const trimmedId = id.trim();
        const now = new Date().toISOString();

        if (!trimmedId) {
            return {
                success: false,
                attraction: null,
                source: "providers",
                fetchedAt: now,
            };
        }

        const enabledProviders = this.#providers.filter((p) => p.isEnabled());

        for (const provider of enabledProviders) {
            try {
                const record = await provider.getByExternalId(trimmedId);
                if (record) {
                    const attraction = toTransientAttraction(record);
                    return {
                        success: true,
                        attraction: mapAttractionToView(attraction),
                        source: "providers",
                        fetchedAt: now,
                    };
                }
            } catch (error) {
                const errMsg = error instanceof Error ? error.message : String(error);
                console.warn(`Provider ${provider.getName()} detail fetch failed: ${errMsg}`);
            }
        }

        return {
            success: false,
            attraction: null,
            source: "providers",
            fetchedAt: now,
        };
    }

    /**
     * Get provider status information.
     */
    getProviderStates() {
        return this.#providers.map((p) => ({
            name: p.getName(),
            enabled: p.isEnabled(),
        }));
    }

    #deduplicate(records) {
        const seenExternal = new Set();
        const seenFingerprint = new Set();
        const deduped = [];

        for (const record of records) {
            const sourceKey = `${record.provider}:${record.externalId}`;
            const print = fingerprint(record);

            if (seenExternal.has(sourceKey) || seenFingerprint.has(print)) {
                continue;
            }

            seenExternal.add(sourceKey);
            seenFingerprint.add(print);
            deduped.push(record);
        }

        return deduped;
    }
}
