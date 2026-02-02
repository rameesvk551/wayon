// ===== UI SCHEMA TYPES =====
// Schema-driven UI block definitions for AI-native rendering
// This file defines all possible UI block types that the AI can render

// ===== META & ACTION TYPES =====
export interface MetaItem {
    label: string;
    value: string;
    icon?: string;
}

export interface ActionItem {
    id: string;
    label: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'highlight';
    icon?: string;
}

// ===== MARKER & ROUTE TYPES (for MapBlock) =====
export interface MapMarkerItem {
    id: string;
    label: string;
    lat: number;
    lng: number;
    type?: 'default' | 'start' | 'end' | 'waypoint';
}

export interface MapRouteItem {
    from: string; // marker id
    to: string;   // marker id
    type?: 'solid' | 'dashed';
}

// ===== TIMELINE ITEM TYPE =====
export interface TimelineItem {
    id: string;
    title: string;
    subtitle?: string;
    time?: string;
    description?: string;
    icon?: string;
    status?: 'completed' | 'current' | 'upcoming';
    meta?: MetaItem[];
}

// ===== LIST ITEM TYPE =====
export interface ListItem {
    id: string;
    text: string;
    icon?: string;
    subItems?: ListItem[];
}

// ===== BLOCK TYPES =====

export interface TitleBlock {
    type: 'title';
    text: string;
    level?: 1 | 2 | 3;
}

export interface TextBlock {
    type: 'text';
    content: string;
    format?: 'plain' | 'markdown';
}

export interface CardBlock {
    type: 'card';
    title: string;
    subtitle?: string;
    image?: string;
    meta?: MetaItem[];
    actions?: ActionItem[];
    badge?: string;
    badgeVariant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}

export interface ListBlock {
    type: 'list';
    items: ListItem[];
    ordered?: boolean;
}

export interface TimelineBlock {
    type: 'timeline';
    title?: string;
    items: TimelineItem[];
}

export interface MapBlock {
    type: 'map';
    markers: MapMarkerItem[];
    routes?: MapRouteItem[];
    center?: { lat: number; lng: number };
    zoom?: number;
}

export interface AlertBlock {
    type: 'alert';
    level: 'info' | 'success' | 'warning' | 'error';
    text: string;
    title?: string;
    dismissible?: boolean;
}

export interface ImageBlock {
    type: 'image';
    src: string;
    alt?: string;
    caption?: string;
    layout?: 'full' | 'inline' | 'thumbnail';
}

export interface ActionsBlock {
    type: 'actions';
    items: ActionItem[];
    layout?: 'horizontal' | 'vertical' | 'wrap';
}

export interface DividerBlock {
    type: 'divider';
    spacing?: 'sm' | 'md' | 'lg';
}

export interface WeatherBlock {
    type: 'weather';
    location: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly_cloudy';
    humidity: number;
    wind: string;
    uvIndex: string;
    feelsLike?: number;
}

export interface HotelItem {
    id: string;
    name: string;
    image: string;
    rating: number;
    reviewCount?: number;
    price: string;
    originalPrice?: string;
    location: string;
    amenities: string[];
    badge?: string;
    badgeType?: 'best_value' | 'luxury' | 'budget' | 'popular';
}

export interface HotelCarouselBlock {
    type: 'hotel_carousel';
    title?: string;
    hotels: HotelItem[];
}

export interface FlightItem {
    id: string;
    airline: string;
    airlineLogo?: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    departureAirport: string;
    arrivalAirport: string;
    departureCity?: string;
    arrivalCity?: string;
    duration: string;
    price: string;
    stops: number;
    aircraft?: string;
    class?: string;
    route?: string;
    gate?: string;
    seat?: string;
}

export interface FlightCarouselBlock {
    type: 'flight_carousel';
    title?: string;
    flights: FlightItem[];
}

// ===== ATTRACTION TYPES =====
export interface AttractionItem {
    id: string;
    name: string;
    category: string;
    description?: string;
    rating: number;
    image?: string;
    duration?: string;
    price?: string;
    lat: number;
    lng: number;
}

export interface AttractionCarouselBlock {
    type: 'attraction_carousel';
    title?: string;
    destination: string;
    attractions: AttractionItem[];
}

// ===== MAP INSTRUCTION TYPES =====
export interface MapMarkerInstruction {
    id: string;
    title: string;
    lat: number;
    lng: number;
    category: string;
    image?: string;
}

export interface MapInstruction {
    action: 'zoom';
    location: {
        city: string;
        lat: number;
        lng: number;
        zoom: number;
    };
    markers: MapMarkerInstruction[];
}

// ===== UNION TYPE =====
export type UIBlock =
    | TitleBlock
    | TextBlock
    | CardBlock
    | ListBlock
    | TimelineBlock
    | MapBlock
    | AlertBlock
    | ImageBlock
    | ActionsBlock
    | DividerBlock
    | WeatherBlock
    | HotelCarouselBlock
    | FlightCarouselBlock
    | AttractionCarouselBlock;

// ===== RESPONSE TYPE =====
export interface UIResponse {
    blocks: UIBlock[];
    map?: MapInstruction;
}

// ===== TYPE GUARDS =====
export const isTitleBlock = (block: UIBlock): block is TitleBlock => block.type === 'title';
export const isTextBlock = (block: UIBlock): block is TextBlock => block.type === 'text';
export const isCardBlock = (block: UIBlock): block is CardBlock => block.type === 'card';
export const isListBlock = (block: UIBlock): block is ListBlock => block.type === 'list';
export const isTimelineBlock = (block: UIBlock): block is TimelineBlock => block.type === 'timeline';
export const isMapBlock = (block: UIBlock): block is MapBlock => block.type === 'map';
export const isAlertBlock = (block: UIBlock): block is AlertBlock => block.type === 'alert';
export const isImageBlock = (block: UIBlock): block is ImageBlock => block.type === 'image';
export const isActionsBlock = (block: UIBlock): block is ActionsBlock => block.type === 'actions';
export const isDividerBlock = (block: UIBlock): block is DividerBlock => block.type === 'divider';
export const isWeatherBlock = (block: UIBlock): block is WeatherBlock => block.type === 'weather';
export const isHotelCarouselBlock = (block: UIBlock): block is HotelCarouselBlock => block.type === 'hotel_carousel';
export const isFlightCarouselBlock = (block: UIBlock): block is FlightCarouselBlock => block.type === 'flight_carousel';
export const isAttractionCarouselBlock = (block: UIBlock): block is AttractionCarouselBlock => block.type === 'attraction_carousel';
