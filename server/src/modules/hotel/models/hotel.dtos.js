import { z } from "zod";

/* ── Request Validation Schemas ─────────────────────────────── */

export const hotelSearchSchema = z.object({
    destination: z.string().optional(),
    location: z.string().optional(),
    checkIn: z.string().optional(),
    checkin: z.string().optional(),
    checkOut: z.string().optional(),
    checkout: z.string().optional(),
    guests: z.string({ required_error: "guests is required" }),
    rooms: z.string().optional(),
    limit: z.string().optional(),
    cursor: z.string().optional(),
});

export const hotelLegacySearchSchema = z.object({
    city: z
        .string({ required_error: "city is required" })
        .min(1, "city is required"),
    limit: z.string().optional(),
});

export const hotelIdSchema = z.object({
    id: z
        .string({ required_error: "Hotel ID is required" })
        .min(1, "Hotel ID is required"),
});
