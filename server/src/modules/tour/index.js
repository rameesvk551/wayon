import { AmadeusToursProvider } from "./helpers/amadeus-tours.provider.js";
import { GeoapifyToursProvider } from "./helpers/geoapify-tours.provider.js";
import { TourService } from "./services/tour.service.js";
import { TourController } from "./controller/tour.controller.js";
import { createTourRoutes } from "./routes/tour.routes.js";

/**
 * Bootstraps the entire Tour module and returns a ready-to-mount Express Router.
 *
 * Composition:  Providers → Service → Controller → Routes
 *
 * Providers are conditionally enabled based on environment variables.
 *
 * @returns {import('express').Router}
 */
export default function createTourModule() {
    const amadeusClientId = process.env.AMADEUS_CLIENT_ID || "";
    const amadeusClientSecret = process.env.AMADEUS_CLIENT_SECRET || "";
    const amadeusBaseUrl = process.env.AMADEUS_BASE_URL || "https://test.api.amadeus.com";
    const geoapifyApiKey = process.env.GEOAPIFY_API_KEY || "";

    const providers = [];

    if (amadeusClientId && amadeusClientSecret) {
        providers.push(new AmadeusToursProvider(amadeusClientId, amadeusClientSecret, amadeusBaseUrl));
        console.log("🎯 Tour module: Amadeus provider enabled");
    }

    if (geoapifyApiKey) {
        providers.push(new GeoapifyToursProvider(geoapifyApiKey));
        console.log("🎯 Tour module: Geoapify provider enabled");
    }

    if (providers.length === 0) {
        console.warn(
            "⚠️  Tour module: No API keys configured — all providers will return empty results.\n" +
            "   Set at least one of: AMADEUS_CLIENT_ID+SECRET or GEOAPIFY_API_KEY"
        );
    }

    console.log(`🎯 Tour module: ${providers.length} provider(s) active`);

    const service = new TourService(providers);
    const controller = new TourController(service);
    const router = createTourRoutes(controller);

    return router;
}
