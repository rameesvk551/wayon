import { motion, AnimatePresence } from 'framer-motion';

import { ChevronDown, Clock, MapPin, Hotel, Utensils, Camera, Ticket, Waves, ShoppingBag } from 'lucide-react';
import type { DayItinerary, Activity } from '../../types';
import { TransportBadge, PriceTag, RatingStars } from '../molecules';


interface DayTimelineProps {
    day: DayItinerary;
    isActive?: boolean;
    onToggle?: () => void;
    onClick?: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
    sightseeing: Camera,
    food: Utensils,
    adventure: Waves,
    culture: Ticket,
    relaxation: Waves,
    shopping: ShoppingBag
};

const categoryColors: Record<string, string> = {
    sightseeing: 'bg-amber-50 text-amber-600 border-amber-200',
    food: 'bg-orange-50 text-orange-600 border-orange-200',
    adventure: 'bg-blue-50 text-blue-600 border-blue-200',
    culture: 'bg-violet-50 text-violet-600 border-violet-200',
    relaxation: 'bg-teal-50 text-teal-600 border-teal-200',
    shopping: 'bg-pink-50 text-pink-600 border-pink-200'
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
    const Icon = categoryIcons[activity.category] || Camera;
    const colorClass = categoryColors[activity.category] || categoryColors.sightseeing;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 p-3 bg-white rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-md transition-all duration-200"
        >
            {/* Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <img
                    src={activity.image}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                        {activity.name}
                    </h4>
                    <div className={`p-1 rounded-lg ${colorClass} border`}>
                        <Icon size={12} />
                    </div>
                </div>

                <p className="text-xs text-[var(--color-text-muted)] line-clamp-1 mb-2">
                    {activity.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{activity.startTime} - {activity.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span className="truncate">{activity.location}</span>
                    </div>
                    {activity.price && (
                        <PriceTag price={activity.price} size="sm" />
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export const DayTimeline: React.FC<DayTimelineProps> = ({
    day,
    isActive = false,
    onToggle,
    onClick
}) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            layout
            className={`
        rounded-2xl overflow-hidden
        border transition-all duration-200
        ${isActive
                    ? 'border-[var(--color-primary)] shadow-lg bg-white'
                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-text-muted)]'
                }
      `}
        >
            {/* Header */}
            <button
                onClick={onToggle || onClick}
                className="w-full flex items-center gap-4 p-4"
            >
                {/* Day Number */}
                <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
          ${isActive
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)]'
                    }
        `}>
                    <div className="text-center">
                        <div className="text-[10px] font-medium opacity-80">DAY</div>
                        <div className="text-lg font-bold leading-none">{day.dayNumber}</div>
                    </div>
                </div>

                {/* City Image & Info */}
                <div className="flex-1 flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={day.cityImage}
                            alt={day.city}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-left min-w-0">
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {day.city}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">
                            {formatDate(day.date)} • {day.activities.length} activities
                        </p>
                    </div>
                </div>

                {/* Transport Badge */}
                {day.transport && (
                    <TransportBadge
                        type={day.transport.type}
                        duration={day.transport.duration}
                        size="sm"
                    />
                )}

                {/* Expand Icon */}
                <ChevronDown
                    size={18}
                    className={`
            text-[var(--color-text-muted)] transition-transform flex-shrink-0
            ${isActive ? 'rotate-180' : ''}
          `}
                />
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            {/* Transport Info */}
                            {day.transport && (
                                <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-xl">
                                    <TransportBadge type={day.transport.type} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                            {day.transport.from} → {day.transport.to}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            {day.transport.departureTime} - {day.transport.arrivalTime} • {day.transport.carrier}
                                        </p>
                                    </div>
                                    {day.transport.price && (
                                        <PriceTag price={day.transport.price} size="sm" />
                                    )}
                                </div>
                            )}

                            {/* Activities */}
                            <div className="space-y-2">
                                {day.activities.map((activity) => (
                                    <ActivityCard key={activity.id} activity={activity} />
                                ))}
                            </div>

                            {/* Hotel */}
                            {day.hotel && (
                                <div className="flex items-center gap-3 p-3 bg-[var(--color-bg-tertiary)] rounded-xl">
                                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            src={day.hotel.image}
                                            alt={day.hotel.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Hotel size={12} className="text-[var(--color-text-muted)]" />
                                            <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                                                {day.hotel.name}
                                            </h4>
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <RatingStars rating={day.hotel.rating} size="sm" showValue={false} />
                                            <span className="text-xs text-[var(--color-text-muted)]">
                                                Check-in: {day.hotel.checkIn}
                                            </span>
                                        </div>
                                    </div>
                                    <PriceTag
                                        price={day.hotel.pricePerNight}
                                        suffix="/night"
                                        size="sm"
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
