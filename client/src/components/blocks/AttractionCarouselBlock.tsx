import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, X, Ticket, Info, CheckCircle2 } from 'lucide-react';
import type { AttractionCarouselBlock as AttractionCarouselBlockType, AttractionItem } from '../../types/ui-schema';
import { useMapContext } from '../../store/MapContext';

type AttractionCarouselBlockProps = Omit<AttractionCarouselBlockType, 'type'> & {
    onAttractionClick?: (attraction: AttractionItem) => void;
    onBuildItinerary?: (attractions: AttractionItem[]) => void;
};

const AttractionCard: React.FC<{
    attraction: AttractionItem;
    isHighlighted: boolean;
    isSelected: boolean;
    onClick: () => void;
    onToggleSelect: () => void;
}> = ({ attraction, isHighlighted, isSelected, onClick, onToggleSelect }) => {
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
            style={{ borderRadius: '5%' }}
            className={`
                overflow-hidden
                bg-white p-1.5
                transition-all duration-300
                cursor-pointer
                ${isSelected
                    ? 'border-2 border-[var(--color-primary)] shadow-[0_0_0_3px_var(--color-primary-light),0_4px_16px_rgba(13,148,136,0.18)] bg-gradient-to-br from-[rgba(13,148,136,0.03)] to-white'
                    : 'border border-black/[0.08] shadow-sm hover:shadow-xl'
                }
                ${isHighlighted
                    ? 'ring-4 ring-[var(--color-primary-light)]'
                    : ''
                }
            `}
        >
            <button
                className={`
                    absolute top-3 right-3 z-10
                    h-9 w-9 rounded-full
                    flex items-center justify-center
                    transition-all duration-300
                    ${isSelected
                        ? 'bg-[var(--color-primary)] border-[2.5px] border-[var(--color-primary)] text-white scale-110 shadow-[0_2px_12px_rgba(13,148,136,0.5)]'
                        : 'bg-white border-[3px] border-gray-400 text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:scale-110'
                    }
                `}
                style={isSelected ? { animation: 'selectPop 0.3s cubic-bezier(0.34,1.56,0.64,1)' } : {}}
                onClick={(event) => {
                    event.stopPropagation();
                    onToggleSelect();
                }}
                aria-label={isSelected ? 'Remove from itinerary' : 'Add to itinerary'}
            >
                {isSelected ? <CheckCircle2 size={20} /> : <span className="block h-3.5 w-3.5 rounded-full" />}
            </button>
            {/* Image */}
            <div className="relative h-40 overflow-hidden" style={{ borderRadius: '4%' }}>
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

const AttractionDetailsModal: React.FC<{
    attraction: AttractionItem | null;
    isOpen: boolean;
    onClose: () => void;
}> = ({ attraction, isOpen, onClose }) => {
    if (!isOpen || !attraction) return null;

    const imageSrc = attraction.image || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="attraction-modal-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 24, stiffness: 320 }}
                className="attraction-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="attraction-modal-image">
                    <img src={imageSrc} alt={attraction.name} />
                    <div className="attraction-modal-image-overlay" />
                    <button className="attraction-modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                    <span className="attraction-modal-category">{attraction.category}</span>
                </div>

                <div className="attraction-modal-content">
                    <div className="attraction-modal-header">
                        <h2>{attraction.name}</h2>
                        <div className="attraction-modal-rating">
                            <Star size={18} className="fill-yellow-400 text-yellow-400" />
                            <span>{attraction.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    <p className="attraction-modal-desc">
                        {attraction.description || 'A must-see highlight packed with local charm and memorable views.'}
                    </p>

                    <div className="attraction-modal-info-grid">
                        <div className="attraction-modal-info-item">
                            <Clock size={18} />
                            <div>
                                <span className="label">Duration</span>
                                <span className="value">{attraction.duration || 'Flexible visit'}</span>
                            </div>
                        </div>
                        <div className="attraction-modal-info-item">
                            <Ticket size={18} />
                            <div>
                                <span className="label">Entry Fee</span>
                                <span className="value">{attraction.price || 'Free'}</span>
                            </div>
                        </div>
                        <div className="attraction-modal-info-item">
                            <MapPin size={18} />
                            <div>
                                <span className="label">Coordinates</span>
                                <span className="value">
                                    {attraction.lat.toFixed(4)}, {attraction.lng.toFixed(4)}
                                </span>
                            </div>
                        </div>
                        <div className="attraction-modal-info-item">
                            <Info size={18} />
                            <div>
                                <span className="label">Category</span>
                                <span className="value">{attraction.category}</span>
                            </div>
                        </div>
                    </div>

                    <div className="attraction-modal-actions">
                        <button className="attraction-modal-select-btn" onClick={onClose}>
                            <MapPin size={18} />
                            View on map
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export const AttractionCarouselBlock: React.FC<AttractionCarouselBlockProps> = ({
    title,
    attractions,
    onAttractionClick,
    onBuildItinerary,
}) => {
    const { highlightedAttractionId, selectAttraction } = useMapContext();
    const [activeAttraction, setActiveAttraction] = useState<AttractionItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>([]);

    const handleAttractionClick = (attraction: AttractionItem) => {
        selectAttraction(attraction.id);
        onAttractionClick?.(attraction);
        setActiveAttraction(attraction);
        setIsModalOpen(true);
    };

    const toggleSelection = (id: string) => {
        setSelectedAttractionIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setActiveAttraction(null);
    };

    const selectedAttractions = attractions.filter((attraction) => selectedAttractionIds.includes(attraction.id));

    return (
        <>
            {/* Attractions card container */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="attraction-carousel-container"
            >
                {/* Header */}
                {title && (
                    <div className="attraction-carousel-header">
                        <h2>{title}</h2>
                        {selectedAttractionIds.length > 0 && (
                            <span className="attraction-carousel-badge">
                                {selectedAttractionIds.length} selected
                            </span>
                        )}
                    </div>
                )}

                {/* Scrollable attractions grid */}
                <div className="attraction-carousel-scroll">
                    <div className="grid grid-cols-2 gap-3">
                        {attractions.map((attraction) => (
                            <AttractionCard
                                key={attraction.id}
                                attraction={attraction}
                                isHighlighted={highlightedAttractionId === attraction.id}
                                isSelected={selectedAttractionIds.includes(attraction.id)}
                                onClick={() => handleAttractionClick(attraction)}
                                onToggleSelect={() => toggleSelection(attraction.id)}
                            />
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Build itinerary — sticky bar flush above chat input */}
            {onBuildItinerary && (
                <div className="build-itinerary-sticky-bar">
                    <button
                        className={`build-itinerary-btn ${selectedAttractionIds.length > 0 ? 'active' : 'disabled'}`}
                        onClick={() => onBuildItinerary(selectedAttractions)}
                        disabled={selectedAttractionIds.length === 0}
                    >
                        {selectedAttractionIds.length > 0
                            ? `🗺️ Build itinerary with ${selectedAttractionIds.length} attraction${selectedAttractionIds.length > 1 ? 's' : ''}`
                            : 'Select attractions to build itinerary'}
                    </button>
                </div>
            )}

            <AttractionDetailsModal
                attraction={activeAttraction}
                isOpen={isModalOpen}
                onClose={handleModalClose}
            />
        </>
    );
};
