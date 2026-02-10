import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Wifi, UtensilsCrossed, MapPin, ChevronLeft, ChevronRight, Heart, Waves, Car, Coffee, Dumbbell, Sparkles, Building2 } from 'lucide-react';

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
    best_value: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25',
    luxury: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25',
    budget: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25',
    popular: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25',
};

const amenityIcons: Record<string, React.ReactNode> = {
    wifi: <Wifi size={11} />,
    'free wifi': <Wifi size={11} />,
    breakfast: <UtensilsCrossed size={11} />,
    restaurant: <UtensilsCrossed size={11} />,
    pool: <Waves size={11} />,
    parking: <Car size={11} />,
    'free parking': <Car size={11} />,
    spa: <Sparkles size={11} />,
    gym: <Dumbbell size={11} />,
    fitness: <Dumbbell size={11} />,
    cafe: <Coffee size={11} />,
};

// Default hotel images when no image is available
const defaultHotelImages = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop',
];

const HotelCard: React.FC<{
    hotel: HotelItem;
    index: number;
    onHotelClick?: (hotelId: string) => void;
    onBookClick?: (hotelId: string) => void;
}> = ({ hotel, index, onHotelClick, onBookClick }) => {
    const [imageError, setImageError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const fallbackImage = defaultHotelImages[index % defaultHotelImages.length];
    const imageUrl = imageError || !hotel.image ? fallbackImage : hotel.image;

    const getAmenityIcon = (amenity: string) => {
        const lowerAmenity = amenity.toLowerCase();
        for (const [key, icon] of Object.entries(amenityIcons)) {
            if (lowerAmenity.includes(key)) return icon;
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="
                flex-shrink-0 w-[200px] h-[320px]
                flex flex-col
                bg-white
                rounded-2xl
                overflow-hidden
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
                transition-all duration-300
                cursor-pointer
                group
            "
            onClick={() => onHotelClick?.(hotel.id)}
        >
            {/* Image Container */}
            <div className="relative h-[130px] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={hotel.name}
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Badge */}
                {hotel.badge && hotel.badgeType && (
                    <motion.span
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={`
                            absolute top-2.5 left-2.5
                            px-2 py-0.5
                            text-[10px] font-bold uppercase tracking-wide
                            rounded-full
                            ${badgeStyles[hotel.badgeType]}
                        `}
                    >
                        {hotel.badge}
                    </motion.span>
                )}

                {/* Save Button */}
                <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsLiked(!isLiked);
                    }}
                    className={`
                        absolute top-2.5 right-2.5
                        p-1.5 rounded-full
                        backdrop-blur-md
                        shadow-lg
                        transition-all duration-300
                        ${isLiked
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-gray-600 hover:bg-white hover:text-rose-500'
                        }
                    `}
                >
                    <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                </motion.button>

                {/* Bottom Info on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-2.5">
                    <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded-full shadow-sm">
                            <Star size={11} className="text-amber-400 fill-amber-400" />
                            <span className="text-[11px] font-bold text-gray-800">
                                {hotel.rating}
                            </span>
                        </div>
                        {hotel.reviewCount && (
                            <span className="text-[10px] text-white/90 font-medium">
                                ({hotel.reviewCount.toLocaleString()} reviews)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex flex-col">
                {/* Top Content - Fixed height section */}
                <div className="flex-1">
                    {/* Name */}
                    <h4 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                        {hotel.name}
                    </h4>

                    {/* Location */}
                    <div className="flex items-center gap-1 mb-2">
                        <MapPin size={11} className="text-[var(--color-primary)] flex-shrink-0" />
                        <span className="text-[11px] text-gray-500 line-clamp-1 font-medium">
                            {hotel.location}
                        </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-2.5 min-h-[24px]">
                        {hotel.amenities.slice(0, 2).map((amenity, i) => (
                            <span
                                key={i}
                                className="
                                    inline-flex items-center gap-0.5
                                    px-1.5 py-0.5
                                    text-[10px] font-medium
                                    bg-gray-50
                                    text-gray-600
                                    rounded-md
                                    border border-gray-100
                                "
                            >
                                <span className="text-[var(--color-primary)]">
                                    {getAmenityIcon(amenity)}
                                </span>
                                {amenity}
                            </span>
                        ))}
                        {hotel.amenities.length > 2 && (
                            <span className="text-[10px] text-gray-400 font-medium px-1">
                                +{hotel.amenities.length - 2}
                            </span>
                        )}
                    </div>
                </div>

                {/* Bottom Section - Always at bottom */}
                <div className="mt-auto">
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-2.5" />

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            {hotel.originalPrice && (
                                <span className="text-[10px] text-gray-400 line-through">
                                    {hotel.originalPrice}
                                </span>
                            )}
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-base font-extrabold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                                    {hotel.price}
                                </span>
                                <span className="text-[10px] text-gray-400 font-medium">/night</span>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => { e.stopPropagation(); onBookClick?.(hotel.id); }}
                            className="
                            px-3 py-1.5
                            text-[11px] font-bold
                            text-white
                            bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
                            rounded-lg
                            shadow-md shadow-[var(--color-primary)]/25
                            hover:shadow-lg hover:shadow-[var(--color-primary)]/30
                            transition-all duration-300
                        "
                        >
                            Book Now
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
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
            const scrollAmount = 240;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!hotels || hotels.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 px-4">
                <Building2 size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm font-medium">No hotels available</p>
                <p className="text-gray-400 text-xs mt-1">Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Header */}
            {title && (
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-5 bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full" />
                        <h3 className="text-base font-bold text-gray-900">
                            {title}
                        </h3>
                        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {hotels.length} options
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('left')}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
                        >
                            <ChevronLeft size={16} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('right')}
                            className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
                        >
                            <ChevronRight size={16} />
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto no-scrollbar pb-3 px-1 -mx-1"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                {hotels.map((hotel, index) => (
                    <div key={hotel.id} style={{ scrollSnapAlign: 'start' }}>
                        <HotelCard
                            hotel={hotel}
                            index={index}
                            onHotelClick={onHotelClick}
                            onBookClick={onBookClick}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
