import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { X, Star, MapPin, Heart } from 'lucide-react';
import { useHotelStore } from '../../store/useHotelStore';
import type { HotelListingItem } from '../../data/hotelListingData';
import 'leaflet/dist/leaflet.css';

// Create price marker icon
const createPriceIcon = (price: number, currency: string, isActive: boolean) =>
    L.divIcon({
        className: 'hotel-map-marker',
        html: `<div class="hotel-price-pin ${isActive ? 'active' : ''}">${currency}${price}</div>`,
        iconSize: [70, 32],
        iconAnchor: [35, 32],
    });

export const HotelMapView: React.FC = () => {
    const { getFilteredHotels, wishlist, toggleWishlist } = useHotelStore();
    const hotels = getFilteredHotels();
    const [selectedHotel, setSelectedHotel] = useState<HotelListingItem | null>(null);

    // Calculate center from hotels
    const center = useMemo(() => {
        if (hotels.length === 0) return { lat: -8.65, lng: 115.22 };
        const lats = hotels.map((h) => h.coordinates.lat);
        const lngs = hotels.map((h) => h.coordinates.lng);
        return {
            lat: (Math.min(...lats) + Math.max(...lats)) / 2,
            lng: (Math.min(...lngs) + Math.max(...lngs)) / 2,
        };
    }, [hotels]);

    return (
        <div className="hotel-map-container">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={11}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hotels.map((hotel) => (
                    <Marker
                        key={hotel.id}
                        position={[hotel.coordinates.lat, hotel.coordinates.lng]}
                        icon={createPriceIcon(hotel.price, hotel.currency, selectedHotel?.id === hotel.id)}
                        eventHandlers={{
                            click: () => setSelectedHotel(hotel),
                        }}
                    >
                        <Popup>
                            <strong>{hotel.name}</strong><br />
                            {hotel.currency}{hotel.price}/night
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Bottom preview card */}
            <AnimatePresence>
                {selectedHotel && (
                    <motion.div
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 200, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="hotel-map-preview"
                    >
                        <button
                            onClick={() => setSelectedHotel(null)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm"
                        >
                            <X size={14} className="text-gray-500" />
                        </button>
                        <div className="flex gap-3">
                            <img
                                src={selectedHotel.images[0]}
                                alt={selectedHotel.name}
                                className="w-24 h-20 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 truncate">{selectedHotel.name}</h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <MapPin size={11} className="text-[var(--color-primary)]" />
                                    <span className="text-[11px] text-gray-500 truncate">{selectedHotel.location}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1">
                                    <Star size={12} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-bold">{selectedHotel.rating}</span>
                                    <span className="text-[10px] text-gray-400">({selectedHotel.reviewCount.toLocaleString()})</span>
                                </div>
                                <div className="flex items-center justify-between mt-1.5">
                                    <span className="text-base font-extrabold text-[var(--color-primary)]">
                                        {selectedHotel.currency}{selectedHotel.price}
                                        <span className="text-[10px] text-gray-400 font-medium">/night</span>
                                    </span>
                                    <motion.button
                                        whileTap={{ scale: 0.85 }}
                                        onClick={(e) => { e.stopPropagation(); toggleWishlist(selectedHotel.id); }}
                                        className={`p-1.5 rounded-full ${wishlist.has(selectedHotel.id) ? 'text-rose-500' : 'text-gray-400'}`}
                                    >
                                        <Heart size={16} className={wishlist.has(selectedHotel.id) ? 'fill-current' : ''} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HotelMapView;
