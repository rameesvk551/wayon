import axios from "axios";

const CACHE_TTL = 30 * 60 * 1000;

/**
 * MakcorpsProvider — Uses the Makcorps Hotel Price API.
 * Free tier: ~30 hotels per city, prices from 200+ OTAs.
 */
export class MakcorpsProvider {
    #apiKey;
    #baseUrl = "https://api.makcorps.com";
    /** @type {Map<string, {data: any, timestamp: number}>} */
    #cache = new Map();

    constructor(apiKey) {
        this.#apiKey = apiKey || "";
    }

    getName() { return "Makcorps"; }

    /**
     * @param {import('../models/hotel.models.js').HotelSearchQuery} query
     * @returns {Promise<import('../models/hotel.models.js').Hotel[]>}
     */
    async search(query) {
        if (!this.#apiKey) {
            console.log("MakcorpsProvider: Skipped (no API key)");
            return [];
        }

        const cacheKey = `makcorps:${query.location.toLowerCase()}`;
        const cached = this.#cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`MakcorpsProvider: Cache hit for "${query.location}"`);
            return cached.data;
        }

        try {
            const cityName = query.location.split(",")[0].trim().toLowerCase();
            const { data } = await axios.get(
                `${this.#baseUrl}/free/${encodeURIComponent(cityName)}`,
                {
                    headers: { Authorization: this.#apiKey },
                    timeout: 30000,
                }
            );

            const hotels = this.#normalizeResults(data, query.location);
            this.#cache.set(cacheKey, { data: hotels, timestamp: Date.now() });

            console.log(`MakcorpsProvider: Found ${hotels.length} hotels for "${query.location}"`);
            return hotels;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error(`MakcorpsProvider error: ${errMsg}`);
            return [];
        }
    }

    #normalizeResults(data, location) {
        const hotels = [];

        if (!data || !Array.isArray(data)) {
            if (data && typeof data === "object") {
                for (const key of Object.keys(data)) {
                    if (!isNaN(Number(key)) && data[key] && typeof data[key] === "object") {
                        const hotel = this.#parseHotel(data[key], key, location);
                        if (hotel) hotels.push(hotel);
                    }
                }
            }
            return hotels;
        }

        for (let i = 0; i < data.length; i++) {
            const hotel = this.#parseHotel(data[i], String(i), location);
            if (hotel) hotels.push(hotel);
        }
        return hotels;
    }

    #parseHotel(item, index, location) {
        if (!item) return null;

        const name = item.name || item.hotel_name || `Hotel ${index}`;
        let lowestPrice = Infinity;
        const vendors = [];

        if (item.vendors && Array.isArray(item.vendors)) {
            for (const vendor of item.vendors) {
                const price = this.#parsePrice(vendor.price);
                if (price > 0 && price < lowestPrice) lowestPrice = price;
                if (vendor.vendor) vendors.push(vendor.vendor);
            }
        }

        for (let v = 1; v <= 10; v++) {
            const vendorData = item[`vendor${v}`];
            if (vendorData && typeof vendorData === "object" && "price" in vendorData) {
                const price = this.#parsePrice(vendorData.price);
                if (price > 0 && price < lowestPrice) lowestPrice = price;
                if (vendorData.vendor) vendors.push(vendorData.vendor);
            }
        }

        if (lowestPrice === Infinity) lowestPrice = 0;

        const hash = this.#hashCode(name);
        const baseLat = 28.6139 + (hash % 100) * 0.001;
        const baseLng = 77.209 + ((hash >> 8) % 100) * 0.001;

        return {
            id: `makcorps-${item.hotelId || item.hotel_id || index}`,
            name,
            lat: baseLat,
            lng: baseLng,
            price: lowestPrice,
            currency: "USD",
            provider: "Makcorps",
            city: location,
            amenities: ["WiFi"],
            images: this.#getPlaceholderImages(name),
            description: `Hotel in ${location} • Best price from ${vendors.length} vendors: ${vendors.slice(0, 3).join(", ")}`,
            badges: vendors.length > 3 ? ["Multi-Vendor"] : [],
        };
    }

    #parsePrice(price) {
        if (price === undefined || price === null) return 0;
        if (typeof price === "number") return price;
        const cleaned = String(price).replace(/[^0-9.]/g, "");
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? 0 : parsed;
    }

    #hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    #getPlaceholderImages(name) {
        const hash = this.#hashCode(name);
        const photos = [
            "photo-1566073771259-6a8506099945", "photo-1520250497591-112f2f40a3f4",
            "photo-1542314831-068cd1dbfeeb", "photo-1551882547-ff40c63fe5fa",
            "photo-1571896349842-33c89424de2d", "photo-1582719478250-c89cae4dc85b",
            "photo-1590490360182-c33d57733427", "photo-1564501049412-61c2a3083791",
            "photo-1596178065887-1198b6148b2b", "photo-1611892440504-42a792e24d32",
        ];
        const idx = hash % photos.length;
        return [
            `https://images.unsplash.com/${photos[idx]}?w=600&h=400&fit=crop`,
            `https://images.unsplash.com/${photos[(idx + 1) % photos.length]}?w=600&h=400&fit=crop`,
            `https://images.unsplash.com/${photos[(idx + 2) % photos.length]}?w=600&h=400&fit=crop`,
        ];
    }
}
