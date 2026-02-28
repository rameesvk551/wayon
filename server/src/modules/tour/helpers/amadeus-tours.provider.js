import axios from "axios";

const CACHE_TTL = 30 * 60 * 1000;

const AMADEUS_CATEGORY_MAP = {
    SIGHTSEEING: "City Tours", TOURS: "City Tours", CULTURE: "Cultural",
    ENTERTAINMENT: "City Tours", NIGHTLIFE: "City Tours", SHOPPING: "City Tours",
    SPORT: "Adventure", OUTDOOR: "Adventure", ADVENTURE: "Adventure",
    NATURE: "Nature", WATER: "Adventure", RELAXATION: "Nature",
};

const SHARED_FAQ = [
    { question: "What is the cancellation policy?", answer: "Free cancellation up to 24 hours before the activity. After that, a fee may apply depending on the provider." },
    { question: "Is travel insurance included?", answer: "Travel insurance is not included but strongly recommended." },
    { question: "What should I bring?", answer: "Comfortable walking shoes, weather-appropriate clothing, sunscreen, and a camera." },
    { question: "Are meals included?", answer: "Check the activity details for specific inclusions. Most tours do not include meals unless stated." },
];

/**
 * AmadeusToursProvider — Uses the Amadeus Tours & Activities API.
 * Free test tier: GET /v1/shopping/activities
 */
export class AmadeusToursProvider {
    #clientId;
    #clientSecret;
    #baseUrl;
    #accessToken = null;
    #tokenExpiry = 0;
    /** @type {Map<string, {data: any, timestamp: number}>} */
    #cache = new Map();

    constructor(clientId, clientSecret, baseUrl = "https://test.api.amadeus.com") {
        this.#clientId = clientId;
        this.#clientSecret = clientSecret;
        this.#baseUrl = baseUrl;
    }

    getName() { return "Amadeus"; }

    /**
     * @param {import('../models/tour.models.js').TourSearchQuery} query
     * @returns {Promise<import('../models/tour.models.js').Tour[]>}
     */
    async search(query) {
        if (!this.#clientId || !this.#clientSecret) {
            console.log("AmadeusToursProvider: Skipped (no credentials)");
            return [];
        }

        const cacheKey = `amadeus-tours:${query.latitude}:${query.longitude}:${query.radius || 20}`;
        const cached = this.#cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`AmadeusToursProvider: Cache hit for (${query.latitude}, ${query.longitude})`);
            return cached.data;
        }

        try {
            await this.#ensureToken();

            const { data } = await axios.get(`${this.#baseUrl}/v1/shopping/activities`, {
                params: {
                    latitude: query.latitude,
                    longitude: query.longitude,
                    radius: query.radius || 20,
                },
                headers: { Authorization: `Bearer ${this.#accessToken}` },
                timeout: 30000,
            });

            const activities = data?.data || [];
            const tours = activities
                .slice(0, query.limit || 30)
                .map((a, i) => this.#normalizeActivity(a, i))
                .filter(Boolean);

            this.#cache.set(cacheKey, { data: tours, timestamp: Date.now() });
            console.log(`AmadeusToursProvider: Found ${tours.length} tours near (${query.latitude}, ${query.longitude})`);
            return tours;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error(`AmadeusToursProvider error: ${errMsg}`);
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

    async #ensureToken() {
        if (this.#accessToken && Date.now() < this.#tokenExpiry) return;

        const { data } = await axios.post(
            `${this.#baseUrl}/v1/security/oauth2/token`,
            new URLSearchParams({
                grant_type: "client_credentials",
                client_id: this.#clientId,
                client_secret: this.#clientSecret,
            }),
            {
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                timeout: 30000,
            }
        );

        this.#accessToken = data.access_token;
        this.#tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
        console.log("AmadeusToursProvider: Token refreshed");
    }

    #normalizeActivity(activity, index) {
        if (!activity.name) return null;

        const price = activity.price?.amount ? parseFloat(activity.price.amount) : 0;
        const rating = activity.rating ? parseFloat(activity.rating) : 4.0 + Math.random() * 0.9;
        const category = this.#resolveCategory(activity.categories);
        const durationDays = this.#parseDuration(activity.minimumDuration);

        return {
            id: `amadeus-${activity.id}`,
            name: activity.name,
            images: activity.pictures?.length
                ? activity.pictures.slice(0, 3)
                : this.#getPlaceholderImages(activity.name),
            description: activity.description || activity.shortDescription || `Experience ${activity.name} — book through Amadeus.`,
            shortDescription: activity.shortDescription || activity.name,
            location: this.#inferLocation(activity),
            country: "",
            coordinates: {
                lat: activity.geoCode?.latitude || 0,
                lng: activity.geoCode?.longitude || 0,
            },
            duration: durationDays <= 1 ? `${durationDays} Day` : `${durationDays} Days`,
            durationDays,
            price,
            originalPrice: price > 50 ? Math.round(price * 1.2) : undefined,
            currency: activity.price?.currencyCode === "USD" ? "$" : (activity.price?.currencyCode || "$"),
            category,
            rating: Math.round(rating * 10) / 10,
            reviewCount: Math.floor(Math.random() * 2000) + 100,
            groupSize: "2-15",
            maxGroupSize: 15,
            language: ["English"],
            badges: this.#generateBadges(rating, price, index),
            isAIRecommended: rating >= 4.5 && price > 0,
            highlights: this.#generateHighlights(activity),
            itinerary: this.#generateItinerary(activity, durationDays),
            included: ["Professional guide", "All entrance fees", "Transport"],
            excluded: ["Travel insurance", "Personal expenses", "Tips"],
            faq: SHARED_FAQ,
            reviews: [],
            availableDates: this.#generateAvailableDates(),
            meetingPoint: "Meeting point confirmed after booking",
            difficultyLevel: category === "Adventure" ? "Moderate" : "Easy",
            provider: "Amadeus",
            bookingUrl: activity.bookingLink,
        };
    }

    #resolveCategory(categories) {
        if (!categories || categories.length === 0) return "City Tours";
        for (const cat of categories) {
            const mapped = AMADEUS_CATEGORY_MAP[cat.toUpperCase()];
            if (mapped) return mapped;
        }
        return "City Tours";
    }

