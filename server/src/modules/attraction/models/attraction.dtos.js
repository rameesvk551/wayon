import { z } from "zod";

/* ── Request Validation Schemas ─────────────────────────────── */

export const attractionSearchSchema = z.object({
    city: z.string().optional(),
    country: z.string().optional(),
    types: z.union([z.string(), z.array(z.string())]).optional(),
    limit: z.string().optional(),
});

export const attractionIdSchema = z.object({
    id: z
        .string({ required_error: "Attraction ID is required" })
        .min(1, "Attraction ID is required"),
});
