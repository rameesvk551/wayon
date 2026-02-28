import axios from "axios";

const CACHE_TTL = 60 * 60 * 1000; // 60 minutes (Geoapify data changes slowly)

const GEOAPIFY_CATEGORY_MAP = {
    "tourism.sights": "City Tours", "tourism.attraction": "City Tours",
    "tourism.sights.monument": "Cultural", "tourism.sights.memorial": "Cultural",
    "tourism.sights.castle": "Cultural", "tourism.sights.ruins": "Cultural",
    "tourism.sights.archaeological_site": "Cultural",
    "tourism.sights.tower": "City Tours",
    "tourism.sights.church": "Cultural", "tourism.sights.temple": "Cultural",
    "tourism.sights.mosque": "Cultural", "tourism.sights.synagogue": "Cultural",
    "entertainment.museum": "Cultural", "entertainment.culture": "Cultural",
    "entertainment.zoo": "Nature", "entertainment.aquarium": "Nature",
    "entertainment.theme_park": "Adventure", "entertainment.water_park": "Adventure",
    natural: "Nature", "natural.beach": "Nature", "natural.forest": "Nature",
    "natural.mountain": "Adventure", "natural.water": "Nature",
    sport: "Adventure", "sport.climbing": "Adventure",
    "sport.diving": "Adventure", "sport.hiking": "Adventure",
};

const SHARED_FAQ = [
    { question: "Is this a guided tour?", answer: "This is a self-guided attraction. Guided tours may be available on-site." },
    { question: "What are the opening hours?", answer: "Opening hours vary by season. Check the venue directly for current hours." },
    { question: "Is there an entrance fee?", answer: "Some attractions may charge an entrance fee. Check the venue for pricing." },
    { question: "Is it accessible?", answer: "Accessibility varies. Contact the venue directly for specific accessibility information." },
];

/**
 * GeoapifyToursProvider — Uses Geoapify Places API for tourist attractions.
 * Free tier: 3,000 credits/day.
 */
export class GeoapifyToursProvider {
    #apiKey;
    #baseUrl = "https://api.geoapify.com/v2";
    /** @type {Map<string, {data: any, timestamp: number}>} */
    #cache = new Map();

    constructor(apiKey) {
        this.#apiKey = apiKey || "";
    }

    getName() { return "Geoapify"; }

    /**
     * @param {import('../models/tour.models.js').TourSearchQuery} query
     * @returns {Promise<import('../models/tour.models.js').Tour[]>}
     */
    async search(query) {
        if (!this.#apiKey) {
            console.log("GeoapifyToursProvider: Skipped (no API key)");
            return [];
        }

        const radius = (query.radius || 20) * 1000;
        const cacheKey = `geoapify:${query.latitude}:${query.longitude}:${radius}`;
        const cached = this.#cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`GeoapifyToursProvider: Cache hit for (${query.latitude}, ${query.longitude})`);
            return cached.data;
        }

        try {
            const categories = [
                "tourism.sights", "tourism.attraction",
                "entertainment.museum", "entertainment.culture",
                "entertainment.zoo", "entertainment.aquarium",
                "entertainment.theme_park",
            ].join(",");

            const { data } = await axios.get(`${this.#baseUrl}/places`, {
                params: {
                    categories,
                    filter: `circle:${query.longitude},${query.latitude},${radius}`,
                    bias: `proximity:${query.longitude},${query.latitude}`,
                    limit: query.limit || 20,
                    apiKey: this.#apiKey,
                },
                timeout: 10000,
            });

            const places = data?.features || [];
            const tours = places
                .filter((p) => p.properties.name)
                .map((p, i) => this.#normalizePlace(p, i))
                .filter(Boolean);

            this.#cache.set(cacheKey, { data: tours, timestamp: Date.now() });
            console.log(`GeoapifyToursProvider: Found ${tours.length} attractions near (${query.latitude}, ${query.longitude})`);
            return tours;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error(`GeoapifyToursProvider error: ${errMsg}`);
            return [];
        }
    }

    /**
     * @param {string} id
     * @returns {Promise<import('../models/tour.models.js').Tour | null>}
     */
    async getById(id) {
        for (const entry of this.#cache.values()) {
            const tour = entry.data.find((t) => t.id === id);
            if (tour) return tour;
        }
        return null;
    }

    #normalizePlace(place, index) {
        const props = place.properties;
        if (!props.name) return null;

        const category = this.#resolveCategory(props.categories);
        const raw = props.datasource?.raw;

