/**
 * FallbackAttractionsProvider — Returns placeholder attractions when no real providers are available.
 * Converted from attraction-service infrastructure/providers/fallback-attractions.provider.ts
 */

function slugify(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export class FallbackAttractionsProvider {
    #enabled;

    /**
     * @param {boolean} enabled
     */
    constructor(enabled) {
        this.#enabled = enabled;
    }

    getName() { return "fallback_data"; }

    isEnabled() {
        return this.#enabled;
    }

    /**
     * @param {import('../models/attraction.models.js').AttractionQuery} query
     * @returns {Promise<import('../models/attraction.models.js').ProviderAttraction[]>}
     */
    async search(query) {
        if (!this.#enabled) {
            return [];
        }

        const city = query.city || "Sample City";
        const country = query.country || "Sample Country";
        const baseId = `${slugify(city)}-${slugify(country)}`;

        const records = [
            {
                provider: "fallback_data",
                externalId: `${baseId}-park`,
                name: `${city} Central Park`,
                description: `A central public park in ${city} with walking routes and open green spaces.`,
                location: { lat: 0, lng: 0 },
                address: `Central District, ${city}, ${country}`,
                city,
                country,
                rating: 4.5,
                userRatingsTotal: 2500,
                photos: [],
                types: ["park", "tourist_attraction"],
                category: "park",
            },
            {
                provider: "fallback_data",
                externalId: `${baseId}-museum`,
                name: `${city} National Museum`,
                description: `A museum focused on regional art, history, and cultural heritage.`,
                location: { lat: 0, lng: 0 },
                address: `Museum District, ${city}, ${country}`,
                city,
                country,
                rating: 4.7,
                userRatingsTotal: 3200,
                photos: [],
                types: ["museum", "tourist_attraction"],
                category: "museum",
            },
            {
                provider: "fallback_data",
                externalId: `${baseId}-landmark`,
                name: `${city} Heritage Tower`,
                description: `An iconic landmark with panoramic observation decks and guided tours.`,
                location: { lat: 0, lng: 0 },
                address: `Downtown, ${city}, ${country}`,
                city,
                country,
                rating: 4.4,
                userRatingsTotal: 4100,
                photos: [],
                types: ["landmark", "tourist_attraction"],
                category: "landmark",
            },
        ];

        return records.slice(0, query.limit);
    }

    /**
     * @param {string} externalId
     * @returns {Promise<import('../models/attraction.models.js').ProviderAttraction | null>}
     */
    async getByExternalId(externalId) {
        if (!this.#enabled || !externalId.includes("-")) {
            return null;
        }

        const [cityPart] = externalId.split("-");
        const city = cityPart ? cityPart.replace(/-/g, " ") : "Sample City";

        return {
            provider: "fallback_data",
            externalId,
            name: `${city} Demo Attraction`,
            description: "Fallback attraction details",
            location: { lat: 0, lng: 0 },
            address: `${city}, Demo Region`,
            city,
            country: "Demo Country",
            rating: 4.0,
            userRatingsTotal: 100,
            photos: [],
            types: ["tourist_attraction"],
            category: "attraction",
        };
    }
}
