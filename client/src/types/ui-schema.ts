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
    | DividerBlock;

// ===== RESPONSE TYPE =====
export interface UIResponse {
    blocks: UIBlock[];
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
