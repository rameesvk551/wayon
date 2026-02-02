import { motion } from 'framer-motion';
import { Star, MapPin } from 'lucide-react';
import type { Destination } from '../../types';

interface InspirationCardProps {
    destination: Destination;
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const sizeStyles = {
    sm: 'h-48',
    md: 'h-64',
    lg: 'h-80'
};

export const InspirationCard: React.FC<InspirationCardProps> = ({
    destination,
    size = 'md',
    onClick
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative overflow-hidden cursor-pointer
                rounded-2xl ${sizeStyles[size]}
                group
            `}
        >
            {/* Background Image */}
            <img
                src={destination.image}
                alt={destination.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {destination.tags.slice(0, 2).map(tag => (
                        <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title & Location */}
                <h3 className="text-xl font-bold text-white mb-1">
                    {destination.name}
                </h3>
                <div className="flex items-center gap-1.5 text-white/80 text-sm mb-2">
                    <MapPin size={14} />
                    <span>{destination.country}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-white">
                            {destination.rating}
                        </span>
                    </div>
                    <span className="text-xs text-white/70">
                        {destination.reviewCount.toLocaleString()} reviews
                    </span>
                </div>
            </div>

            {/* Hover Shine Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            </div>
        </motion.div>
    );
};
