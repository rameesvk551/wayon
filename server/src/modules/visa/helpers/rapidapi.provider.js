import axios from "axios";
import { colorToRequirement } from "../utils/status-mapper.js";

/**
 * Provider that calls the RapidAPI Visa Requirement API (v2).
 */
export class RapidApiVisaProvider {
    /** @type {import('axios').AxiosInstance} */
    #client;

    /**
     * @param {string} apiKey
     * @param {string} [apiHost]
     */
    constructor(apiKey, apiHost = "visa-requirement.p.rapidapi.com") {
        this.#client = axios.create({
            baseURL: `https://${apiHost}`,
            headers: {
                "x-rapidapi-key": apiKey,
                "x-rapidapi-host": apiHost,
            },
            timeout: 15_000,
        });
    }

    /**
     * Check visa requirement for a single passport → destination pair.
     * @param {string} passportCode
     * @param {string} destinationCode
     */
    async checkVisa(passportCode, destinationCode) {
        const { data } = await this.#client.post(
            "/v2/visa/check",
            new URLSearchParams({
                passport: passportCode.toUpperCase(),
                destination: destinationCode.toUpperCase(),
            }).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        return data?.data || data;
    }

    /**
     * Get visa map — all destinations grouped by color (visa status).
     * @param {string} passportCode
     * @returns {Promise<Array<{code: string, color: string, requirement: string}>>}
     */
    async getVisaMap(passportCode) {
        const { data } = await this.#client.post(
            "/v2/visa/map",
            new URLSearchParams({
                passport: passportCode.toUpperCase(),
            }).toString(),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const results = [];
        const colorsObj = data?.data?.colors || data?.colors || {};

        for (const [color, codesStr] of Object.entries(colorsObj)) {
            if (typeof codesStr !== "string" || !codesStr.trim()) continue;
            const codes = codesStr
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean);
            const requirement = colorToRequirement(color);

            for (const code of codes) {
                results.push({ code: code.toUpperCase(), color, requirement });
            }
        }

        console.log(
            `[RapidApiVisaProvider] Visa map for ${passportCode}: ${results.length} entries`
        );
        return results;
    }

    /** Get all passport countries. */
    async getPassports() {
        const { data } = await this.#client.get("/v2/passports");
        const list = data?.data || data;
        return Array.isArray(list) ? list : [];
    }

    /** Get all destination countries. */
    async getDestinations() {
        const { data } = await this.#client.get("/v2/destinations");
        const list = data?.data || data;
        return Array.isArray(list) ? list : [];
    }
}
