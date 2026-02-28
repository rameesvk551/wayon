import { PackingAssistantService } from "./services/packing-assistant.service.js";
import { PackingAssistantController } from "./controller/packing-assistant.controller.js";
import { createPackingAssistantRoutes } from "./routes/packing-assistant.routes.js";

/**
 * Bootstraps the Packing Assistant module and returns a ready-to-mount Express Router.
 *
 * Composition:  Service → Controller → Routes
 *
 * @returns {import('express').Router}
 */
export default function createPackingAssistantModule() {
    const editorBaseUrl =
        process.env.ITINERARY_EDITOR_SERVICE || "http://localhost:4015";

    console.log(`🎒 Packing Assistant module: proxying to ${editorBaseUrl}`);

    const service = new PackingAssistantService(editorBaseUrl);
    const controller = new PackingAssistantController(service);
    const router = createPackingAssistantRoutes(controller);

    return router;
}
