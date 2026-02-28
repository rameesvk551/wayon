import { z } from "zod";

/* ── Request Validation Schemas ─────────────────────────────── */

export const tourSearchSchema = z.object({
    latitude: z
        .string({ required_error: "latitude is required" })
        .refine((v) => !isNaN(parseFloat(v)), "latitude must be a valid number"),
    longitude: z
        .string({ required_error: "longitude is required" })
        .refine((v) => !isNaN(parseFloat(v)), "longitude must be a valid number"),
    radius: z.string().optional(),
    category: z.string().optional(),
    keyword: z.string().optional(),
    limit: z.string().optional(),
});

export const tourIdSchema = z.object({
    id: z
        .string({ required_error: "Tour ID is required" })
        .min(1, "Tour ID is required"),
});
