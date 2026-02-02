import { z } from 'zod';

// ===== META & ACTION TYPES =====
export const MetaItemSchema = z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string().optional(),
});

export const ActionItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    variant: z.enum(['primary', 'secondary', 'ghost', 'highlight']).optional(),
    icon: z.string().optional(),
});

// ===== MARKER & ROUTE TYPES (for MapBlock) =====
export const MapMarkerItemSchema = z.object({
    id: z.string(),
    label: z.string(),
    lat: z.number(),
    lng: z.number(),
    type: z.enum(['default', 'start', 'end', 'waypoint']).optional(),
});

export const MapRouteItemSchema = z.object({
    from: z.string(),
    to: z.string(),
    type: z.enum(['solid', 'dashed']).optional(),
});

// ===== TIMELINE ITEM TYPE =====
export const TimelineItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    time: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    status: z.enum(['completed', 'current', 'upcoming']).optional(),
    meta: z.array(MetaItemSchema).optional(),
});

// ===== LIST ITEM TYPE =====
export const ListItemSchema: z.ZodType<ListItem> = z.lazy(() =>
    z.object({
        id: z.string(),
        text: z.string(),
        icon: z.string().optional(),
        subItems: z.array(ListItemSchema).optional(),
    })
);

interface ListItem {
    id: string;
    text: string;
    icon?: string;
    subItems?: ListItem[];
}

// ===== BLOCK SCHEMAS =====

export const TitleBlockSchema = z.object({
    type: z.literal('title'),
    text: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
});

export const TextBlockSchema = z.object({
    type: z.literal('text'),
    content: z.string(),
    format: z.enum(['plain', 'markdown']).optional(),
});

export const CardBlockSchema = z.object({
    type: z.literal('card'),
    title: z.string(),
    subtitle: z.string().optional(),
    image: z.string().optional(),
    meta: z.array(MetaItemSchema).optional(),
    actions: z.array(ActionItemSchema).optional(),
    badge: z.string().optional(),
    badgeVariant: z.enum(['default', 'primary', 'success', 'warning', 'error']).optional(),
});

export const ListBlockSchema = z.object({
    type: z.literal('list'),
    items: z.array(ListItemSchema),
    ordered: z.boolean().optional(),
});

export const TimelineBlockSchema = z.object({
    type: z.literal('timeline'),
    title: z.string().optional(),
    items: z.array(TimelineItemSchema),
});

export const MapBlockSchema = z.object({
    type: z.literal('map'),
    markers: z.array(MapMarkerItemSchema),
    routes: z.array(MapRouteItemSchema).optional(),
    center: z
        .object({
            lat: z.number(),
            lng: z.number(),
        })
        .optional(),
    zoom: z.number().optional(),
});

export const AlertBlockSchema = z.object({
    type: z.literal('alert'),
    level: z.enum(['info', 'success', 'warning', 'error']),
    text: z.string(),
    title: z.string().optional(),
    dismissible: z.boolean().optional(),
});

export const ImageBlockSchema = z.object({
    type: z.literal('image'),
    src: z.string(),
    alt: z.string().optional(),
    caption: z.string().optional(),
    layout: z.enum(['full', 'inline', 'thumbnail']).optional(),
});

export const ActionsBlockSchema = z.object({
    type: z.literal('actions'),
    items: z.array(ActionItemSchema),
    layout: z.enum(['horizontal', 'vertical', 'wrap']).optional(),
});

export const DividerBlockSchema = z.object({
    type: z.literal('divider'),
    spacing: z.enum(['sm', 'md', 'lg']).optional(),
});

// ===== FLIGHT ITEM TYPE =====
export const FlightItemSchema = z.object({
    id: z.string(),
    airline: z.string(),
    airlineLogo: z.string().optional(),
    flightNumber: z.string(),
    departure: z.string(),
    arrival: z.string(),
    departureAirport: z.string(),
    arrivalAirport: z.string(),
    departureCity: z.string().optional(),
    arrivalCity: z.string().optional(),
    duration: z.string(),
    price: z.string(),
    stops: z.number(),
    aircraft: z.string().optional(),
    class: z.string().optional(),
    route: z.string().optional(),
    gate: z.string().optional(),
    seat: z.string().optional(),
});

