import { PdfController } from "./controller/pdf.controller.js";
import { createPdfRoutes } from "./routes/pdf.routes.js";

/**
 * Bootstraps the PDF module and returns a ready-to-mount Express Router.
 *
 * Composition:  Controller → Routes
 *
 * @returns {import('express').Router}
 */
export default function createPdfModule() {
    console.log("📄  PDF module: initializing");

    const controller = new PdfController();
    const router = createPdfRoutes(controller);

    console.log("📄  PDF module: ready");

    return router;
}
