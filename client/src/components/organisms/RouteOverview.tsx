import { motion } from 'framer-motion';
import { TransportBadge } from '../molecules';
import type { TransportType } from '../../types';

interface RouteStop {
    city: string;
    dayNumber: number;
    image: string;
}

interface RouteSegment {
    from: string;
    to: string;
    transport: TransportType;
    duration: string;
}

interface RouteOverviewProps {
    stops?: RouteStop[];
    segments?: RouteSegment[];
    activeStop?: number;
    onStopClick?: (dayNumber: number) => void;
}

const defaultStops: RouteStop[] = [
    { city: 'Athens', dayNumber: 1, image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=200&q=80' },
    { city: 'Mykonos', dayNumber: 3, image: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=200&q=80' },
    { city: 'Santorini', dayNumber: 5, image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=200&q=80' }
];

const defaultSegments: RouteSegment[] = [
    { from: 'Athens', to: 'Mykonos', transport: 'ferry', duration: '3h' },
    { from: 'Mykonos', to: 'Santorini', transport: 'ferry', duration: '2h 30m' }
];

export const RouteOverview: React.FC<RouteOverviewProps> = ({
    stops = defaultStops,
    segments = defaultSegments,
    activeStop = 1,
    onStopClick
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="
        flex items-center justify-center
        p-4
        bg-white
        border-b border-[var(--color-border)]
        overflow-x-auto
        no-scrollbar
      "
        >
            {stops.map((stop, index) => (
                <div key={stop.city} className="flex items-center">
                    {/* Stop */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onStopClick?.(stop.dayNumber)}
                        className={`
              flex flex-col items-center p-3 rounded-xl transition-all
              ${activeStop === stop.dayNumber
                                ? 'bg-[var(--color-primary-light)]'
                                : 'hover:bg-[var(--color-bg-tertiary)]'
                            }
            `}
                    >
                        {/* City Image */}
                        <div className={`
              w-14 h-14 rounded-xl overflow-hidden mb-2 ring-4 transition-all
              ${activeStop === stop.dayNumber
                                ? 'ring-[var(--color-primary)]'
                                : 'ring-[var(--color-border)]'
                            }
            `}>
                            <img
                                src={stop.image}
                                alt={stop.city}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* City Name */}
                        <span className={`
              text-sm font-semibold transition-colors
              ${activeStop === stop.dayNumber
                                ? 'text-[var(--color-primary)]'
                                : 'text-[var(--color-text-primary)]'
                            }
            `}>
                            {stop.city}
                        </span>

                        {/* Day Number */}
                        <span className="text-xs text-[var(--color-text-muted)]">
                            Day {stop.dayNumber}
                        </span>
                    </motion.button>

                    {/* Connector */}
                    {index < stops.length - 1 && (
                        <div className="flex items-center mx-2">
                            {/* Line */}
                            <motion.div
                                className="w-6 h-0.5 bg-[var(--color-border)]"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            />

                            {/* Transport Badge */}
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 + index * 0.2 }}
                            >
                                <TransportBadge
                                    type={segments[index].transport}
                                    duration={segments[index].duration}
                                    size="sm"
                                />
                            </motion.div>

                            {/* Line */}
                            <motion.div
                                className="w-6 h-0.5 bg-[var(--color-border)]"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </motion.div>
    );
};
