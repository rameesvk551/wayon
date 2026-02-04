import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { AttractionModal } from './AttractionModal';
import type { Attraction } from '../types';

interface AttractionsCardProps {
    destination: string;
    onContinue: (selectedAttractions: Attraction[]) => void;
}

export const AttractionsCard = ({ destination, onContinue }: AttractionsCardProps) => {
    const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>([]);
    const [modalAttraction, setModalAttraction] = useState<Attraction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getAttractions = (dest: string): Attraction[] => {
        const attractionsMap: Record<string, Attraction[]> = {
            Paris: [
                { id: '1', name: 'Eiffel Tower', category: 'Landmark', rating: 4.8, duration: '2-3 hours', price: '€26', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400', description: 'Iconic iron lattice tower on the Champ de Mars. The most visited paid monument in the world, offering stunning panoramic views of Paris from its observation decks.', highlights: ['360° city views', 'Restaurant on 2nd floor', 'Light show at night', 'Skip-the-line tickets available'], openingHours: '9:30 AM - 11:45 PM', address: 'Champ de Mars, Paris', lat: 48.8584, lng: 2.2945 },
                { id: '2', name: 'Louvre Museum', category: 'Museum', rating: 4.9, duration: '3-4 hours', price: '€17', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', description: "World's largest art museum and historic monument. Home to thousands of works including the Mona Lisa and Venus de Milo.", highlights: ['Mona Lisa', 'Venus de Milo', 'Egyptian antiquities', 'French paintings'], openingHours: '9:00 AM - 6:00 PM', address: 'Rue de Rivoli, Paris', lat: 48.8606, lng: 2.3376 },
                { id: '3', name: 'Notre-Dame Cathedral', category: 'Historical', rating: 4.7, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=400', description: 'Medieval Catholic cathedral on the Île de la Cité. A masterpiece of French Gothic architecture currently under restoration.', highlights: ['Gothic architecture', 'Rose windows', 'Bell towers', 'River Seine views'], openingHours: '8:00 AM - 6:45 PM', address: 'Île de la Cité, Paris', lat: 48.853, lng: 2.3499 },
                { id: '4', name: 'Montmartre', category: 'Neighborhood', rating: 4.6, duration: '2-3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400', description: 'Historic hilltop district known for Sacré-Cœur Basilica, artistic heritage, and charming cobblestone streets.', highlights: ['Sacré-Cœur Basilica', 'Artist Square', 'Vineyard', 'Panoramic views'], openingHours: 'Open 24 hours', address: 'Montmartre, Paris', lat: 48.8867, lng: 2.3431 },
            ],
            Tokyo: [
                { id: '1', name: 'Senso-ji Temple', category: 'Temple', rating: 4.8, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', description: "Ancient Buddhist temple in Asakusa. Tokyo's oldest temple with a vibrant shopping street leading to its gates.", highlights: ['Thunder Gate', 'Nakamise shopping street', 'Five-story pagoda', 'Fortune slips'], openingHours: '6:00 AM - 5:00 PM', address: 'Asakusa, Tokyo', lat: 35.7148, lng: 139.7967 },
                { id: '2', name: 'Tokyo Skytree', category: 'Landmark', rating: 4.7, duration: '2-3 hours', price: '¥2,100', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400', description: 'Tallest tower in Japan with observation decks offering breathtaking views of Tokyo and beyond.', highlights: ['Tembo Deck (350m)', 'Tembo Galleria (450m)', 'Shopping complex', 'Aquarium'], openingHours: '10:00 AM - 9:00 PM', address: 'Sumida, Tokyo', lat: 35.7101, lng: 139.8107 },
                { id: '3', name: 'Shibuya Crossing', category: 'Attraction', rating: 4.5, duration: '30 mins', price: 'Free', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400', description: 'Famous scramble crossing in Shibuya. One of the busiest pedestrian crossings in the world.', highlights: ['Iconic photo spot', 'Hachiko statue nearby', 'Shopping district', 'Night atmosphere'], openingHours: 'Open 24 hours', address: 'Shibuya, Tokyo', lat: 35.6595, lng: 139.7004 },
                { id: '4', name: 'Meiji Shrine', category: 'Shrine', rating: 4.8, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?w=400', description: 'Shinto shrine dedicated to Emperor Meiji. A peaceful forest oasis in the heart of busy Tokyo.', highlights: ['Forest walk', 'Traditional ceremonies', 'Sake barrels', 'Wishes board'], openingHours: 'Sunrise to Sunset', address: 'Shibuya, Tokyo', lat: 35.6764, lng: 139.6993 },
            ],
            Bali: [
                { id: '1', name: 'Tanah Lot Temple', category: 'Temple', rating: 4.7, duration: '2-3 hours', price: 'IDR 60k', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', description: 'Iconic sea temple on a rock formation. One of Bali\'s most important landmarks and popular sunset spot.', highlights: ['Sunset views', 'Sea temple', 'Cultural performances', 'Local market'], openingHours: '7:00 AM - 7:00 PM', address: 'Tabanan, Bali', lat: -8.6212, lng: 115.0868 },
                { id: '2', name: 'Ubud Rice Terraces', category: 'Nature', rating: 4.8, duration: '2-3 hours', price: 'IDR 80k', image: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=400', description: 'Stunning terraced rice paddies in Tegallalang. A UNESCO World Heritage site showcasing traditional Balinese irrigation.', highlights: ['Photo opportunities', 'Jungle swing', 'Coffee plantation', 'Local crafts'], openingHours: '8:00 AM - 6:00 PM', address: 'Tegallalang, Ubud', lat: -8.4312, lng: 115.2791 },
                { id: '3', name: 'Uluwatu Temple', category: 'Temple', rating: 4.6, duration: '2-3 hours', price: 'IDR 50k', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400', description: 'Clifftop temple with ocean views and traditional Kecak fire dance performances at sunset.', highlights: ['Cliff views', 'Kecak dance', 'Monkey forest', 'Sunset spot'], openingHours: '7:00 AM - 7:00 PM', address: 'Uluwatu, Bali', lat: -8.8291, lng: 115.0849 },
                { id: '4', name: 'Seminyak Beach', category: 'Beach', rating: 4.5, duration: '3-4 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=400', description: 'Popular beach with bars and sunset views. Known for its upscale resorts, restaurants, and vibrant nightlife.', highlights: ['Beach clubs', 'Surfing', 'Sunset views', 'Fine dining'], openingHours: 'Open 24 hours', address: 'Seminyak, Bali', lat: -8.6913, lng: 115.1548 },
            ],
            Dubai: [
                { id: '1', name: 'Burj Khalifa', category: 'Landmark', rating: 4.9, duration: '2-3 hours', price: 'AED 149', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', description: "World's tallest building with observation decks. Standing at 828m, it offers unparalleled views of Dubai.", highlights: ['At The Top observation', '148th floor lounge', 'Dubai Fountain views', 'Sunset timing'], openingHours: '8:30 AM - 11:00 PM', address: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
                { id: '2', name: 'Dubai Mall', category: 'Shopping', rating: 4.7, duration: '4-5 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: "One of the world's largest shopping malls with 1,200+ stores, aquarium, and ice rink.", highlights: ['Dubai Aquarium', 'Ice rink', 'Fountain show', 'Luxury brands'], openingHours: '10:00 AM - 12:00 AM', address: 'Downtown Dubai', lat: 25.1985, lng: 55.2796 },
                { id: '3', name: 'Palm Jumeirah', category: 'Attraction', rating: 4.6, duration: '3-4 hours', price: 'Varies', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400', description: 'Iconic palm-shaped artificial island. Home to luxury hotels, apartments, and entertainment venues.', highlights: ['Atlantis resort', 'Beach clubs', 'Monorail ride', 'Water sports'], openingHours: 'Open 24 hours', address: 'Palm Jumeirah, Dubai', lat: 25.1124, lng: 55.139 },
                { id: '4', name: 'Desert Safari', category: 'Adventure', rating: 4.8, duration: '6 hours', price: 'AED 200', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400', description: 'Dune bashing, camel rides, and BBQ dinner. An unforgettable Arabian desert experience.', highlights: ['Dune bashing', 'Camel riding', 'BBQ dinner', 'Belly dancing show'], openingHours: '3:00 PM - 9:00 PM', address: 'Dubai Desert', lat: 24.99, lng: 55.35 },
            ],
            Goa: [
                { id: '1', name: 'Baga Beach', category: 'Beach', rating: 4.5, duration: '3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', description: 'Popular beach known for nightlife and water sports.', highlights: ['Beach shacks', 'Water sports', 'Nightlife', 'Seafood'], openingHours: 'Open 24 hours', address: 'Baga, North Goa', lat: 15.5523, lng: 73.7517 },
                { id: '2', name: 'Fort Aguada', category: 'Heritage', rating: 4.6, duration: '2 hours', price: '₹25', image: 'https://images.unsplash.com/photo-1582972236019-ea4af5edd6d9?w=400', description: '17th-century Portuguese fort with stunning sea views and a lighthouse.', highlights: ['Lighthouse', 'Sea views', 'Portuguese history', 'Photography'], openingHours: '9:00 AM - 5:30 PM', address: 'Candolim, North Goa', lat: 15.4916, lng: 73.7736 },
                { id: '3', name: 'Anjuna Flea Market', category: 'Shopping', rating: 4.4, duration: '2-3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400', description: 'Famous Wednesday market with handicrafts, clothes, and souvenirs.', highlights: ['Handicrafts', 'Live music', 'Food stalls', 'Local art'], openingHours: '8:00 AM - 6:00 PM (Wed)', address: 'Anjuna, North Goa', lat: 15.577, lng: 73.7394 },
                { id: '4', name: 'Basilica of Bom Jesus', category: 'Heritage', rating: 4.7, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', description: 'UNESCO World Heritage Site housing the remains of St. Francis Xavier.', highlights: ['UNESCO site', 'Baroque architecture', 'Religious art', 'History museum'], openingHours: '9:00 AM - 6:30 PM', address: 'Old Goa', lat: 15.5009, lng: 73.9116 },
                { id: '5', name: 'Palolem Beach', category: 'Beach', rating: 4.6, duration: '3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', description: 'Crescent-shaped beach with calm waters and beach huts.', highlights: ['Calm waters', 'Beach huts', 'Dolphin trips', 'Kayaking'], openingHours: 'Open 24 hours', address: 'Canacona, South Goa', lat: 15.01, lng: 74.0232 },
                { id: '6', name: 'Dudhsagar Falls', category: 'Nature', rating: 4.8, duration: '6 hours', price: '₹400', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400', description: "Four-tiered waterfall on the Mandovi River, one of India's tallest.", highlights: ['Waterfall trek', 'Jeep safari', 'Natural pool', 'Wildlife'], openingHours: '8:00 AM - 5:00 PM', address: 'Sanguem, South Goa', lat: 15.3144, lng: 74.3143 },
            ],
        };

        const cityName = dest.split(',')[0].trim();
        return attractionsMap[cityName] || attractionsMap.Paris;
    };

    const attractions = getAttractions(destination);

    const toggleSelection = (id: string) => {
        setSelectedAttractionIds((prev) =>
            prev.includes(id)
                ? prev.filter((a) => a !== id)
                : [...prev, id]
        );
    };

    const openModal = (attraction: Attraction) => {
        setModalAttraction(attraction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAttraction(null);
    };

    const getSelectedAttractions = (): Attraction[] => attractions.filter((a) => selectedAttractionIds.includes(a.id));

    return (
        <div className="interactive-card attractions">
            <div className="attractions-header">
                <div className="interactive-card-header">
                    <Star size={20} className="text-[var(--color-primary)]" />
                    <h3>Top Attractions in {destination.split(',')[0]}</h3>
                </div>
                <p className="interactive-card-subtitle">
                    Select the places you'd like to visit ({selectedAttractionIds.length} selected)
                </p>
            </div>

            <div className="attractions-scroll-container">
                <div className="attractions-grid">
                    {attractions.map((attraction) => {
                        const isSelected = selectedAttractionIds.includes(attraction.id);
                        return (
                            <motion.div
                                key={attraction.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`attraction-card ${isSelected ? 'selected' : ''}`}
                            >
                                <button
                                    className={`attraction-select-btn ${isSelected ? 'selected' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(attraction.id);
                                    }}
                                >
                                    {isSelected ? <CheckCircle2 size={20} /> : <div className="attraction-select-circle" />}
                                </button>

                                <div className="attraction-card-clickable" onClick={() => openModal(attraction)}>
                                    <div className="attraction-image">
                                        <img src={attraction.image} alt={attraction.name} />
                                        <span className="attraction-category">{attraction.category}</span>
                                    </div>
                                    <div className="attraction-content">
                                        <h4>{attraction.name}</h4>
                                        <p className="attraction-desc">{attraction.description}</p>
                                        <div className="attraction-meta">
                                            <span className="attraction-rating">
                                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                {attraction.rating}
                                            </span>
                                            <span className="attraction-duration">
                                                <Clock size={14} />
                                                {attraction.duration}
                                            </span>
                                            <span className="attraction-price">{attraction.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="attractions-sticky-footer">
                <button
                    onClick={() => onContinue(getSelectedAttractions())}
                    className="generate-itinerary-btn"
                    disabled={selectedAttractionIds.length === 0}
                >
                    <Sparkles size={20} />
                    {selectedAttractionIds.length > 0
                        ? `Generate Itinerary (${selectedAttractionIds.length} selected)`
                        : 'Select attractions to generate itinerary'}
                </button>
            </div>

            <AttractionModal
                attraction={modalAttraction}
                isOpen={isModalOpen}
                onClose={closeModal}
                isSelected={modalAttraction ? selectedAttractionIds.includes(modalAttraction.id) : false}
                onToggleSelect={() => modalAttraction && toggleSelection(modalAttraction.id)}
            />
        </div>
    );
};
