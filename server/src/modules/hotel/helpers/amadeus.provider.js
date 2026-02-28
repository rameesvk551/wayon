import axios from "axios";

/**
 * City name to IATA code mapping (common cities).
 */
const CITY_IATA_MAP = {
    paris: "PAR", london: "LON", "new york": "NYC", tokyo: "TYO",
    dubai: "DXB", singapore: "SIN", bangkok: "BKK", bali: "DPS",
    rome: "ROM", barcelona: "BCN", amsterdam: "AMS", mumbai: "BOM",
    delhi: "DEL", istanbul: "IST", "hong kong": "HKG", sydney: "SYD",
    "los angeles": "LAX", "san francisco": "SFO", chicago: "CHI", miami: "MIA",
    berlin: "BER", madrid: "MAD", lisbon: "LIS", vienna: "VIE",
    prague: "PRG", zurich: "ZRH", seoul: "SEL", taipei: "TPE",
    "kuala lumpur": "KUL", manila: "MNL", jakarta: "JKT", cairo: "CAI",
    nairobi: "NBO", "cape town": "CPT", melbourne: "MEL", auckland: "AKL",
    toronto: "YTO", vancouver: "YVR", "mexico city": "MEX", "sao paulo": "SAO",
    "buenos aires": "BUE", "rio de janeiro": "RIO", lima: "LIM", bogota: "BOG",
    maldives: "MLE", phuket: "HKT", cancun: "CUN", hawaii: "HNL",
    "las vegas": "LAS", orlando: "MCO", denpasar: "DPS", seminyak: "DPS",
    ubud: "DPS", kuta: "DPS", jimbaran: "DPS", "nusa dua": "DPS",
    canggu: "DPS", sanur: "DPS", uluwatu: "DPS", athens: "ATH",
    santorini: "JTR", florence: "FLR", venice: "VCE", milan: "MIL",
    nice: "NCE", munich: "MUC", dublin: "DUB", edinburgh: "EDI",
    moscow: "MOW", "st petersburg": "LED", marrakech: "RAK", doha: "DOH",
    "abu dhabi": "AUH", muscat: "MCT", colombo: "CMB", kathmandu: "KTM",
    hanoi: "HAN", "ho chi minh": "SGN", "phnom penh": "PNH", yangon: "RGN",
    goa: "GOI", jaipur: "JAI", agra: "AGR", varanasi: "VNS",
    chennai: "MAA", kolkata: "CCU", hyderabad: "HYD", bangalore: "BLR",
    kochi: "COK", pune: "PNQ", ahmedabad: "AMD", lucknow: "LKO",
};

const LUXURY_CHAINS = new Set(["FS", "RZ", "WI", "SI", "MC", "HY", "AK", "LW", "EL"]);
const MID_CHAINS = new Set(["HI", "BW", "IH", "RA", "WY", "NH", "AC", "PF", "YX"]);

const CACHE_TTL = 30 * 60 * 1000;

/**
 * AmadeusHotelProvider — Uses the Amadeus Self-Service Hotel APIs.
 */
export class AmadeusHotelProvider {
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
     * @param {import('../models/hotel.models.js').HotelSearchQuery} query
     * @returns {Promise<import('../models/hotel.models.js').Hotel[]>}
     */
    async search(query) {
        if (!this.#clientId || !this.#clientSecret) {
            console.log("AmadeusHotelProvider: Skipped (no credentials)");
            return [];
        }

        const cacheKey = `amadeus:${query.location}:${query.checkin}:${query.checkout}`;
        const cached = this.#cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log(`AmadeusHotelProvider: Cache hit for "${query.location}"`);
            return cached.data;
        }

