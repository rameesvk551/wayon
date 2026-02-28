import { z } from "zod";

const latLngSchema = z.object({ lat: z.number(), lng: z.number() });

const mapMarkerSchema = z.object({
    id: z.string(),
    label: z.string().min(1),
    lat: z.number(),
    lng: z.number(),
    category: z.string().optional(),
    title: z.string(),
    subtitle: z.string().optional(),
    dayNumber: z.number().int().positive().optional(),
});

const mapRouteSchema = z.object({
    coordinates: z.array(z.tuple([z.number(), z.number()])).min(2),
});

const mapClusterSchema = z.object({
    id: z.string(),
    name: z.string().min(1),
    dayNumber: z.number().int().positive().optional(),
    color: z.string().optional(),
    markerIds: z.array(z.string()).optional(),
    center: latLngSchema.optional(),
    stopCount: z.number().int().nonnegative().optional(),
});

const activitySchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    location: z.string().optional(),
    category: z.string().optional(),
    imageUrl: z.string().url().optional(),
    price: z.number().optional(),
});

const transportSchema = z.object({
    type: z.string(),
    from: z.string(),
    to: z.string(),
    departureTime: z.string().optional(),
    arrivalTime: z.string().optional(),
    duration: z.string().optional(),
    price: z.number().optional(),
    carrier: z.string().optional(),
});

const hotelSchema = z.object({
    name: z.string(),
    imageUrl: z.string().url().optional(),
    rating: z.number().optional(),
    pricePerNight: z.number().optional(),
});

const daySchema = z.object({
    dayNumber: z.number(),
    date: z.string(),
    city: z.string(),
    heroImageUrl: z.string().url().optional(),
    transport: transportSchema.optional(),
    activities: z.array(activitySchema).default([]),
    hotel: hotelSchema.optional(),
});

export const ItineraryPdfRequestSchema = z.object({
    trip: z.object({
        title: z.string(),
        destination: z.string(),
        dateRange: z.object({ start: z.string(), end: z.string() }),
        totalDays: z.number(),
    }),
    branding: z.object({
        logoUrl: z.string().url().optional(),
        primaryColor: z.string().optional(),
        accentColor: z.string().optional(),
    }).optional(),
    map: z.object({
        style: z.string().default("infographic"),
        center: latLngSchema.default({ lat: 0, lng: 0 }),
        zoom: z.number().default(11),
        markers: z.array(mapMarkerSchema).default([]),
        clusters: z.array(mapClusterSchema).default([]),
        route: mapRouteSchema.optional(),
    }).default({
        style: "infographic",
        center: { lat: 0, lng: 0 },
        zoom: 11,
        markers: [],
        clusters: [],
    }),
    days: z.array(daySchema).min(1),
    output: z.object({
        format: z.enum(["A4", "Letter"]),
        includeInfographicCover: z.boolean(),
        enableMapVisualizations: z.boolean().optional().default(true),
    }),
});
