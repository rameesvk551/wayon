/**
 * Express controller for PDF endpoints.
 * Converted from pdf-service index.ts inline Fastify handlers.
 */

import { ItineraryPdfRequestSchema } from "../models/itinerary-pdf.schema.js";
import { generateItineraryPdf, generateInteractiveHtml } from "../services/pdf-generator.service.js";

export class PdfController {
    constructor() {
        this.generatePdf = this.generatePdf.bind(this);
        this.generateInteractive = this.generateInteractive.bind(this);
        this.healthCheck = this.healthCheck.bind(this);
    }

    /** POST /pdf/generate-itinerary-pdf */
    async generatePdf(req, res, next) {
        const startMs = Date.now();

        console.log("📥 PDF generation request received", {
            destination: req.body?.trip?.destination,
            totalDays: req.body?.trip?.totalDays,
            dayCount: req.body?.days?.length,
            markerCount: req.body?.map?.markers?.length || 0,
        });

        const validation = ItineraryPdfRequestSchema.safeParse(req.body);
        if (!validation.success) {
            const errors = validation.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            return res.status(400).json({ error: "Invalid request", details: errors });
        }

        try {
            const { pdfBuffer: rawPdf, pageCount } = await generateItineraryPdf(validation.data);
            const pdfBuffer = Buffer.isBuffer(rawPdf) ? rawPdf : Buffer.from(rawPdf);

            const accept = req.headers.accept || "";
            const wantsJson = accept.includes("application/json");

            if (wantsJson) {
                const base64 = pdfBuffer.toString("base64");
                return res.json({ pdfBytesBase64: base64, pdfUrl: undefined, pageCount });
            }

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", 'attachment; filename="trip-itinerary.pdf"');
            return res.send(pdfBuffer);
        } catch (error) {
            console.error("💥 PDF generation failed", error?.message);
            return res.status(500).json({
                error: "Failed to generate PDF",
                message: error?.message || "Unknown error",
            });
        }
    }

    /** POST /pdf/generate-interactive-itinerary */
    async generateInteractive(req, res, next) {
        const startMs = Date.now();

        const validation = ItineraryPdfRequestSchema.safeParse(req.body);
        if (!validation.success) {
            const errors = validation.error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            return res.status(400).json({ error: "Invalid request", details: errors });
        }

        try {
            const html = await generateInteractiveHtml(validation.data);

            const accept = req.headers.accept || "";
            if (accept.includes("application/json")) {
                return res.json({ html, generatedAt: new Date().toISOString() });
            }

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            return res.send(html);
        } catch (error) {
            console.error("💥 Interactive HTML generation failed", error?.message);
            return res.status(500).json({
                error: "Failed to generate interactive itinerary",
                message: error?.message || "Unknown error",
            });
        }
    }

    /** GET /pdf/health */
    healthCheck(_req, res) {
        return res.json({ status: "ok", service: "pdf-module" });
    }
}
