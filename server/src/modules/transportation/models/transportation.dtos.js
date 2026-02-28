import { z } from "zod";

/* ── Request Validation Schemas ─────────────────────────────── */

export const multiModalRouteSchema = z.object({
    origin: z.object({
        name: z.string().optional().default("Origin"),
        lat: z.number(),
        lng: z.number(),
    }),
    destination: z.object({
        name: z.string().optional().default("Destination"),
        lat: z.number(),
        lng: z.number(),
    }),
    departureTime: z.string().optional(),
    preferences: z
        .object({
            modes: z.array(z.string()).optional(),
            maxWalkDistance: z.number().optional(),
            maxTransfers: z.number().optional(),
            budget: z.enum(["budget", "balanced", "premium"]).optional(),
        })
        .optional(),
});

export const nearbyStopsSchema = z.object({
    lat: z
        .string({ required_error: "lat is required" })
        .refine((v) => !isNaN(parseFloat(v)), "lat must be a number"),
    lng: z
        .string({ required_error: "lng is required" })
        .refine((v) => !isNaN(parseFloat(v)), "lng must be a number"),
    radius: z.string().optional(),
});
