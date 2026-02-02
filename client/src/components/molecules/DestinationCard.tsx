import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import type { Destination } from '../../types';
import { Badge } from '../atoms';

interface DestinationCardProps {
    destination: Destination;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: {
        container: 'h-40',
        image: 'h-40',
        title: 'text-sm font-semibold',
        subtitle: 'text-xs'
    },
    md: {
        container: 'h-52',
        image: 'h-52',
        title: 'text-base font-semibold',
        subtitle: 'text-sm'
    },
    lg: {
        container: 'h-72',
        image: 'h-72',
        title: 'text-lg font-semibold',
        subtitle: 'text-sm'
    }
};

export const DestinationCard: React.FC<DestinationCardProps> = ({
    destination,
    onClick,
    size = 'md'
}) => {
    const styles = sizeStyles[size];

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={`
        relative
        ${styles.container}
        rounded-2xl
        overflow-hidden
        cursor-pointer
        group
        shadow-md
        hover:shadow-xl
        transition-shadow duration-300
      `}
        >
            {/* Image */}
            <img
                src={destination.image}
                alt={destination.name}
                className={`
          w-full ${styles.image}
          object-cover
          transition-transform duration-500
          group-hover:scale-110
        `}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Top Badge */}
            {destination.rating >= 4.8 && (
                <div className="absolute top-3 left-3">
                    <Badge variant="primary" size="sm" icon={<Star size={12} fill="currentColor" />}>
                        Top Rated
                    </Badge>
                </div>
            )}

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className={`${styles.title} text-white mb-1`}>
                    {destination.name}
                </h3>
                <div className="flex items-center gap-1.5 text-white/80">
                    <MapPin size={14} />
                    <span className={styles.subtitle}>{destination.country}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex items-center gap-1 text-amber-400">
                        <Star size={14} fill="currentColor" />
                        <span className="text-sm font-semibold text-white">{destination.rating}</span>
                    </div>
                    <span className="text-xs text-white/60">
                        ({destination.reviewCount.toLocaleString()} reviews)
                    </span>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                    {destination.tags.slice(0, 3).map(tag => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 text-xs bg-white/20 backdrop-blur-sm text-white rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};
