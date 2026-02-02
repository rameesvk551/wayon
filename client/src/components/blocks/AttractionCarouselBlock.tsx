import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin } from 'lucide-react';
import type { AttractionCarouselBlock as AttractionCarouselBlockType, AttractionItem } from '../../types/ui-schema';
import { useMapContext } from '../../store/MapContext';

type AttractionCarouselBlockProps = Omit<AttractionCarouselBlockType, 'type'> & {
    onAttractionClick?: (attraction: AttractionItem) => void;
};

const AttractionCard: React.FC<{
    attraction: AttractionItem;
    isHighlighted: boolean;
    onClick: () => void;
}> = ({ attraction, isHighlighted, onClick }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Scroll into view when highlighted
    useEffect(() => {
        if (isHighlighted && cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [isHighlighted]);

    return (
        <motion.div
            ref={cardRef}
            id={`attraction-card-${attraction.id}`}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                rounded-2xl overflow-hidden
                bg-white
                border-2 transition-all duration-300
                cursor-pointer
                shadow-md hover:shadow-xl
                ${isHighlighted
                    ? 'border-[var(--color-primary)] ring-4 ring-[var(--color-primary-light)]'
                    : 'border-[var(--color-border)]'
                }
            `}
        >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={attraction.image || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400'}
                    alt={attraction.name}
                    className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <span className="
                        px-2.5 py-1 
                        bg-white/90 backdrop-blur-sm
                        text-xs font-semibold
                        text-[var(--color-text-secondary)]
                        rounded-full
                    ">
                        {attraction.category}
                    </span>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center gap-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-semibold">
                        {attraction.rating.toFixed(1)}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="
                    text-base font-bold
                    text-[var(--color-text-primary)]
                    mb-2 line-clamp-1
                ">
                    {attraction.name}
                </h3>

                {attraction.description && (
                    <p className="
                        text-sm text-[var(--color-text-muted)]
                        mb-3 line-clamp-2
                    ">
                        {attraction.description}
                    </p>
                )}

                <div className="flex items-center justify-between">
                    {/* Duration */}
                    {attraction.duration && (
                        <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                            <Clock size={14} />
                            <span className="text-xs">{attraction.duration}</span>
                        </div>
                    )}

                    {/* Price */}
                    {attraction.price && (
                        <span className="
                            text-xs font-medium
                            text-[var(--color-primary)]
                            bg-[var(--color-primary-light)]
                            px-2 py-1 rounded-full
                        ">
                            {attraction.price}
                        </span>
                    )}
                </div>

                {/* View on map indicator */}
                <div className="
                    mt-3 pt-3 border-t border-[var(--color-border-light)]
                    flex items-center gap-1.5
                    text-xs text-[var(--color-primary)] font-medium
                ">
                    <MapPin size={12} />
                    <span>View on map</span>
                </div>
            </div>
        </motion.div>
    );
};

export const AttractionCarouselBlock: React.FC<AttractionCarouselBlockProps> = ({
    title,
    attractions,
    onAttractionClick,
}) => {
    const { highlightedAttractionId, selectAttraction } = useMapContext();

    const handleAttractionClick = (attraction: AttractionItem) => {
        selectAttraction(attraction.id);
        onAttractionClick?.(attraction);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Header */}
            {title && (
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-4">
                    {title}
                </h2>
            )}

            {/* 3-column grid */}
            <div className="grid grid-cols-3 gap-3">
                {attractions.map((attraction) => (
                    <AttractionCard
                        key={attraction.id}
                        attraction={attraction}
                        isHighlighted={highlightedAttractionId === attraction.id}
                        onClick={() => handleAttractionClick(attraction)}
                    />
                ))}
            </div>
        </motion.div>
    );
};
