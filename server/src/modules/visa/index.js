import { RapidApiVisaProvider } from "./helpers/rapidapi.provider.js";
import { CachedVisaRepository } from "./repository/visa.repository.js";
import { InMemoryVisaRepository } from "./repository/inmemory.repository.js";
import { VisaService } from "./services/visa.service.js";
import { VisaController } from "./controller/visa.controller.js";
import { createVisaRoutes } from "./routes/visa.routes.js";

/**
 * Bootstraps the entire Visa module and returns a ready-to-mount Express Router.
 *
 * Composition:  Provider → Repository → Service → Controller → Routes
 *
 * If RAPIDAPI_KEY is not set, falls back to InMemoryVisaRepository.
 *
 * @returns {import('express').Router}
 */
export default function createVisaModule() {
    const rapidApiKey = process.env.RAPIDAPI_KEY || "";
    const rapidApiHost =
        process.env.RAPIDAPI_HOST || "visa-requirement.p.rapidapi.com";

    let repository;

    if (rapidApiKey) {
        const provider = new RapidApiVisaProvider(rapidApiKey, rapidApiHost);
        repository = new CachedVisaRepository(provider);
        console.log("🛂 Visa module: using RapidAPI provider");
    } else {
        repository = new InMemoryVisaRepository();
        console.warn(
            "⚠️  Visa module: RAPIDAPI_KEY not set — using in-memory fallback"
        );
    }

    const service = new VisaService(repository);
    const controller = new VisaController(service);
    const router = createVisaRoutes(controller);

    return router;
}
