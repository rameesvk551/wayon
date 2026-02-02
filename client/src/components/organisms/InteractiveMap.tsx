import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapContext } from '../../store/MapContext';
import type { MapMarkerInstruction } from '../../types/ui-schema';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (isHighlighted: boolean) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
            <div style="
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: ${isHighlighted ? '#0D9488' : 'white'};
                border: 3px solid ${isHighlighted ? '#0D9488' : '#0D9488'};
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                transform: translate(-50%, -50%);
            ">
                <span style="font-size: 18px;">📍</span>
            </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

// Map controller component for programmatic control
interface MapControllerProps {
    center: [number, number] | null;
    zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom, {
                duration: 1.5,
                easeLinearity: 0.25,
            });
        }
    }, [center, zoom, map]);

    return null;
};

// Marker component
interface MapMarkerProps {
    marker: MapMarkerInstruction;
    isHighlighted: boolean;
    onClick: () => void;
}

const MapMarkerComponent: React.FC<MapMarkerProps> = ({ marker, isHighlighted, onClick }) => {
    return (
        <Marker
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(isHighlighted)}
            eventHandlers={{
                click: onClick,
            }}
        >
            <Popup>
                <div className="text-center p-1">
                    {marker.image && (
                        <img
                            src={marker.image}
                            alt={marker.title}
                            className="w-24 h-16 object-cover rounded mb-2"
                        />
                    )}
                    <h4 className="font-bold text-sm">{marker.title}</h4>
                    <span className="text-xs text-gray-500">{marker.category}</span>
                </div>
            </Popup>
        </Marker>
    );
};

export const InteractiveMap: React.FC = () => {
    const {
        mapInstruction,
        selectedAttractionId,
        highlightedAttractionId,
        selectAttraction
    } = useMapContext();

    const defaultCenter: [number, number] = [20, 0];
    const defaultZoom = 2;

    const center: [number, number] | null = mapInstruction
        ? [mapInstruction.location.lat, mapInstruction.location.lng]
        : null;

    const zoom = mapInstruction?.location.zoom || defaultZoom;

    const handleMarkerClick = (markerId: string) => {
        selectAttraction(markerId);
    };

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={center || defaultCenter}
                zoom={defaultZoom}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController center={center} zoom={zoom} />

                {mapInstruction?.markers.map((marker) => (
                    <MapMarkerComponent
                        key={marker.id}
                        marker={marker}
                        isHighlighted={
                            highlightedAttractionId === marker.id ||
                            selectedAttractionId === marker.id
                        }
                        onClick={() => handleMarkerClick(marker.id)}
                    />
                ))}
            </MapContainer>

            {/* City label overlay */}
            <AnimatePresence>
                {mapInstruction && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-4 left-4 z-[1000]"
                    >
                        <div className="
                            bg-white/95 backdrop-blur-md
                            px-4 py-2 rounded-xl
                            shadow-lg border border-gray-200
                        ">
                            <h3 className="font-bold text-lg text-gray-800">
                                📍 {mapInstruction.location.city}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {mapInstruction.markers.length} attractions
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty state */}
            {!mapInstruction && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[500]">
                    <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                        <div className="text-5xl mb-4">🗺️</div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">
                            Explore the World
                        </h3>
                        <p className="text-sm text-gray-500 max-w-xs">
                            Search for attractions to see them on the map
                        </p>
                    </div>
                </div>
            )}


        </div>
    );
};