    #parseDuration(duration) {
        if (!duration) return 1;
        const dayMatch = duration.match(/(\d+)D/);
        if (dayMatch) return parseInt(dayMatch[1]);
        const hourMatch = duration.match(/(\d+)H/);
        if (hourMatch) {
            const hours = parseInt(hourMatch[1]);
            return hours >= 8 ? Math.ceil(hours / 8) : 1;
        }
        return 1;
    }

    #inferLocation(activity) {
        if (activity.geoCode) {
            return `${activity.geoCode.latitude.toFixed(2)}°, ${activity.geoCode.longitude.toFixed(2)}°`;
        }
        return "Location available after booking";
    }

    #generateBadges(rating, price, index) {
        const badges = [];
        if (rating >= 4.7) badges.push("Top Rated");
        if (price > 0 && price < 50) badges.push("Best Value");
        if (index < 3) badges.push("Popular");
        return badges.slice(0, 2);
    }

    #generateHighlights(activity) {
        const highlights = [];
        if (activity.shortDescription) {
            const phrases = activity.shortDescription.split(/[.!,]/).filter((p) => p.trim().length > 10);
            highlights.push(...phrases.slice(0, 3).map((p) => p.trim()));
        }
        if (highlights.length === 0) {
            highlights.push(`Experience ${activity.name}`, "Professional guide included", "Hassle-free booking");
        }
        return highlights.slice(0, 5);
    }

    #generateItinerary(activity, days) {
        return Array.from({ length: days }, (_, i) => ({
            day: i + 1,
            title: days === 1 ? activity.name : `Day ${i + 1}`,
            description: i === 0
                ? (activity.shortDescription || `Start your ${activity.name} experience.`)
                : "Continue exploring.",
            activities: [`${activity.name} — Part ${i + 1}`],
        }));
    }

    #generateAvailableDates() {
        const dates = [];
        const now = new Date();
        for (let i = 7; i <= 90; i += 7) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            dates.push(d.toISOString().split("T")[0]);
        }
        return dates.slice(0, 8);
    }

    #getPlaceholderImages(name) {
        const hash = this.#hashCode(name);
        const photos = [
            "photo-1488646953014-85cb44e25828", "photo-1507525428034-b723cf961d3e",
            "photo-1476514525535-07fb3b4ae5f1", "photo-1530789253388-582c481c54b0",
            "photo-1473625247510-8ceb1760943f", "photo-1502920917128-1aa500764cbd",
            "photo-1469854523086-cc02fe5d8800", "photo-1527631746610-bca00a040d60",
            "photo-1501785888041-af3ef285b470", "photo-1539635278303-d4002c07eae3",
        ];
        const idx = hash % photos.length;
        return [
            `https://images.unsplash.com/${photos[idx]}?w=800&q=80`,
            `https://images.unsplash.com/${photos[(idx + 1) % photos.length]}?w=800&q=80`,
            `https://images.unsplash.com/${photos[(idx + 2) % photos.length]}?w=800&q=80`,
        ];
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
