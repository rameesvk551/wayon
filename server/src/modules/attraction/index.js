import { GooglePlacesProvider } from "./helpers/google-places.provider.js";
import { FallbackAttractionsProvider } from "./helpers/fallback-attractions.provider.js";
import { AttractionService } from "./services/attraction.service.js";
import { AttractionController } from "./controller/attraction.controller.js";
import { createAttractionRoutes } from "./routes/attraction.routes.js";

/**
 * Bootstraps the entire Attraction module and returns a ready-to-mount Express Router.
 *
 * Composition:  Providers → Service → Controller → Routes
 *
 * @returns {import('express').Router}
 */
export default function createAttractionModule() {
    const googlePlacesApiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || "";
    const fallbackEnabled = (process.env.ENABLE_FALLBACK_PROVIDER || "false").toLowerCase() === "true";
    const textSearchTimeout = parseInt(process.env.GOOGLE_PLACES_TIMEOUT || "10000", 10);
    const placeDetailsTimeout = parseInt(process.env.GOOGLE_PLACE_DETAILS_TIMEOUT || "5000", 10);

    const providers = [];

    if (googlePlacesApiKey && googlePlacesApiKey !== "your_google_places_api_key_here") {
        providers.push(
            new GooglePlacesProvider({
                apiKey: googlePlacesApiKey,
                textSearchTimeoutMs: textSearchTimeout,
                placeDetailsTimeoutMs: placeDetailsTimeout,
            })
        );
        console.log("🏛️  Attraction module: Google Places provider enabled");
    }

    if (fallbackEnabled) {
        providers.push(new FallbackAttractionsProvider(true));
        console.log("🏛️  Attraction module: Fallback provider enabled");
    }

    if (providers.length === 0) {
        console.warn(
            "⚠️  Attraction module: No providers configured — all queries will return empty results.\n" +
            "   Set GOOGLE_PLACES_API_KEY or enable the fallback provider"
        );
    }

    console.log(`🏛️  Attraction module: ${providers.length} provider(s) active`);

    const service = new AttractionService(providers);
    const controller = new AttractionController(service);
    const router = createAttractionRoutes(controller);

    return router;
}
