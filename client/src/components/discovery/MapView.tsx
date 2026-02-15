import { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAttractionStore } from '../../store/useAttractionStore';
import type { Attraction } from '../../types/attraction';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const selectedIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [30, 48],
    iconAnchor: [15, 48],
    popupAnchor: [1, -40],
    shadowSize: [48, 48],
});

// Component to fit bounds
const FitBounds: React.FC<{ attractions: Attraction[] }> = ({ attractions }) => {
    const map = useMap();
    useEffect(() => {
        if (attractions.length === 0) return;
        const bounds = L.latLngBounds(
            attractions.map((a) => [a.coordinates.lat, a.coordinates.lng])
        );
        map.fitBounds(bounds, { padding: [40, 40] });
    }, [attractions, map]);
    return null;
};

interface MapViewProps {
    attractions: Attraction[];
    onClose: () => void;
}

const MapView: React.FC<MapViewProps> = ({ attractions, onClose }) => {
    const { selectedPinId, setSelectedPin, addAttraction, isInTrip } =
        useAttractionStore();
    const carouselRef = useRef<HTMLDivElement>(null);

    const center = useMemo(() => {
        if (attractions.length === 0) return { lat: 28.6139, lng: 77.209 };
        const avg = attractions.reduce(
            (acc, a) => ({ lat: acc.lat + a.coordinates.lat, lng: acc.lng + a.coordinates.lng }),
            { lat: 0, lng: 0 }
        );
        return { lat: avg.lat / attractions.length, lng: avg.lng / attractions.length };
    }, [attractions]);

    // Scroll carousel to selected card
    useEffect(() => {
        if (!selectedPinId || !carouselRef.current) return;
        const idx = attractions.findIndex((a) => a.id === selectedPinId);
        if (idx >= 0) {
            const card = carouselRef.current.children[idx] as HTMLElement;
            card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [selectedPinId, attractions]);

    return (
        <motion.div
            className="map-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Close button */}
            <button
                className="map-view__close"
                onClick={onClose}
                type="button"
                aria-label="Close map"
            >
                <X size={20} />
            </button>

            {/* Map */}
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={12}
                className="map-view__container"
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds attractions={attractions} />
                {attractions.map((a) => (
                    <Marker
                        key={a.id}
                        position={[a.coordinates.lat, a.coordinates.lng]}
                        icon={selectedPinId === a.id ? selectedIcon : defaultIcon}
                        eventHandlers={{ click: () => setSelectedPin(a.id) }}
                    >
                        <Popup>{a.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Bottom carousel */}
            <div className="map-view__carousel" ref={carouselRef}>
                {attractions.map((a) => (
                    <motion.div
                        key={a.id}
                        className={`map-card ${selectedPinId === a.id ? 'map-card--selected' : ''}`}
                        onClick={() => setSelectedPin(a.id)}
                        whileTap={{ scale: 0.97 }}
                    >
                        <img src={a.image} alt={a.name} className="map-card__img" loading="lazy" />
                        <div className="map-card__info">
                            <h4 className="map-card__name">{a.name}</h4>
                            <p className="map-card__meta">
                                ⭐ {a.rating} · {a.duration}
                            </p>
                            {!isInTrip(a.id) && (
                                <button
                                    className="map-card__add"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addAttraction(a);
                                    }}
                                    type="button"
                                >
                                    + Add
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default MapView;
