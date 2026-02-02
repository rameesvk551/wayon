import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Navigation, Maximize2 } from 'lucide-react';
import { useState } from 'react';
import type { MapBlock as MapBlockType } from '../../types/ui-schema';
import { IconButton } from '../atoms';

type MapBlockProps = Omit<MapBlockType, 'type'>;

export const MapBlock: React.FC<MapBlockProps> = ({
    markers,
    routes,
    center,
    zoom: initialZoom = 1
}) => {
    const [zoom, setZoom] = useState(initialZoom);

    // Calculate bounds from markers to determine positioning
    const getMarkerPosition = (lat: number, lng: number) => {
        // Normalize coordinates to percentage positions
        // This is a simplified projection; real maps would use proper projection
        const minLat = Math.min(...markers.map(m => m.lat));
        const maxLat = Math.max(...markers.map(m => m.lat));
        const minLng = Math.min(...markers.map(m => m.lng));
        const maxLng = Math.max(...markers.map(m => m.lng));

        const latRange = maxLat - minLat || 1;
        const lngRange = maxLng - minLng || 1;

        const x = 20 + ((lng - minLng) / lngRange) * 60;
        const y = 20 + ((maxLat - lat) / latRange) * 60;

        return { x, y };
    };

    const markerTypeStyles = {
        default: 'bg-[var(--color-primary)]',
        start: 'bg-emerald-500',
        end: 'bg-rose-500',
        waypoint: 'bg-amber-500'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="
        relative
        h-64 md:h-80
        bg-gradient-to-br from-[#E8F4F8] to-[#D4EBF2]
        rounded-2xl
        overflow-hidden
        border border-[var(--color-border)]
      "
        >
            {/* Map Content */}
            <div
                className="absolute inset-0 transition-transform duration-300"
                style={{ transform: `scale(${zoom})` }}
            >
                {/* SVG for routes */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    {routes?.map((route, index) => {
                        const fromMarker = markers.find(m => m.id === route.from);
                        const toMarker = markers.find(m => m.id === route.to);

                        if (!fromMarker || !toMarker) return null;

                        const from = getMarkerPosition(fromMarker.lat, fromMarker.lng);
                        const to = getMarkerPosition(toMarker.lat, toMarker.lng);

                        return (
                            <motion.path
                                key={`route-${index}`}
                                d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - 5}, ${to.x} ${to.y}`}
                                fill="none"
                                stroke="var(--color-primary)"
                                strokeWidth="0.5"
                                strokeDasharray={route.type === 'dashed' ? '2 1' : undefined}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1, delay: index * 0.3 }}
                            />
                        );
                    })}
                </svg>

                {/* Markers */}
                {markers.map((marker) => {
                    const pos = getMarkerPosition(marker.lat, marker.lng);

                    return (
                        <motion.div
                            key={marker.id}
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 }}
                            className="absolute"
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%, -100%)'
                            }}
                        >
                            {/* Pin */}
                            <div className="relative group">
                                <div className={`
                  w-6 h-6 rounded-full
                  ${markerTypeStyles[marker.type || 'default']}
                  shadow-lg
                  flex items-center justify-center
                  text-white text-xs font-bold
                  border-2 border-white
                `}>
                                    {markers.indexOf(marker) + 1}
                                </div>

                                {/* Tooltip */}
                                <div className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  px-2 py-1 bg-white rounded-lg shadow-lg
                  text-xs font-medium text-[var(--color-text-primary)]
                  whitespace-nowrap
                  opacity-0 group-hover:opacity-100
                  transition-opacity
                  pointer-events-none
                ">
                                    {marker.label}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Controls */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                <IconButton
                    icon={<ZoomIn size={16} />}
                    size="sm"
                    onClick={() => setZoom(z => Math.min(z + 0.2, 2))}
                    tooltip="Zoom in"
                />
                <IconButton
                    icon={<ZoomOut size={16} />}
                    size="sm"
                    onClick={() => setZoom(z => Math.max(z - 0.2, 0.5))}
                    tooltip="Zoom out"
                />
                <IconButton
                    icon={<Navigation size={16} />}
                    size="sm"
                    onClick={() => setZoom(1)}
                    tooltip="Reset"
                />
                <IconButton
                    icon={<Maximize2 size={16} />}
                    size="sm"
                    tooltip="Fullscreen"
                />
            </div>

            {/* Legend */}
            {markers.length > 0 && (
                <div className="
          absolute bottom-3 left-3 right-3
          bg-white/90 backdrop-blur-sm
          rounded-xl p-3
          shadow-lg border border-white/50
        ">
                    <div className="flex items-center gap-4 overflow-x-auto">
                        {markers.map((marker, index) => (
                            <div key={marker.id} className="flex items-center gap-2 flex-shrink-0">
                                <div className={`
                  w-5 h-5 rounded-full text-xs font-bold
                  ${markerTypeStyles[marker.type || 'default']}
                  text-white flex items-center justify-center
                `}>
                                    {index + 1}
                                </div>
                                <span className="text-xs font-medium text-[var(--color-text-primary)]">
                                    {marker.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};
