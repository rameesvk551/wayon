import { motion } from 'framer-motion';
import { useState } from 'react';
import { ZoomIn, ZoomOut, Layers, Navigation, Maximize2 } from 'lucide-react';
import { CityMarker, TransportBadge } from '../molecules';
import { IconButton } from '../atoms';
import { greekItineraryDays } from '../../data/itinerary';

interface MapPanelProps {
    selectedDay?: number;
    onDaySelect?: (dayNumber: number) => void;
}

// Map cities with their relative positions for the Greece route
const cityPositions = [
    { id: 'athens', name: 'Athens', x: 65, y: 70, dayNumber: 1 },
    { id: 'mykonos', name: 'Mykonos', x: 78, y: 58, dayNumber: 3 },
    { id: 'santorini', name: 'Santorini', x: 72, y: 82, dayNumber: 5 }
];

export const MapPanel: React.FC<MapPanelProps> = ({
    selectedDay = 1,
    onDaySelect
}) => {
    const [zoom, setZoom] = useState(1);

    const getActiveCity = () => {
        const day = greekItineraryDays.find(d => d.dayNumber === selectedDay);
        return day?.city.toLowerCase();
    };

    const activeCity = getActiveCity();

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="
        flex-1
        h-full
        bg-[#E8F4F8]
        relative
        overflow-hidden
        rounded-l-2xl
      "
        >
            {/* Map Background - Stylized Greece Map */}
            <div
                className="absolute inset-0 transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
            >
                {/* Aegean Sea Background */}
                <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                >
                    {/* Sea */}
                    <rect width="100" height="100" fill="#B8E0EC" />

                    {/* Greece Mainland (simplified) */}
                    <path
                        d="M 45 20 Q 55 25, 60 35 Q 65 45, 58 55 Q 55 60, 50 65 Q 45 70, 48 75 L 52 78 Q 56 72, 62 68 Q 68 65, 72 60 L 75 55 Q 72 45, 68 38 Q 62 30, 55 22 Z"
                        fill="#E8DCC8"
                        stroke="#D4C8B8"
                        strokeWidth="0.5"
                    />

                    {/* Islands */}
                    {/* Mykonos */}
                    <ellipse cx="78" cy="58" rx="3" ry="2" fill="#E8DCC8" stroke="#D4C8B8" strokeWidth="0.3" />

                    {/* Santorini */}
                    <path
                        d="M 70 80 Q 72 79, 74 80 Q 75 82, 74 84 Q 72 85, 70 84 Q 69 82, 70 80 Z"
                        fill="#E8DCC8"
                        stroke="#D4C8B8"
                        strokeWidth="0.3"
                    />

                    {/* Route Lines */}
                    <motion.path
                        d="M 65 70 Q 72 64, 78 58"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="0.5"
                        strokeDasharray="2 1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    <motion.path
                        d="M 78 58 Q 76 70, 72 82"
                        fill="none"
                        stroke="var(--color-primary)"
                        strokeWidth="0.5"
                        strokeDasharray="2 1"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 1 }}
                    />

                    {/* Transport Icons on Routes */}
                    <g transform="translate(72, 62)">
                        <circle r="2" fill="white" />
                        <text x="0" y="0.8" textAnchor="middle" fontSize="2.5" fill="var(--color-accent)">⛴</text>
                    </g>
                    <g transform="translate(76, 72)">
                        <circle r="2" fill="white" />
                        <text x="0" y="0.8" textAnchor="middle" fontSize="2.5" fill="var(--color-accent)">⛴</text>
                    </g>
                </svg>

                {/* City Markers */}
                {cityPositions.map(city => (
                    <div
                        key={city.id}
                        className="absolute"
                        style={{
                            left: `${city.x}%`,
                            top: `${city.y}%`,
                            transform: 'translate(-50%, -100%)'
                        }}
                    >
                        <CityMarker
                            name={city.name}
                            dayNumber={city.dayNumber}
                            isActive={activeCity?.includes(city.id)}
                            onClick={() => onDaySelect?.(city.dayNumber)}
                        />
                    </div>
                ))}
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <IconButton
                    icon={<ZoomIn size={18} />}
                    onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                    tooltip="Zoom in"
                />
                <IconButton
                    icon={<ZoomOut size={18} />}
                    onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                    tooltip="Zoom out"
                />
                <IconButton
                    icon={<Navigation size={18} />}
                    onClick={() => setZoom(1)}
                    tooltip="Reset view"
                />
                <IconButton
                    icon={<Layers size={18} />}
                    tooltip="Map layers"
                />
                <IconButton
                    icon={<Maximize2 size={18} />}
                    tooltip="Fullscreen"
                />
            </div>

            {/* Route Overview Card */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="
          absolute bottom-4 left-4 right-4
          bg-white/95 backdrop-blur-sm
          rounded-2xl
          p-4
          shadow-lg
          border border-white/50
        "
            >
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
                    Route Overview
                </h3>
                <div className="flex items-center justify-between">
                    {cityPositions.map((city, index) => (
                        <div key={city.id} className="flex items-center">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onDaySelect?.(city.dayNumber)}
                                className={`
                  flex flex-col items-center p-2 rounded-xl transition-colors
                  ${activeCity?.includes(city.id)
                                        ? 'bg-[var(--color-primary-light)]'
                                        : 'hover:bg-[var(--color-bg-tertiary)]'
                                    }
                `}
                            >
                                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1
                  ${activeCity?.includes(city.id)
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                                    }
                `}>
                                    {city.dayNumber}
                                </div>
                                <span className="text-xs font-medium text-[var(--color-text-primary)]">
                                    {city.name}
                                </span>
                            </motion.button>

                            {index < cityPositions.length - 1 && (
                                <div className="flex items-center mx-2">
                                    <div className="w-8 h-px bg-[var(--color-border)]" />
                                    <TransportBadge type="ferry" size="sm" showLabel={false} />
                                    <div className="w-8 h-px bg-[var(--color-border)]" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Attribution */}
            <div className="absolute bottom-4 right-4 text-[10px] text-[var(--color-text-muted)] bg-white/80 px-2 py-1 rounded">
                Map design inspired by Google Maps
            </div>
        </motion.div>
    );
};
