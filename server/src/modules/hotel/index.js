import { AmadeusHotelProvider } from "./helpers/amadeus.provider.js";
import { MakcorpsProvider } from "./helpers/makcorps.provider.js";
import { RapidApiHotelProvider } from "./helpers/rapidapi.provider.js";
import { HotelService } from "./services/hotel.service.js";
import { HotelController } from "./controller/hotel.controller.js";
import { createHotelRoutes } from "./routes/hotel.routes.js";

/**
 * Bootstraps the entire Hotel module and returns a ready-to-mount Express Router.
 *
 * Composition:  Providers → Service → Controller → Routes
 *
 * Providers are conditionally enabled based on environment variables.
 * The module works with even just 1 provider configured.
 *
 * @returns {import('express').Router}
 */
export default function createHotelModule() {
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID || "";
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET || "";
    const amadeusBaseUrl = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";
    const makcorpsApiKey = process.env.MAKCORPS_API_KEY || "";
    const rapidApiKey = process.env.RAPIDAPI_KEY || "";

    const providers = [];

    if (amadeusClientId && amadeusClientSecret) {
        providers.push(new AmadeusHotelProvider(amadeusClientId, amadeusClientSecret, amadeusBaseUrl));
        console.log("🏨 Hotel module: Amadeus provider enabled");
    }

    if (makcorpsApiKey) {
        providers.push(new MakcorpsProvider(makcorpsApiKey));
        console.log("🏨 Hotel module: Makcorps provider enabled");
    }

    if (rapidApiKey) {
        providers.push(new RapidApiHotelProvider(rapidApiKey));
        console.log("🏨 Hotel module: RapidAPI provider enabled");
    }

    if (providers.length === 0) {
        console.warn(
            "⚠️  Hotel module: No API keys configured — all providers will return empty results.\n" +
            "   Set at least one of: AMADEUS_CLIENT_ID+SECRET, MAKCORPS_API_KEY, or RAPIDAPI_KEY"
        );
    }

    console.log(`🏨 Hotel module: ${providers.length} provider(s) active`);

    const service = new HotelService(providers);
    const controller = new HotelController(service);
    const router = createHotelRoutes(controller);

    return router;
}
