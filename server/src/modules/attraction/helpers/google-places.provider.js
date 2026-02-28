import axios from "axios";

/**
 * GooglePlacesProvider — Uses Google Places API to search attractions.
 * Converted from attraction-service infrastructure/providers/google-places.provider.ts
 */
export class GooglePlacesProvider {
    #apiKey;
    #textSearchTimeoutMs;
    #placeDetailsTimeoutMs;
    #baseUrl = "https://maps.googleapis.com/maps/api/place";

    /**
     * @param {{ apiKey: string, textSearchTimeoutMs: number, placeDetailsTimeoutMs: number }} config
     */
    constructor(config) {
        this.#apiKey = config.apiKey;
        this.#textSearchTimeoutMs = config.textSearchTimeoutMs;
        this.#placeDetailsTimeoutMs = config.placeDetailsTimeoutMs;
    }

    getName() { return "google_places"; }

    isEnabled() {
        return !!this.#apiKey && this.#apiKey !== "your_google_places_api_key_here";
    }

    /**
     * @param {import('../models/attraction.models.js').AttractionQuery} query
     * @returns {Promise<import('../models/attraction.models.js').ProviderAttraction[]>}
     */
    async search(query) {
        if (!this.isEnabled()) {
            return [];
        }

        const locationQuery = [query.city, query.country].filter(Boolean).join(", ");
        if (!locationQuery) {
            return [];
        }

        let records = await this.#searchPlaces(locationQuery, "tourist_attraction", query.limit);

        if (records.length === 0) {
            const secondary = await this.#searchPlaces(locationQuery, "point_of_interest", query.limit);
            records = secondary;
        }

        if (query.types && query.types.length > 0) {
            const requested = query.types.map((type) => type.toLowerCase());
            records = records.filter((record) =>
                record.types.some((type) => requested.includes(type.toLowerCase()))
            );
        }

        return records.slice(0, query.limit);
    }

    /**
     * @param {string} externalId
     * @returns {Promise<import('../models/attraction.models.js').ProviderAttraction | null>}
     */
    async getByExternalId(externalId) {
        if (!this.isEnabled()) {
            return null;
        }
        return this.#getPlaceDetails(externalId);
    }

    async #searchPlaces(query, type, limit) {
        try {
            const response = await axios.get(`${this.#baseUrl}/textsearch/json`, {
                params: {
                    query: `${type} in ${query}`,
                    type,
                    key: this.#apiKey,
                },
                timeout: this.#textSearchTimeoutMs,
            });

            if (response.data.status === "ZERO_RESULTS") {
                return [];
            }

            if (response.data.status !== "OK" || !Array.isArray(response.data.results)) {
                console.warn("Google Places text search returned non-OK status:", response.data.status);
                return [];
            }

            const results = response.data.results;
            const records = [];

            for (const place of results.slice(0, limit)) {
                try {
                    const details = await this.#getPlaceDetails(place.place_id);
                    if (details) {
                        records.push(details);
                        continue;
                    }
                } catch (error) {
                    console.warn("Google Places details lookup failed during search result hydration:", place.place_id);
                }
                records.push(this.#mapBasicPlace(place));
            }

            return records;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.warn(`Google Places text search failed: ${errMsg}`);
            return [];
        }
    }

    async #getPlaceDetails(placeId) {
        try {
            const response = await axios.get(`${this.#baseUrl}/details/json`, {
                params: {
                    place_id: placeId,
                    fields: [
                        "place_id", "name", "formatted_address", "geometry",
                        "rating", "user_ratings_total", "photos", "types",
                        "editorial_summary", "opening_hours", "price_level",
                    ].join(","),
                    key: this.#apiKey,
                },
                timeout: this.#placeDetailsTimeoutMs,
            });

            if (response.data.status !== "OK" || !response.data.result) {
                return null;
            }

            const place = response.data.result;
            const [city, country] = this.#extractCityAndCountry(place.formatted_address);

            return {
                provider: "google_places",
                externalId: place.place_id,
                name: place.name,
                description: place.editorial_summary?.overview,
                location: {
                    lat: place.geometry.location.lat,
                    lng: place.geometry.location.lng,
                },
                address: place.formatted_address,
                city,
                country,
                rating: place.rating,
                userRatingsTotal: place.user_ratings_total,
                photos: this.#extractPhotoUrls(place.photos || []),
                types: place.types || [],
                category: this.#categorize(place.types || []),
                openNow: place.opening_hours?.open_now,
                priceLevel: place.price_level,
                sourceUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
                payload: {
                    provider: "google_places",
                    status: response.data.status,
                },
            };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.warn(`Google Places details request failed: ${errMsg}`);
            return null;
        }
    }

    #mapBasicPlace(place) {
        const address = place.formatted_address || "";
        const [city, country] = this.#extractCityAndCountry(address);

        return {
            provider: "google_places",
            externalId: place.place_id,
            name: place.name,
            location: {
                lat: place.geometry?.location?.lat || 0,
                lng: place.geometry?.location?.lng || 0,
            },
            address,
            city,
            country,
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            photos: this.#extractPhotoUrls(place.photos || []),
            types: place.types || [],
            category: this.#categorize(place.types || []),
            openNow: place.opening_hours?.open_now,
            priceLevel: place.price_level,
            sourceUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            payload: {
                provider: "google_places",
                fallback: "basic-search-result",
            },
        };
    }

    #extractPhotoUrls(photos) {
        return photos.slice(0, 5).map(
            (photo) =>
                `${this.#baseUrl}/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${this.#apiKey}`
        );
    }

    #extractCityAndCountry(address) {
        if (!address) {
            return [undefined, undefined];
        }
        const parts = address.split(",").map((part) => part.trim()).filter(Boolean);
        if (parts.length === 0) {
            return [undefined, undefined];
        }
        if (parts.length === 1) {
            return [undefined, parts[0]];
        }
        return [parts[parts.length - 2], parts[parts.length - 1]];
    }

    #categorize(types) {
        if (types.includes("museum")) return "museum";
        if (types.includes("park")) return "park";
        if (types.includes("natural_feature")) return "nature";
        if (types.includes("place_of_worship")) return "religious";
        if (types.includes("church") || types.includes("mosque") || types.includes("temple") || types.includes("synagogue")) return "religious";
        if (types.includes("amusement_park") || types.includes("zoo") || types.includes("aquarium") || types.includes("stadium")) return "entertainment";
        if (types.includes("art_gallery") || types.includes("library")) return "culture";
        if (types.includes("university")) return "education";
        if (types.includes("landmark") || types.includes("tourist_attraction")) return "landmark";
        if (types.includes("shopping_mall") || types.includes("store")) return "shopping";
        if (types.includes("restaurant") || types.includes("cafe") || types.includes("bar")) return "dining";
        if (types.includes("beach")) return "beach";
        if (types.includes("campground") || types.includes("rv_park")) return "outdoor";
        return "attraction";
    }
}
