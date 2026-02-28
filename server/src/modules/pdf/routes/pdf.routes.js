import { Router } from "express";

/**
 * Registers all PDF routes on an Express Router.
 * @param {import('../controller/pdf.controller.js').PdfController} controller
 * @returns {Router}
 */
export function createPdfRoutes(controller) {
    const router = Router();

    router.post("/generate-itinerary-pdf", controller.generatePdf);
    router.post("/generate-interactive-itinerary", controller.generateInteractive);
    router.get("/health", controller.healthCheck);

    return router;
}
