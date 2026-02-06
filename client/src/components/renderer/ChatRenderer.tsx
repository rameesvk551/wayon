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
    title: (block) => <TitleBlock text={block.text} level={block.level} />,
    text: (block) => <TextBlock content={block.content} format={block.format} />,
    card: (block) => (
        <CardBlock
            title={block.title}
            subtitle={block.subtitle}
            image={block.image}
            meta={block.meta}
            actions={block.actions}
            badge={block.badge}
            badgeVariant={block.badgeVariant}
        />
    ),
    list: (block) => <ListBlock items={block.items} ordered={block.ordered} />,
    timeline: (block) => <TimelineBlock title={block.title} items={block.items} />,
    image: (block) => (
        <ImageBlock
            src={block.src}
            alt={block.alt}
            caption={block.caption}
            layout={block.layout}
        />
    ),
    map: (block) => (
        <MapBlock
            markers={block.markers}
            routes={block.routes}
            center={block.center}
            zoom={block.zoom}
        />
    ),
    alert: (block) => (
        <AlertBlock
            level={block.level}
            text={block.text}
            title={block.title}
            dismissible={block.dismissible}
        />
    ),
    actions: (block, onAction) => (
        <ActionsBlock
            items={block.items}
            layout={block.layout}
            onAction={onAction}
        />
    ),
    divider: (block) => <DividerBlock spacing={block.spacing} />,
    weather: (block) => (
        <WeatherBlock
            location={block.location}
            temperature={block.temperature}
            condition={block.condition}
            humidity={block.humidity}
            wind={block.wind}
            uvIndex={block.uvIndex}
            feelsLike={block.feelsLike}
        />
    ),
    hotel_carousel: (block, onAction) => (
        <HotelCarouselBlock
            title={block.title}
            hotels={block.hotels}
            onHotelClick={(id) => onAction?.(`hotel-view-${id}`)}
            onBookClick={(id) => onAction?.(`hotel-book-${id}`)}
        />
    ),
    flight_carousel: (block, onAction) => (
        <FlightCarouselBlock
            title={block.title}
            flights={block.flights}
            onFlightClick={(id) => onAction?.(`flight-view-${id}`)}
            onBookClick={(id) => onAction?.(`flight-book-${id}`)}
        />
    ),
    attraction_carousel: (block, onAction, onAttractionsSubmit) => (
        <AttractionCarouselBlock
            title={block.title}
            destination={block.destination}
            attractions={block.attractions}
            onAttractionClick={(attr) => onAction?.(`attraction-view-${attr.id}`)}
            onBuildItinerary={onAttractionsSubmit}
        />
    ),
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
