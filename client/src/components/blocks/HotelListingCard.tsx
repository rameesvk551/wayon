import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart, Star, MapPin, Wifi, UtensilsCrossed, Waves, Car, Coffee,
    Dumbbell, Sparkles, ChevronRight, Award, TrendingUp, Palmtree,
    Bot, Navigation,
} from 'lucide-react';
import type { HotelListingItem } from '../../data/hotelListingData';

interface HotelListingCardProps {
    hotel: HotelListingItem;
    isWishlisted: boolean;
    onToggleWishlist: (id: string) => void;
    onViewDetails?: (id: string) => void;
    index?: number;
}

const amenityIcons: Record<string, React.ReactNode> = {
    'free wifi': <Wifi size={12} />,
    wifi: <Wifi size={12} />,
    pool: <Waves size={12} />,
    spa: <Sparkles size={12} />,
    breakfast: <UtensilsCrossed size={12} />,
    restaurant: <UtensilsCrossed size={12} />,
    gym: <Dumbbell size={12} />,
    parking: <Car size={12} />,
    cafe: <Coffee size={12} />,
    'free parking': <Car size={12} />,
    'beach access': <Palmtree size={12} />,
};

const badgeConfig: Record<string, { icon: React.ReactNode; gradient: string }> = {
    'Top Rated': { icon: <Award size={10} />, gradient: 'from-amber-500 to-orange-500' },
    'Best Value': { icon: <TrendingUp size={10} />, gradient: 'from-emerald-500 to-teal-500' },
    'Near Beach': { icon: <Palmtree size={10} />, gradient: 'from-cyan-500 to-blue-500' },
};

const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase();
    for (const [key, icon] of Object.entries(amenityIcons)) {
        if (lower.includes(key)) return icon;
    }
    return null;
};

export const HotelListingCard: React.FC<HotelListingCardProps> = ({
    hotel,
    isWishlisted,
    onToggleWishlist,
    onViewDetails,
    index = 0,
}) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentImage < hotel.images.length - 1) {
                setCurrentImage((p) => p + 1);
            } else if (diff < 0 && currentImage > 0) {
                setCurrentImage((p) => p - 1);
            }
        }
    };

    const handleImageError = (idx: number) => {
        setImgErrors((prev) => new Set(prev).add(idx));
    };

    const fallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop';
    const discount = hotel.originalPrice
        ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileTap={{ scale: 0.985 }}
            className="hotel-listing-card"
            onClick={() => onViewDetails?.(hotel.id)}
        >
            {/* === IMAGE CAROUSEL === */}
            <div
                className="hotel-listing-carousel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentImage}
                        src={imgErrors.has(currentImage) ? fallback : hotel.images[currentImage]}
                        alt={`${hotel.name} - ${currentImage + 1}`}
                        onError={() => handleImageError(currentImage)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hotel-listing-image"
                        loading="lazy"
                    />
                </AnimatePresence>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {hotel.isAIRecommended && (
                        <span className="hotel-badge bg-gradient-to-r from-violet-500 to-purple-600 text-white">
                            <Bot size={10} /> AI Pick
                        </span>
                    )}
                    {hotel.badges.slice(0, 2).map((badge) => {
                        const cfg = badgeConfig[badge];
                        return cfg ? (
                            <span key={badge} className={`hotel-badge bg-gradient-to-r ${cfg.gradient} text-white`}>
                                {cfg.icon} {badge}
                            </span>
                        ) : null;
                    })}
                </div>

                {/* Discount badge */}
                {discount > 0 && (
                    <span className="absolute top-3 right-14 hotel-badge bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold">
                        -{discount}%
                    </span>
                )}

                {/* Heart button */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(hotel.id);
                    }}
                    className={`
            absolute top-3 right-3
            w-9 h-9 rounded-full
            flex items-center justify-center
            backdrop-blur-md shadow-lg
            transition-all duration-300
            ${isWishlisted
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-rose-500'
                        }
          `}
                >
                    <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
                </motion.button>

                {/* Carousel dots */}
                {hotel.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {hotel.images.map((_, i) => (
                            <button
                                key={i}
                                onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                                className={`
                  rounded-full transition-all duration-300
                  ${i === currentImage
                                        ? 'w-5 h-1.5 bg-white'
                                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
                                    }
                `}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* === CONTENT === */}
            <div className="hotel-listing-body">
                {/* Row 1: Name + Rating */}
                <div className="flex items-start justify-between gap-2">
                    <h3 className="hotel-listing-name">{hotel.name}</h3>
                    <div className="hotel-listing-rating">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-sm text-gray-800">{hotel.rating}</span>
                        <span className="text-[11px] text-gray-400">({hotel.reviewCount.toLocaleString()})</span>
                    </div>
                </div>

                {/* Row 2: Location + distance */}
                <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={13} className="text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-xs text-gray-500 font-medium truncate">{hotel.location}</span>
                    <span className="text-gray-300">•</span>
                    <Navigation size={11} className="text-gray-400 flex-shrink-0" />
                    <span className="text-[11px] text-gray-400">{hotel.distance} from {hotel.landmark}</span>
                </div>

                {/* Row 3: Amenities */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {hotel.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="hotel-amenity-chip">
                            <span className="text-[var(--color-primary)]">{getAmenityIcon(amenity)}</span>
                            {amenity}
                        </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                        <span className="text-[11px] text-gray-400 font-medium flex items-center">
                            +{hotel.amenities.length - 4} more
                        </span>
                    )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3" />

                {/* Row 4: Price + CTA */}
                <div className="flex items-end justify-between">
                    <div>
                        {hotel.originalPrice && (
                            <span className="text-xs text-gray-400 line-through mr-1.5">
                                {hotel.currency}{hotel.originalPrice}
                            </span>
                        )}
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                                {hotel.currency}{hotel.price}
                            </span>
                            <span className="text-xs text-gray-400 font-medium">/ night</span>
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={(e) => { e.stopPropagation(); onViewDetails?.(hotel.id); }}
                        className="hotel-listing-cta"
                    >
                        View Details
                        <ChevronRight size={14} />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default HotelListingCard;
