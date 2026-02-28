import { createFallbackRequirement } from "../models/visa.models.js";
import {
    mapApiStatus,
    mapStatusToDocuments,
    mapStatusToNextSteps,
    mapStatusToProcessingTime,
    mapStatusToCost,
} from "../utils/status-mapper.js";

const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Repository that wraps the RapidAPI provider with in-memory TTL cache.
 */
export class CachedVisaRepository {
    /** @type {Map<string, {data: any, timestamp: number}>} */
    #singleCache = new Map();
    /** @type {Map<string, {data: any, timestamp: number}>} */
    #mapCache = new Map();
    #passportsCache = null;
    #destinationsCache = null;
    #provider;

    /**
     * @param {import('../helpers/rapidapi.provider.js').RapidApiVisaProvider} provider
     */
    constructor(provider) {
        this.#provider = provider;
    }

    /**
     * @param {{data: any, timestamp: number} | null | undefined} entry
     */
    #isFresh(entry) {
        if (!entry) return false;
        return Date.now() - entry.timestamp < CACHE_TTL;
    }

    /**
     * @param {string} from
     * @param {string} to
     * @returns {Promise<import('../models/visa.models.js').VisaRequirement>}
     */
    async getVisaRequirement(from, to) {
        const key = `${from.toUpperCase()}-${to.toUpperCase()}`;
        const cached = this.#singleCache.get(key);
        if (this.#isFresh(cached)) return cached.data;

        try {
            const response = await this.#provider.checkVisa(from, to);
            const status = mapApiStatus(response.visa?.requirement || "required");
            const destName = response.destination?.name || to;

            const result = {
                country: destName,
                countryCode: to.toUpperCase(),
                passportCode: from.toUpperCase(),
                visaRequired: status !== "visa-free",
                visaType: status,
                status,
                maxStay: response.visa?.allowed_stay || "Check with embassy",
                description:
                    response.visa?.notes ||
                    `Visa status for ${from.toUpperCase()} passport to ${destName}: ${status}`,
                processingTime: mapStatusToProcessingTime(status),
                cost: mapStatusToCost(status),
                requirements: mapStatusToDocuments(status),
                documents: mapStatusToDocuments(status),
                nextSteps: mapStatusToNextSteps(status, destName),
                notes: response.visa?.notes,
            };

            this.#singleCache.set(key, { data: result, timestamp: Date.now() });
            return result;
        } catch (err) {
            console.error(
                `[CachedVisaRepository] API error for ${key}:`,
                err?.message
            );
            return createFallbackRequirement(from, to);
        }
    }

    /**
     * @param {string} from
     * @param {string[]} destinations
     */
    async getBulkVisaRequirements(from, destinations) {
        return Promise.all(
            destinations.map((dest) => this.getVisaRequirement(from, dest))
        );
    }

    /**
     * @param {string} passportCode
     * @returns {Promise<import('../models/visa.models.js').VisaRequirement[]>}
     */
    async getVisaMap(passportCode) {
        const key = passportCode.toUpperCase();
        const cached = this.#mapCache.get(key);
        if (this.#isFresh(cached)) return cached.data;

        try {
            const entries = await this.#provider.getVisaMap(passportCode);
            const results = entries.map((entry) => {
                const status = mapApiStatus(entry.requirement);
                const code = entry.code?.toUpperCase() || "";
                return {
                    country: code,
                    countryCode: code,
                    passportCode: key,
                    visaRequired: status !== "visa-free",
                    visaType: status,
                    status,
                    maxStay: "Check with embassy",
                    description: `${code}: ${status}`,
                    processingTime: mapStatusToProcessingTime(status),
                    cost: mapStatusToCost(status),
                    requirements: mapStatusToDocuments(status),
                    documents: mapStatusToDocuments(status),
                    nextSteps: mapStatusToNextSteps(status, code),
                };
            });

            console.log(
                `[CachedVisaRepository] Cached ${results.length} visa map entries for ${key}`
            );
            this.#mapCache.set(key, { data: results, timestamp: Date.now() });
            return results;
        } catch (err) {
            console.error(
                `[CachedVisaRepository] Visa map error for ${key}:`,
                err?.message
            );
            return [];
        }
    }

    /** @returns {Promise<import('../models/visa.models.js').PassportEntry[]>} */
    async getPassportList() {
        if (this.#isFresh(this.#passportsCache)) return this.#passportsCache.data;

        try {
            const list = await this.#provider.getPassports();
            const mapped = list.map((p) => ({
                code: p.code?.toUpperCase() || "",
                name: p.name || p.code,
            }));
            this.#passportsCache = { data: mapped, timestamp: Date.now() };
            return mapped;
        } catch (err) {
            console.error(
                "[CachedVisaRepository] Passports list error:",
                err?.message
            );
            return [];
        }
    }

    /** @returns {Promise<import('../models/visa.models.js').DestinationEntry[]>} */
    async getDestinationList() {
        if (this.#isFresh(this.#destinationsCache))
            return this.#destinationsCache.data;

        try {
            const list = await this.#provider.getDestinations();
            const mapped = list.map((d) => ({
                code: d.code?.toUpperCase() || "",
                name: d.name || d.code,
            }));
            this.#destinationsCache = { data: mapped, timestamp: Date.now() };
            return mapped;
        } catch (err) {
            console.error(
                "[CachedVisaRepository] Destinations list error:",
                err?.message
            );
            return [];
        }
    }
}