        return {
            id: `geoapify-${props.place_id}`,
            name: props.name,
            images: this.#getImages(props.name, raw?.image),
            description: raw?.description || `Visit ${props.name} in ${props.city || props.country || "this area"}. ${props.formatted || ""}`,
            shortDescription: `Explore ${props.name} — ${category.toLowerCase()} experience in ${props.city || props.country || "the area"}.`,
            location: props.city || props.address_line1 || props.formatted || "Unknown",
            country: props.country || "",
            coordinates: { lat: props.lat, lng: props.lon },
            duration: "1 Day",
            durationDays: 1,
            price: this.#estimatePrice(category, props.categories),
            currency: "$",
            category,
            rating: 4.0 + Math.round(Math.random() * 9) / 10,
            reviewCount: Math.floor(Math.random() * 1500) + 50,
            groupSize: "1-20",
            maxGroupSize: 20,
            language: ["English"],
            badges: this.#generateBadges(index, category),
            isAIRecommended: index < 5,
            highlights: this.#generateHighlights(props),
            itinerary: [{
                day: 1,
                title: props.name,
                description: `Visit ${props.name}`,
                activities: [`Explore ${props.name}`, "Free time for photos", "Local area exploration"],
            }],
            included: ["Entrance fee (if applicable)", "Map & directions"],
            excluded: ["Transport", "Meals", "Personal expenses"],
            faq: SHARED_FAQ,
            reviews: [],
            availableDates: this.#generateAvailableDates(),
            meetingPoint: props.formatted || props.address_line1 || "At the venue entrance",
            difficultyLevel: category === "Adventure" ? "Moderate" : "Easy",
            provider: "Geoapify",
            bookingUrl: raw?.website,
        };
    }

    #resolveCategory(categories) {
        if (!categories || categories.length === 0) return "City Tours";
        for (const cat of categories) {
            const mapped = GEOAPIFY_CATEGORY_MAP[cat];
            if (mapped) return mapped;
            for (const [key, value] of Object.entries(GEOAPIFY_CATEGORY_MAP)) {
                if (cat.startsWith(key) || key.startsWith(cat)) return value;
            }
        }
        return "City Tours";
    }

    #estimatePrice(category, categories) {
        const isFree = categories?.some((c) =>
            c.includes("park") || c.includes("beach") || c.includes("natural")
        );
        if (isFree) return 0;

        switch (category) {
            case "Cultural": return Math.floor(Math.random() * 30) + 10;
            case "Adventure": return Math.floor(Math.random() * 80) + 30;
            case "Nature": return Math.floor(Math.random() * 20) + 5;
            case "City Tours": return Math.floor(Math.random() * 40) + 15;
            default: return Math.floor(Math.random() * 25) + 10;
        }
    }

    #generateBadges(index, category) {
        const badges = [];
        if (index < 3) badges.push("Popular");
        if (category === "Cultural") badges.push("Cultural Gem");
        if (category === "Nature") badges.push("Eco-Friendly");
        if (category === "Adventure") badges.push("Adventure Pick");
        return badges.slice(0, 2);
    }

    #generateHighlights(props) {
        const highlights = [];
        highlights.push(`Visit ${props.name}`);
        if (props.city) highlights.push(`Located in ${props.city}`);
        if (props.country) highlights.push(`${props.country}`);
        const raw = props.datasource?.raw;
        if (raw?.opening_hours) highlights.push(`Hours: ${raw.opening_hours}`);
        if (raw?.wikipedia) highlights.push("Featured on Wikipedia");
        return highlights.slice(0, 5);
    }

    #getImages(name, directImage) {
        if (directImage) {
            return [directImage, ...this.#getPlaceholderImages(name).slice(0, 2)];
        }
        return this.#getPlaceholderImages(name);
    }

    #getPlaceholderImages(name) {
        const hash = this.#hashCode(name);
        const photos = [
            "photo-1488646953014-85cb44e25828", "photo-1502602898657-3e91760cbb34",
            "photo-1499856871958-5b9627545d1a", "photo-1540959733332-eab4deabeeaf",
            "photo-1493976040374-85c8e12f0c0e", "photo-1516426122078-c23e76319801",
            "photo-1537996194471-e657df975ab4", "photo-1526392060635-9d6019884377",
            "photo-1520769669658-f07657f5a307", "photo-1507525428034-b723cf961d3e",
        ];
        const idx = hash % photos.length;
        return [
            `https://images.unsplash.com/${photos[idx]}?w=800&q=80`,
            `https://images.unsplash.com/${photos[(idx + 1) % photos.length]}?w=800&q=80`,
            `https://images.unsplash.com/${photos[(idx + 2) % photos.length]}?w=800&q=80`,
        ];
    }

    #generateAvailableDates() {
        const dates = [];
        const now = new Date();
        for (let i = 1; i <= 60; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            dates.push(d.toISOString().split("T")[0]);
        }
        return dates.slice(0, 12);
    }

    #hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }
}
