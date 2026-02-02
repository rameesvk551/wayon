import { motion } from 'framer-motion';
import { Calendar, Users, MapPin, ChevronRight } from 'lucide-react';
import type { Trip } from '../../types';
import { Badge } from '../atoms';

interface TripCardProps {
    trip: Trip;
    onClick?: () => void;
}

const statusStyles = {
    draft: { variant: 'default' as const, label: 'Draft' },
    planned: { variant: 'primary' as const, label: 'Planned' },
    completed: { variant: 'success' as const, label: 'Completed' }
};

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
    const status = statusStyles[trip.status];

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="
        flex items-center gap-4
        p-3
        bg-[var(--color-bg-secondary)]
        border border-[var(--color-border)]
        rounded-xl
        cursor-pointer
        hover:border-[var(--color-text-muted)]
        hover:shadow-md
        transition-all duration-200
        group
      "
        >
            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                <img
                    src={trip.coverImage}
                    alt={trip.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                        {trip.name}
                    </h4>
                    <Badge variant={status.variant} size="sm">
                        {status.label}
                    </Badge>
                </div>

                {/* Route Preview */}
                <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] mb-1.5">
                    <MapPin size={12} />
                    <span className="truncate">
                        {trip.destinations.join(' → ')}
                    </span>
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Users size={12} />
                        <span>{trip.travelers}</span>
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <ChevronRight
                size={18}
                className="
          flex-shrink-0 
          text-[var(--color-text-muted)]
          group-hover:text-[var(--color-primary)]
          transition-colors
        "
            />
        </motion.div>
    );
};
