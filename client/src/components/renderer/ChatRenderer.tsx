import React from 'react';
import type { UIBlock, UIResponse, AttractionItem } from '../../types/ui-schema';
import {
    TitleBlock,
    TextBlock,
    CardBlock,
    ListBlock,
    TimelineBlock,
    ImageBlock,
    MapBlock,
    AlertBlock,
    ActionsBlock,
    DividerBlock,
    WeatherBlock,
    HotelCarouselBlock,
    FlightCarouselBlock,
    AttractionCarouselBlock
} from '../blocks';

interface ChatRendererProps {
    response: UIResponse;
    onAction?: (actionId: string) => void;
    onAttractionsSubmit?: (attractions: AttractionItem[]) => void;
}

interface BlockRendererProps {
    block: UIBlock;
    onAction?: (actionId: string) => void;
    onAttractionsSubmit?: (attractions: AttractionItem[]) => void;
}

type BlockRendererFn = (
    block: UIBlock,
    onAction?: (actionId: string) => void,
    onAttractionsSubmit?: (attractions: AttractionItem[]) => void
) => React.ReactNode;

const blockRenderers: Record<UIBlock['type'], BlockRendererFn> = {
    title: (block) => { const b = block as any; return <TitleBlock text={b.text} level={b.level} />; },
    text: (block) => { const b = block as any; return <TextBlock content={b.content} format={b.format} />; },
    card: (block) => {
        const b = block as any;
        return (
            <CardBlock
                title={b.title}
                subtitle={b.subtitle}
                image={b.image}
                meta={b.meta}
                actions={b.actions}
                badge={b.badge}
                badgeVariant={b.badgeVariant}
            />
        );
    },
    list: (block) => { const b = block as any; return <ListBlock items={b.items} ordered={b.ordered} />; },
    timeline: (block) => { const b = block as any; return <TimelineBlock title={b.title} items={b.items} />; },
    image: (block) => {
        const b = block as any;
        return (
            <ImageBlock
                src={b.src}
                alt={b.alt}
                caption={b.caption}
                layout={b.layout}
            />
        );
    },
    map: (block) => {
        const b = block as any;
        return (
            <MapBlock
                markers={b.markers}
                routes={b.routes}
                center={b.center}
                zoom={b.zoom}
            />
        );
    },
    alert: (block) => {
        const b = block as any;
        return (
            <AlertBlock
                level={b.level}
                text={b.text}
                title={b.title}
                dismissible={b.dismissible}
            />
        );
    },
    actions: (block, onAction) => {
        const b = block as any;
        return (
            <ActionsBlock
                items={b.items}
                layout={b.layout}
                onAction={onAction}
            />
        );
    },
    divider: (block) => { const b = block as any; return <DividerBlock spacing={b.spacing} />; },
    weather: (block) => {
        const b = block as any;
        return (
            <WeatherBlock
                location={b.location}
                temperature={b.temperature}
                condition={b.condition}
                humidity={b.humidity}
                wind={b.wind}
                uvIndex={b.uvIndex}
                feelsLike={b.feelsLike}
            />
        );
    },
    hotel_carousel: (block, onAction) => {
        const b = block as any;
        return (
            <HotelCarouselBlock
                title={b.title}
                hotels={b.hotels}
                onHotelClick={(id: string) => onAction?.(`hotel-view-${id}`)}
                onBookClick={(id: string) => onAction?.(`hotel-book-${id}`)}
            />
        );
    },
    flight_carousel: (block, onAction) => {
        const b = block as any;
        return (
            <FlightCarouselBlock
                title={b.title}
                flights={b.flights}
                onFlightClick={(id: string) => onAction?.(`flight-view-${id}`)}
                onBookClick={(id: string) => onAction?.(`flight-book-${id}`)}
            />
        );
    },
    attraction_carousel: (block, onAction, onAttractionsSubmit) => {
        const b = block as any;
        return (
            <AttractionCarouselBlock
                title={b.title}
                destination={b.destination}
                attractions={b.attractions}
                onAttractionClick={(attr: any) => onAction?.(`attraction-view-${attr.id}`)}
                onBuildItinerary={onAttractionsSubmit}
            />
        );
    },
    collect_input: () => null
};

/**
 * Renders a single UI block based on its type.
 * Gracefully ignores unknown block types.
 */
const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onAction, onAttractionsSubmit }) => {
    const renderer = blockRenderers[block.type];
    if (!renderer) {
        console.warn(`Unknown block type: ${(block as { type: string }).type}`);
        return (
            <AlertBlock
                level="warning"
                text={`Unsupported block type: ${(block as { type: string }).type}`}
            />
        );
    }
    return <>{renderer(block, onAction, onAttractionsSubmit)}</>;
};

/**
 * ChatRenderer - Central component for rendering AI responses.
 * 
 * This component accepts a UIResponse containing an array of blocks
 * and renders each block using the appropriate component.
 * 
 * The renderer is completely domain-agnostic - it has no knowledge
 * of travel, flights, hotels, or any other business domain.
 * 
 * @example
 * ```tsx
 * <ChatRenderer 
 *   response={aiResponse} 
 *   onAction={(id) => handleAction(id)} 
 * />
 * ```
 */
export const ChatRenderer: React.FC<ChatRendererProps> = ({ response, onAction, onAttractionsSubmit }) => {
    if (!response.blocks || response.blocks.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {response.blocks.map((block, index) => (
                <BlockRenderer
                    key={`block-${index}-${block.type}`}
                    block={block}
                    onAction={onAction}
                    onAttractionsSubmit={onAttractionsSubmit}
                />
            ))}
        </div>
    );
};