        try {
            await this.#ensureToken();

            const cityCode = this.#resolveIATACode(query.location);
            if (!cityCode) {
                console.log(`AmadeusHotelProvider: No IATA code found for "${query.location}"`);
                return [];
            }

            console.log(`AmadeusHotelProvider: Searching hotels for city code ${cityCode}...`);

            const { data } = await axios.get(
                `${this.#baseUrl}/v1/reference-data/locations/hotels/by-city`,
                {
                    params: { cityCode, radius: 30, radiusUnit: "KM" },
                    headers: { Authorization: `Bearer ${this.#accessToken}` },
                    timeout: 30000,
                }
            );

            const hotelList = data?.data || [];
            console.log(`AmadeusHotelProvider: API returned ${hotelList.length} hotels for ${cityCode}`);

            if (hotelList.length === 0) return [];

            const hotels = this.#normalizeHotelList(hotelList.slice(0, 30), query);
            this.#cache.set(cacheKey, { data: hotels, timestamp: Date.now() });

            console.log(`AmadeusHotelProvider: Returning ${hotels.length} hotels for "${query.location}"`);
            return hotels;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error(`AmadeusHotelProvider error: ${errMsg}`);
            if (axios.isAxiosError(error)) {
                console.error(`  Status: ${error.response?.status}`);
                console.error(`  Data: ${JSON.stringify(error.response?.data)}`);
            }
            return [];
        }
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
        console.log("AmadeusHotelProvider: OAuth token obtained ✅");
    }

    #resolveIATACode(location) {
        const city = location.split(",")[0].trim().toLowerCase();
        if (CITY_IATA_MAP[city]) return CITY_IATA_MAP[city];

        for (const [name, code] of Object.entries(CITY_IATA_MAP)) {
            if (city.includes(name) || name.includes(city)) return code;
        }

        if (/^[A-Z]{3}$/.test(location.trim())) return location.trim();
        return null;
    }

    #normalizeHotelList(hotelList, query) {
        const checkIn = new Date(query.checkin);
        const checkOut = new Date(query.checkout);
        const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));

        return hotelList.map((hotel) => {
            const lat = hotel.geoCode?.latitude || 0;
            const lng = hotel.geoCode?.longitude || 0;
            const distKm = hotel.distance?.value || 0;

            const pricePerNight = this.#estimatePrice(hotel.chainCode, hotel.name, distKm);
            const totalPrice = pricePerNight * nights;
            const rating = this.#estimateRating(hotel.chainCode);
            const amenities = this.#generateAmenities(hotel.chainCode, hotel.name);

            const badges = [];
            if (rating >= 4.5) badges.push("Top Rated");
            if (pricePerNight < 100) badges.push("Best Value");
            if (distKm < 2) badges.push("City Center");

            const formattedName = this.#formatHotelName(hotel.name);

            return {
                id: `amadeus-${hotel.hotelId}`,
                name: formattedName,
                lat, lng,
                price: totalPrice,
                currency: "USD",
                originalPrice: Math.round(totalPrice * 1.2),
                rating,
                reviewCount: Math.floor(500 + this.#hashCode(hotel.name) % 3000),
                provider: "Amadeus",
                address: hotel.address?.lines?.join(", "),
                city: hotel.address?.cityName || query.location,
                country: hotel.address?.countryCode,
                amenities,
                images: this.#getPlaceholderImages(hotel.name),
                description: `${formattedName} in ${query.location} • ${distKm.toFixed(1)} km from center`,
                badges,
                stars: this.#estimateStars(hotel.chainCode),
                distance: `${distKm.toFixed(1)} km`,
                landmark: query.location.split(",")[0].trim(),
            };
        });
    }

    #estimatePrice(chainCode, name, distKm = 0) {
        let basePrice = 120;
        if (chainCode && LUXURY_CHAINS.has(chainCode)) {
            basePrice = 280 + (this.#hashCode(name || "") % 300);
        } else if (chainCode && MID_CHAINS.has(chainCode)) {
            basePrice = 100 + (this.#hashCode(name || "") % 150);
        } else {
            basePrice = 50 + (this.#hashCode(name || "") % 200);
        }
        if (distKm < 2) basePrice *= 1.15;
        else if (distKm > 15) basePrice *= 0.85;
        return Math.round(basePrice);
    }

    #estimateRating(chainCode) {
        if (chainCode && LUXURY_CHAINS.has(chainCode)) return 4.5 + Math.random() * 0.5;
        if (chainCode && MID_CHAINS.has(chainCode)) return 3.8 + Math.random() * 0.7;
        return 3.5 + Math.random() * 1.0;
    }

    #estimateStars(chainCode) {
        if (chainCode && LUXURY_CHAINS.has(chainCode)) return 5;
        if (chainCode && MID_CHAINS.has(chainCode)) return 4;
        return 3;
    }

    #generateAmenities(chainCode, name) {
        const base = ["Free WiFi"];
        const nameLC = (name || "").toLowerCase();
        if (chainCode && LUXURY_CHAINS.has(chainCode)) {
            base.push("Pool", "Spa", "Restaurant", "Gym", "Room Service");
        } else if (chainCode && MID_CHAINS.has(chainCode)) {
            base.push("Pool", "Restaurant", "Parking");
        } else {
            base.push("Parking", "Breakfast");
        }
        if (nameLC.includes("resort")) base.push("Beach Access");
        if (nameLC.includes("villa")) base.push("Kitchen");
        if (nameLC.includes("suite")) base.push("Living Area");
        return [...new Set(base)].slice(0, 6);
    }

    #formatHotelName(name) {
        if (name === name.toUpperCase()) {
            return name.toLowerCase().split(" ").map((word, i) => {
                if (i !== 0 && ["at", "the", "and", "of", "in", "by", "on", "a", "an"].includes(word)) return word;
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(" ");
        }
        return name;
    }

    #getPlaceholderImages(name) {
        const hash = this.#hashCode(name);
        const photos = [
            "photo-1566073771259-6a8506099945", "photo-1520250497591-112f2f40a3f4",
            "photo-1542314831-068cd1dbfeeb", "photo-1551882547-ff40c63fe5fa",
            "photo-1571896349842-33c89424de2d", "photo-1582719478250-c89cae4dc85b",
            "photo-1590490360182-c33d57733427", "photo-1564501049412-61c2a3083791",
            "photo-1596178065887-1198b6148b2b", "photo-1611892440504-42a792e24d32",
            "photo-1618773928121-c32242e63f39", "photo-1631049307264-da0ec9d70304",
        ];
        const idx = hash % photos.length;
        return [
            `https://images.unsplash.com/${photos[idx]}?w=600&h=400&fit=crop`,
            `https://images.unsplash.com/${photos[(idx + 1) % photos.length]}?w=600&h=400&fit=crop`,
            `https://images.unsplash.com/${photos[(idx + 2) % photos.length]}?w=600&h=400&fit=crop`,
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
