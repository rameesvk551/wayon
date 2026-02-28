/**
 * Geocoding Service — geocodes place names via Mapbox, Google, or Nominatim.
 * Converted from pdf-service geocoding.service.ts — all logic identical.
 */

const DEFAULT_PROVIDER_ORDER = ["mapbox", "nominatim", "google"];
const CACHE_TTL_MS = Number(process.env.GEOCODING_CACHE_TTL_MS || 24 * 60 * 60 * 1000);

const sanitize = (value) =>
    value.toLowerCase().replace(/[()[\]{}]/g, " ").replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();

const normalizePlaceName = (name) =>
    sanitize(name).replace(/\b(the|at|in|near)\b/g, " ").replace(/\s+/g, " ").trim();

const buildCacheKey = (input) => {
    const name = normalizePlaceName(input.name);
    const city = input.city ? sanitize(input.city) : "";
    const country = input.country ? sanitize(input.country) : "";
    return [name, city, country].filter(Boolean).join("|");
};

const parseProviderOrder = () => {
    const raw = process.env.GEOCODING_PROVIDERS;
    if (!raw) return DEFAULT_PROVIDER_ORDER;
    const unique = new Set();
    for (const part of raw.split(",")) {
        const normalized = part.trim().toLowerCase();
        if (["mapbox", "google", "nominatim"].includes(normalized)) unique.add(normalized);
    }
    return unique.size ? Array.from(unique) : DEFAULT_PROVIDER_ORDER;
};

export class GeocodingService {
    #providerOrder;
    #cache = new Map();

    constructor(providerOrder = parseProviderOrder()) {
        this.#providerOrder = providerOrder;
    }

    async geocodeMany(inputs) {
        const deduped = new Map();
        for (const input of inputs) {
            if (!input.name?.trim()) continue;
            const key = buildCacheKey(input);
            if (!deduped.has(key)) deduped.set(key, input);
        }

        const entries = await Promise.all(
            Array.from(deduped.entries()).map(async ([key, input]) => {
                const result = await this.geocodeOne(input);
                return [key, result];
            })
        );

        const resolved = new Map();
        for (const [key, value] of entries) {
            if (value) resolved.set(key, value);
        }
        return resolved;
    }

    async geocodeOne(input) {
        if (!input.name?.trim()) return null;

        const cacheKey = buildCacheKey(input);
        const cached = this.#cache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) return cached.value;

        for (const provider of this.#providerOrder) {
            try {
                const found = await this.#geocodeWithProvider(provider, input);
                if (!found) continue;
                this.#cache.set(cacheKey, { value: found, expiresAt: Date.now() + CACHE_TTL_MS });
                return found;
            } catch { continue; }
        }
        return null;
    }

    async #geocodeWithProvider(provider, input) {
        if (provider === "mapbox") return this.#queryMapbox(input);
        if (provider === "google") return this.#queryGoogle(input);
        return this.#queryNominatim(input);
    }

    #buildQuery(input) {
        return [normalizePlaceName(input.name), input.city?.trim(), input.country?.trim()].filter(Boolean).join(", ");
    }

    async #queryMapbox(input) {
        const token = process.env.MAPBOX_TOKEN;
        if (!token) return null;

        const query = this.#buildQuery(input);
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?limit=1&access_token=${token}`;
        const response = await fetch(url);
        if (!response.ok) return null;

        const payload = await response.json();
        const feature = payload.features?.[0];
        if (!feature?.center || feature.center.length < 2) return null;

        return { name: input.name, lat: feature.center[1], lng: feature.center[0], provider: "mapbox" };
    }

    async #queryGoogle(input) {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) return null;

        const query = this.#buildQuery(input);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) return null;

        const payload = await response.json();
        if (payload.status !== "OK") return null;
        const loc = payload.results?.[0]?.geometry?.location;
        if (typeof loc?.lat !== "number" || typeof loc?.lng !== "number") return null;

        return { name: input.name, lat: loc.lat, lng: loc.lng, provider: "google" };
    }

    async #queryNominatim(input) {
        const query = this.#buildQuery(input);
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
        const response = await fetch(url, {
            headers: { "User-Agent": process.env.GEOCODING_USER_AGENT || "travel-pdf-service/1.0" },
        });
        if (!response.ok) return null;

        const payload = await response.json();
        const first = payload[0];
        if (!first?.lat || !first?.lon) return null;

        const lat = Number(first.lat);
        const lng = Number(first.lon);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        return { name: input.name, lat, lng, provider: "nominatim" };
    }
}

export { buildCacheKey as buildGeocodeCacheKey };
