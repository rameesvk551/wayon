import { motion } from 'framer-motion';
import { useState } from 'react';
import { ZoomIn, ZoomOut, Navigation, Maximize2 } from 'lucide-react';
import { IconButton } from '../atoms';

interface MapMarker {
    id: string;
    name: string;
    dayNumber: number;
    x: number;
    y: number;
    isActive?: boolean;
}

interface CompactMapPanelProps {
    markers?: MapMarker[];
    activeDay?: number;
    onMarkerClick?: (markerId: string) => void;
    onFullscreen?: () => void;
}

export const CompactMapPanel: React.FC<CompactMapPanelProps> = ({
    markers = [],
    activeDay = 1,
    onMarkerClick,
    onFullscreen
}) => {
    const [zoom, setZoom] = useState(1);

    return (
        <div className="relative h-full bg-[#E8F4F8] overflow-hidden">
            {markers.length === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-sm text-[var(--color-text-muted)]">
                    No map data yet
                </div>
            ) : (
                <div
                    className="absolute inset-0 transition-transform duration-300"
                    style={{ transform: `scale(${zoom})` }}
                >
                    <svg
                        viewBox="0 0 100 100"
                        className="w-full h-full"
                        preserveAspectRatio="xMidYMid slice"
                    >
                        <rect width="100" height="100" fill="#B8E0EC" />
                    </svg>

                    {markers.map(marker => {
                        const isActive = marker.dayNumber <= activeDay;
                        const isCurrent = markers.find(
                            m => m.dayNumber === activeDay
                        )?.id === marker.id;

                        return (
                            <motion.button
                                key={marker.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: marker.dayNumber * 0.2 }}
                                onClick={() => onMarkerClick?.(marker.id)}
                                className="absolute"
                                style={{
                                    left: `${marker.x}%`,
                                    top: `${marker.y}%`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                <motion.div
                                    animate={isCurrent ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className={`
                                        w-8 h-8 rounded-full
                                        flex items-center justify-center
                                        text-xs font-bold
                                        shadow-lg
                                        transition-all duration-200
                                        ${isCurrent
                                            ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary-light)]'
                                            : isActive
                                                ? 'bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)]'
                                                : 'bg-white/80 text-[var(--color-text-muted)] border border-[var(--color-border)]'
                                        }
                                    `}
                                >
                                    {marker.dayNumber}
                                </motion.div>
                                <span className={`
                                    absolute -bottom-5 left-1/2 -translate-x-1/2
                                    text-[10px] font-medium whitespace-nowrap
                                    px-1.5 py-0.5 rounded
                                    ${isCurrent
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-white/90 text-[var(--color-text-secondary)]'
                                    }
                                `}>
                                    {marker.name}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>
            )}

            {/* Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                <IconButton
                    icon={<ZoomIn size={16} />}
                    onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                    tooltip="Zoom in"
                    size="sm"
                />
                <IconButton
                    icon={<ZoomOut size={16} />}
                    onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                    tooltip="Zoom out"
                    size="sm"
                />
                <IconButton
                    icon={<Navigation size={16} />}
                    onClick={() => setZoom(1)}
                    tooltip="Reset"
                    size="sm"
                />
                <IconButton
                    icon={<Maximize2 size={16} />}
                    onClick={onFullscreen}
                    tooltip="Fullscreen"
                    size="sm"
                />
            </div>

            {markers.length > 0 && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <div className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                        Your Route
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-[var(--color-text-muted)]">
                        {markers.map((marker, index) => (
                            <div key={marker.id} className="flex items-center gap-1">
                                <span className="font-medium">{marker.name}</span>
                                {index < markers.length - 1 && (
                                    <span className="text-[var(--color-text-light)]">→</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
