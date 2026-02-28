import { z } from "zod";

/* ── Request Validation Schemas ─────────────────────────────── */

export const getVisaSchema = z.object({
    from: z
        .string({ required_error: "from is required" })
        .min(2, "from must be a 2-letter country code")
        .max(3)
        .transform((v) => v.toUpperCase()),
    to: z
        .string({ required_error: "to is required" })
        .min(2, "to must be a 2-letter country code")
        .max(3)
        .transform((v) => v.toUpperCase()),
});

export const getBulkVisaSchema = z.object({
    from: z
        .string({ required_error: "from is required" })
        .min(2)
        .max(3)
        .transform((v) => v.toUpperCase()),
    destinations: z
        .array(z.string().min(2).max(3).transform((v) => v.toUpperCase()))
        .min(1, "destinations must have at least 1 entry")
        .max(50, "Maximum 50 destinations per request"),
});

export const visaMapSchema = z.object({
    passport: z
        .string({ required_error: "passport is required" })
        .min(2)
        .max(3)
        .transform((v) => v.toUpperCase()),
});
