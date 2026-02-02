import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Star, Wifi, UtensilsCrossed, MapPin, ChevronLeft, ChevronRight, Eye, Heart } from 'lucide-react';

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

interface HotelCarouselBlockProps {
    title?: string;
    hotels: HotelItem[];
    onHotelClick?: (hotelId: string) => void;
    onBookClick?: (hotelId: string) => void;
}

const badgeStyles = {
    best_value: 'bg-emerald-500 text-white',
    luxury: 'bg-amber-500 text-white',
    budget: 'bg-blue-500 text-white',
    popular: 'bg-rose-500 text-white',
};

const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi size={12} />,
    breakfast: <UtensilsCrossed size={12} />,
};

export const HotelCarouselBlock: React.FC<HotelCarouselBlockProps> = ({
    title,
    hotels,
    onHotelClick,
    onBookClick
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 300;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            {title && (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('left')}
                            className="p-1.5 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-sm transition-all"
                        >
                            <ChevronLeft size={18} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('right')}
                            className="p-1.5 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-sm transition-all"
                        >
                            <ChevronRight size={18} />
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1"
            >
                {hotels.map((hotel, index) => (
                    <motion.div
                        key={hotel.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="
                            flex-shrink-0 w-[280px]
                            bg-white
                            rounded-2xl
                            border border-[var(--color-border)]
                            overflow-hidden
                            shadow-sm hover:shadow-lg
                            transition-all duration-300
                            cursor-pointer
                            group
                        "
                        onClick={() => onHotelClick?.(hotel.id)}
                    >
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden">
                            <img
                                src={hotel.image}
                                alt={hotel.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                            {/* Badge */}
                            {hotel.badge && hotel.badgeType && (
                                <span className={`
                                    absolute top-3 left-3
                                    px-2.5 py-1
                                    text-xs font-semibold
                                    rounded-full
                                    ${badgeStyles[hotel.badgeType]}
                                `}>
                                    {hotel.badge}
                                </span>
                            )}

                            {/* Save Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); }}
                                className="
                                    absolute top-3 right-3
                                    p-2 rounded-full
                                    bg-white/90 backdrop-blur-sm
                                    text-[var(--color-text-muted)]
                                    hover:text-rose-500
                                    shadow-sm
                                    transition-colors
                                "
                            >
                                <Heart size={16} />
                            </motion.button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {/* Name & Rating */}
                            <div className="flex items-start justify-between mb-2">
                                <h4 className="text-base font-semibold text-[var(--color-text-primary)] line-clamp-1">
                                    {hotel.name}
                                </h4>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    <span className="text-sm font-medium text-[var(--color-text-primary)]">
                                        {hotel.rating}
                                    </span>
                                    {hotel.reviewCount && (
                                        <span className="text-xs text-[var(--color-text-muted)]">
                                            ({hotel.reviewCount})
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 mb-3">
                                <MapPin size={12} className="text-[var(--color-text-muted)]" />
                                <span className="text-xs text-[var(--color-text-muted)] line-clamp-1">
                                    {hotel.location}
                                </span>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {hotel.amenities.slice(0, 3).map((amenity, i) => (
                                    <span
                                        key={i}
                                        className="
                                            flex items-center gap-1
                                            px-2 py-1
                                            text-xs
                                            bg-[var(--color-bg-tertiary)]
                                            text-[var(--color-text-secondary)]
                                            rounded-md
                                        "
                                    >
                                        {amenityIcons[amenity.toLowerCase()] || null}
                                        {amenity}
                                    </span>
                                ))}
                            </div>

                            {/* Price & CTA */}
                            <div className="flex items-center justify-between">
                                <div>
                                    {hotel.originalPrice && (
                                        <span className="text-xs text-[var(--color-text-muted)] line-through mr-1">
                                            {hotel.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-lg font-bold text-[var(--color-primary)]">
                                        {hotel.price}
                                    </span>
                                    <span className="text-xs text-[var(--color-text-muted)]"> / night</span>
                                </div>
                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => { e.stopPropagation(); onHotelClick?.(hotel.id); }}
                                        className="
                                            px-3 py-1.5
                                            text-xs font-medium
                                            text-[var(--color-primary)]
                                            bg-[var(--color-primary-subtle)]
                                            rounded-lg
                                            hover:bg-[var(--color-primary-light)]
                                            transition-colors
                                        "
                                    >
                                        <Eye size={14} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => { e.stopPropagation(); onBookClick?.(hotel.id); }}
                                        className="
                                            px-4 py-1.5
                                            text-xs font-semibold
                                            text-white
                                            bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
                                            rounded-lg
                                            shadow-sm hover:shadow-md
                                            transition-all
                                        "
                                    >
                                        Book
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
