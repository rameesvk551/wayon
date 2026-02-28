import axios from "axios";

const CACHE_TTL = 30 * 60 * 1000;

/**
 * RapidApiHotelProvider — Uses Booking.com or Hotels.com API on RapidAPI.
 * Falls back to Makcorps API on RapidAPI.
 */
export class RapidApiHotelProvider {
    #apiKey;
    /** @type {Map<string, {data: any, timestamp: number}>} */
    #cache = new Map();

    constructor(apiKey) {
        this.#apiKey = apiKey || "";
    }

    getName() { return "RapidAPI"; }

    /**
     * @param {import('../models/hotel.models.js').HotelSearchQuery} query
     * @returns {Promise<import('../models/hotel.models.js').Hotel[]>}
     */
    async search(query) {
        if (!this.#apiKey) {
            console.log("RapidApiHotelProvider: Skipped (no API key)");
            return [];
        }

        const cacheKey = `rapidapi:${query.location}:${query.checkin}:${query.checkout}`;
        const cached = this.#cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`RapidApiHotelProvider: Cache hit for "${query.location}"`);
            return cached.data;
        }

        let hotels = await this.#searchBookingCom(query);
        if (hotels.length === 0) {
            hotels = await this.#searchMakcorpsRapidApi(query);
        }

        if (hotels.length > 0) {
            this.#cache.set(cacheKey, { data: hotels, timestamp: Date.now() });
        }

        console.log(`RapidApiHotelProvider: Found ${hotels.length} hotels for "${query.location}"`);
        return hotels;
    }

    async #searchBookingCom(query) {
        try {
            const { data } = await axios.get(
                "https://booking-com.p.rapidapi.com/v1/hotels/search",
                {
                    params: {
                        dest_type: "city",
                        dest_id: "",
                        checkout_date: query.checkout,
                        checkin_date: query.checkin,
                        adults_number: query.guests,
                        room_number: 1,
                        units: "metric",
                        filter_by_currency: "USD",
                        order_by: "popularity",
                        locale: "en-us",
                    },
                    headers: {
                        "X-RapidAPI-Key": this.#apiKey,
                        "X-RapidAPI-Host": "booking-com.p.rapidapi.com",
                    },
                    timeout: 15000,
                }
            );

            const results = data?.result || [];
            return this.#normalizeBookingResults(results, query.location);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.warn(`RapidApiHotelProvider (Booking.com) failed: ${errMsg}`);
            return [];
        }
    }

    async #searchMakcorpsRapidApi(query) {
        try {
            const cityName = query.location.split(",")[0].trim().toLowerCase();
            const { data } = await axios.get(
                `https://makcorps-hotels.p.rapidapi.com/free/${encodeURIComponent(cityName)}`,
                {
                    headers: {
                        "X-RapidAPI-Key": this.#apiKey,
                        "X-RapidAPI-Host": "makcorps-hotels.p.rapidapi.com",
                    },
                    timeout: 15000,
                }
            );

            return this.#normalizeMakcorpsResults(data, query.location);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.warn(`RapidApiHotelProvider (Makcorps) failed: ${errMsg}`);
            return [];
        }
    }

    #normalizeBookingResults(results, location) {
        return results.slice(0, 30).map((item, index) => {
            const name = item.hotel_name || item.name || `Hotel ${index + 1}`;
            const price = item.min_total_price ||
                item.price_breakdown?.all_inclusive_price ||
                item.price_breakdown?.gross_price ||
                this.#parsePrice(item.price) || 0;

            return {
                id: `rapidapi-${item.hotel_id || index}`,
                name,
                lat: parseFloat(String(item.latitude || 0)),
                lng: parseFloat(String(item.longitude || 0)),
                price,
                currency: "USD",
                rating: item.review_score ? item.review_score / 2 : undefined,
                reviewCount: item.review_nr,
                provider: "RapidAPI",
                address: item.address,
                city: item.city_name || item.city || location,
                country: item.country,
                amenities: this.#extractAmenities(item),
                images: this.#getImages(item),
                url: item.url,
                description: item.unit_configuration_label || `${name} in ${location}`,
                stars: item.star_rating,
                distance: item.distance_to_cc ? `${item.distance_to_cc} km` : undefined,
                landmark: item.district,
            };
        });
    }

    #normalizeMakcorpsResults(data, location) {
        const hotels = [];
        if (!data || typeof data !== "object") return hotels;

        const entries = Array.isArray(data) ? data : Object.values(data);

        for (let i = 0; i < Math.min(entries.length, 30); i++) {
            const item = entries[i];
            if (!item || typeof item !== "object") continue;

            const name = String(item.name || item.hotel_name || `Hotel ${i + 1}`);
            let bestPrice = 0;
            for (let v = 1; v <= 10; v++) {
                const vendor = item[`vendor${v}`];
                if (vendor && typeof vendor === "object") {
                    const price = this.#parsePrice(vendor.price);
                    if (price > 0 && (bestPrice === 0 || price < bestPrice)) bestPrice = price;
                }
            }

            const hash = this.#hashCode(name);
            hotels.push({
                id: `rapidapi-mak-${i}`,
                name,
                lat: 28.6139 + (hash % 100) * 0.001,
                lng: 77.209 + ((hash >> 8) % 100) * 0.001,
                price: bestPrice,
                currency: "USD",
                provider: "RapidAPI",
                city: location,
                amenities: ["WiFi"],
                images: this.#getPlaceholderImages(name),
                description: `${name} in ${location}`,
            });
        }

        return hotels;
    }

    #extractAmenities(item) {
        const amenities = ["WiFi"];
        if (item.accommodation_type_name?.toLowerCase().includes("resort")) {
            amenities.push("Pool", "Spa");
        }
        return amenities;
    }

    #getImages(item) {
        const images = [];
        if (item.main_photo_url) images.push(item.main_photo_url.replace("square60", "square600"));
        if (item.photo_url) images.push(item.photo_url);
        if (images.length === 0) return this.#getPlaceholderImages(item.hotel_name || "hotel");
        return images;
    }

    #parsePrice(price) {
        if (typeof price === "number") return price;
        if (typeof price === "string") {
            const cleaned = price.replace(/[^0-9.]/g, "");
            return parseFloat(cleaned) || 0;
        }
        return 0;
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
        ];
        const idx = hash % photos.length;
        return [
            `https://images.unsplash.com/${photos[idx]}?w=600&h=400&fit=crop`,
            `https://images.unsplash.com/${photos[(idx + 1) % photos.length]}?w=600&h=400&fit=crop`,
        ];
    }
}
