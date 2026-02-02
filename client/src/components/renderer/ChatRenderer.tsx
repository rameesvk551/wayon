import React from 'react';
import type { UIBlock, UIResponse } from '../../types/ui-schema';
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
    DividerBlock
} from '../blocks';

interface ChatRendererProps {
    response: UIResponse;
    onAction?: (actionId: string) => void;
}

interface BlockRendererProps {
    block: UIBlock;
    onAction?: (actionId: string) => void;
}

/**
 * Renders a single UI block based on its type.
 * Gracefully ignores unknown block types.
 */
const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onAction }) => {
    switch (block.type) {
        case 'title':
            return <TitleBlock text={block.text} level={block.level} />;

        case 'text':
            return <TextBlock content={block.content} format={block.format} />;

        case 'card':
            return (
                <CardBlock
                    title={block.title}
                    subtitle={block.subtitle}
                    image={block.image}
                    meta={block.meta}
                    actions={block.actions}
                    badge={block.badge}
                    badgeVariant={block.badgeVariant}
                />
            );

        case 'list':
            return <ListBlock items={block.items} ordered={block.ordered} />;

        case 'timeline':
            return <TimelineBlock title={block.title} items={block.items} />;

        case 'image':
            return (
                <ImageBlock
                    src={block.src}
                    alt={block.alt}
                    caption={block.caption}
                    layout={block.layout}
                />
            );

        case 'map':
            return (
                <MapBlock
                    markers={block.markers}
                    routes={block.routes}
                    center={block.center}
                    zoom={block.zoom}
                />
            );

        case 'alert':
            return (
                <AlertBlock
                    level={block.level}
                    text={block.text}
                    title={block.title}
                    dismissible={block.dismissible}
                />
            );

        case 'actions':
            return (
                <ActionsBlock
                    items={block.items}
                    layout={block.layout}
                    onAction={onAction}
                />
            );

        case 'divider':
            return <DividerBlock spacing={block.spacing} />;

        default:
            // Gracefully ignore unknown block types
            console.warn(`Unknown block type: ${(block as { type: string }).type}`);
            return null;
    }
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
export const ChatRenderer: React.FC<ChatRendererProps> = ({ response, onAction }) => {
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
                />
            ))}
        </div>
    );
};