export const FlightCarouselBlockSchema = z.object({
    type: z.literal('flight_carousel'),
    title: z.string().optional(),
    flights: z.array(FlightItemSchema),
});

// ===== ATTRACTION ITEM TYPE =====
export const AttractionItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    description: z.string().optional(),
    rating: z.number(),
    image: z.string().optional(),
    duration: z.string().optional(),
    price: z.string().optional(),
    lat: z.number(),
    lng: z.number(),
});

export const AttractionCarouselBlockSchema = z.object({
    type: z.literal('attraction_carousel'),
    title: z.string().optional(),
    destination: z.string(),
    attractions: z.array(AttractionItemSchema),
});

// ===== MAP INSTRUCTION TYPE =====
export const MapMarkerInstructionSchema = z.object({
    id: z.string(),
    title: z.string(),
    lat: z.number(),
    lng: z.number(),
    category: z.string(),
    image: z.string().optional(),
});

export const MapInstructionSchema = z.object({
    action: z.literal('zoom'),
    location: z.object({
        city: z.string(),
        lat: z.number(),
        lng: z.number(),
        zoom: z.number(),
    }),
    markers: z.array(MapMarkerInstructionSchema),
});

// ===== UNION TYPE =====
export const UIBlockSchema = z.discriminatedUnion('type', [
    TitleBlockSchema,
    TextBlockSchema,
    CardBlockSchema,
    ListBlockSchema,
    TimelineBlockSchema,
    MapBlockSchema,
    AlertBlockSchema,
    ImageBlockSchema,
    ActionsBlockSchema,
    DividerBlockSchema,
    FlightCarouselBlockSchema,
    AttractionCarouselBlockSchema,
]);

// ===== RESPONSE TYPE =====
export const UIResponseSchema = z.object({
    blocks: z.array(UIBlockSchema),
    map: MapInstructionSchema.optional(),
});

// ===== INFERRED TYPES =====
export type MetaItem = z.infer<typeof MetaItemSchema>;
export type ActionItem = z.infer<typeof ActionItemSchema>;
export type MapMarkerItem = z.infer<typeof MapMarkerItemSchema>;
export type MapRouteItem = z.infer<typeof MapRouteItemSchema>;
export type TimelineItem = z.infer<typeof TimelineItemSchema>;
export type TitleBlock = z.infer<typeof TitleBlockSchema>;
export type TextBlock = z.infer<typeof TextBlockSchema>;
export type CardBlock = z.infer<typeof CardBlockSchema>;
export type ListBlock = z.infer<typeof ListBlockSchema>;
export type TimelineBlock = z.infer<typeof TimelineBlockSchema>;
export type MapBlock = z.infer<typeof MapBlockSchema>;
export type AlertBlock = z.infer<typeof AlertBlockSchema>;
export type ImageBlock = z.infer<typeof ImageBlockSchema>;
export type ActionsBlock = z.infer<typeof ActionsBlockSchema>;
export type DividerBlock = z.infer<typeof DividerBlockSchema>;
export type AttractionItem = z.infer<typeof AttractionItemSchema>;
export type AttractionCarouselBlock = z.infer<typeof AttractionCarouselBlockSchema>;
export type MapMarkerInstruction = z.infer<typeof MapMarkerInstructionSchema>;
export type MapInstruction = z.infer<typeof MapInstructionSchema>;
export type UIBlock = z.infer<typeof UIBlockSchema>;
export type UIResponse = z.infer<typeof UIResponseSchema>;

// ===== ALLOWED BLOCK TYPES (for system prompt) =====
export const ALLOWED_BLOCK_TYPES = [
    'title',
    'text',
    'card',
    'list',
    'timeline',
    'map',
    'alert',
    'image',
    'actions',
    'divider',
    'flight_carousel',
    'attraction_carousel',
] as const;
