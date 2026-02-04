import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot, User, Users, Heart,
    DollarSign, Calendar, MapPin, Sparkles, Check,
    Train, Car, Plane, Bus, Navigation, Star, Clock,
    X, Ticket, Info, CheckCircle2
} from 'lucide-react';
import { ItineraryDisplay, ItinerarySkeleton } from '../components/organisms/ItineraryDisplay';
import { ChatRenderer } from '../components/renderer/ChatRenderer';
import type { UIResponse } from '../types/ui-schema';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface TripPreferences {
    destination: string | null;
    companions: string | null;
    budget: string | null;
    dates: string | null;
    currentLocation: string | null;
    transportMode: string | null;
    interests: string[];
}

// Itinerary types from backend
interface DayPlan {
    day: number;
    type?: 'travel' | 'leisure';
    description?: string;
    region?: string;
    activities?: string[];
    totalDurationHours?: number;
}

interface ItineraryOutput {
    destination: string;
    totalDays: number;
    dailyPlan: DayPlan[];
    unassignedAttractions?: string[];
    warnings?: string[];
}

interface Message {
    id: string;
    type: 'ai' | 'user' | 'interactive';
    content?: string;
    blocks?: UIResponse;
    interactiveType?: 'destination' | 'companions' | 'budget' | 'dates' | 'location' | 'transport' | 'attractions' | 'interests' | 'summary' | 'itinerary';
    timestamp: Date;
    itineraryData?: ItineraryOutput;
    isLoading?: boolean;
}

// Interactive card components
const DestinationCard: React.FC<{
    onSelect: (destination: string) => void;
    selected: string | null;
}> = ({ onSelect, selected }) => {
    const [inputValue, setInputValue] = useState(selected || '');

    const destinations = [
        { id: 'paris', label: 'Paris, France', emoji: '🗼' },
        { id: 'tokyo', label: 'Tokyo, Japan', emoji: '🗾' },
        { id: 'bali', label: 'Bali, Indonesia', emoji: '🏝️' },
        { id: 'dubai', label: 'Dubai, UAE', emoji: '🏙️' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <MapPin size={20} className="text-[var(--color-primary)]" />
                <h3>Where do you want to go?</h3>
            </div>
            <p className="interactive-card-subtitle">Enter a destination or choose from popular options</p>

            <div className="interactive-input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., Paris, Bali, Tokyo..."
                    className="interactive-input"
                />
                {inputValue && (
                    <button
                        onClick={() => onSelect(inputValue)}
                        className="interactive-input-btn"
                    >
                        <Check size={18} />
                    </button>
                )}
            </div>

            <div className="interactive-options-row">
                {destinations.map((dest) => (
                    <button
                        key={dest.id}
                        onClick={() => {
                            setInputValue(dest.label);
                            onSelect(dest.label);
                        }}
                        className={`interactive-chip ${selected === dest.label ? 'selected' : ''}`}
                    >
                        <span>{dest.emoji}</span>
                        <span>{dest.label.split(',')[0]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const CompanionsCard: React.FC<{
    onSelect: (companions: string) => void;
    selected: string | null;
}> = ({ onSelect, selected }) => {
    const options = [
        { id: 'solo', label: 'Solo', icon: User },
        { id: 'couple', label: 'Couple', icon: Heart },
        { id: 'family', label: 'Family', icon: Users },
        { id: 'friends', label: 'Friends', icon: Users },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Users size={20} className="text-[var(--color-primary)]" />
                <h3>Travel Companions</h3>
            </div>
            <p className="interactive-card-subtitle">Select your travel group type</p>

            <div className="interactive-options-grid">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id)}
                            className={`interactive-option-card ${selected === opt.id ? 'selected' : ''}`}
                        >
                            <Icon size={24} />
                            <span>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const BudgetCard: React.FC<{
    onSelect: (budget: string) => void;
    selected: string | null;
}> = ({ onSelect, selected }) => {
    const options = [
        { id: 'economy', label: 'Economy', emoji: '💵', color: '#22C55E' },
        { id: 'normal', label: 'Normal', emoji: '💰', color: '#F59E0B' },
        { id: 'luxury', label: 'Luxury', emoji: '💎', color: '#A855F7' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <DollarSign size={20} className="text-[var(--color-primary)]" />
                <h3>Your Budget</h3>
            </div>
            <p className="interactive-card-subtitle">Select your preferred budget type</p>

            <div className="interactive-options-grid three-col">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className={`interactive-option-card ${selected === opt.id ? 'selected' : ''}`}
                        style={{ '--option-color': opt.color } as React.CSSProperties}
                    >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const DatesCard: React.FC<{
    onSelect: (dates: string) => void;
    selected: string | null;
}> = ({ onSelect, selected }) => {
    const [month, setMonth] = useState('');
    const [duration, setDuration] = useState('');

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const durations = ['3 days', '5 days', '1 week', '2 weeks'];

    const handleConfirm = () => {
        if (month && duration) {
            onSelect(`${duration} in ${month}`);
        }
    };

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Calendar size={20} className="text-[var(--color-primary)]" />
                <h3>When are you traveling?</h3>
            </div>
            <p className="interactive-card-subtitle">Select month and duration</p>

            <div className="interactive-select-group">
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="interactive-select"
                >
                    <option value="">Select month</option>
                    {months.map((m) => (
                        <option key={m} value={m}>{m} 2026</option>
                    ))}
                </select>

                <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="interactive-select"
                >
                    <option value="">Select duration</option>
                    {durations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {month && duration && (
                <button onClick={handleConfirm} className="interactive-confirm-btn">
                    <Check size={18} />
                    Confirm: {duration} in {month}
                </button>
            )}
        </div>
    );
};

// NEW: Location Card - Where are you from?
const LocationCard: React.FC<{
    onSelect: (location: string) => void;
    selected: string | null;
}> = ({ onSelect, selected }) => {
    const [inputValue, setInputValue] = useState(selected || '');

    const popularLocations = [
        { id: 'delhi', label: 'Delhi, India', emoji: '🇮🇳' },
        { id: 'mumbai', label: 'Mumbai, India', emoji: '🇮🇳' },
        { id: 'bangalore', label: 'Bangalore, India', emoji: '🇮🇳' },
        { id: 'chennai', label: 'Chennai, India', emoji: '🇮🇳' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Navigation size={20} className="text-[var(--color-primary)]" />
                <h3>Where are you from?</h3>
            </div>
            <p className="interactive-card-subtitle">Enter your current location for better travel planning</p>

            <div className="interactive-input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., Delhi, Mumbai, New York..."
                    className="interactive-input"
                />
                {inputValue && (
                    <button
                        onClick={() => onSelect(inputValue)}
                        className="interactive-input-btn"
                    >
                        <Check size={18} />
                    </button>
                )}
            </div>

            <div className="interactive-options-row">
                {popularLocations.map((loc) => (
                    <button
                        key={loc.id}
                        onClick={() => {
                            setInputValue(loc.label);
                            onSelect(loc.label);
                        }}
                        className={`interactive-chip ${selected === loc.label ? 'selected' : ''}`}
                    >
                        <span>{loc.emoji}</span>
                        <span>{loc.label.split(',')[0]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// NEW: Transport Mode Card
const TransportCard: React.FC<{
    onSelect: (transport: string) => void;
    selected: string | null;
}> = ({ onSelect, selected }) => {
    const options = [
        { id: 'public', label: 'Public Transport', icon: Bus, color: '#22C55E', emoji: '🚌' },
        { id: 'train', label: 'Train', icon: Train, color: '#3B82F6', emoji: '🚆' },
        { id: 'private', label: 'Private Vehicle', icon: Car, color: '#A855F7', emoji: '🚗' },
        { id: 'flight', label: 'Flight', icon: Plane, color: '#F97316', emoji: '✈️' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Car size={20} className="text-[var(--color-primary)]" />
                <h3>Mode of Transportation</h3>
            </div>
            <p className="interactive-card-subtitle">How would you like to travel?</p>

            <div className="interactive-options-grid">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id)}
                            className={`interactive-option-card ${selected === opt.id ? 'selected' : ''}`}
                            style={{ '--option-color': opt.color } as React.CSSProperties}
                        >
                            <Icon size={28} style={{ color: selected === opt.id ? 'white' : opt.color }} />
                            <span>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// NEW: Attractions Card
interface Attraction {
    id: string;
    name: string;
    category: string;
    rating: number;
    duration: string;
    price: string;
    image: string;
    description: string;
    highlights?: string[];
    openingHours?: string;
    address?: string;
    lat?: number;
    lng?: number;
}

// Attraction Detail Modal Component
const AttractionModal: React.FC<{
    attraction: Attraction | null;
    isOpen: boolean;
    onClose: () => void;
    isSelected: boolean;
    onToggleSelect: () => void;
}> = ({ attraction, isOpen, onClose, isSelected, onToggleSelect }) => {
    if (!isOpen || !attraction) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="attraction-modal-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="attraction-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header with Image */}
                    <div className="attraction-modal-image">
                        <img src={attraction.image} alt={attraction.name} />
                        <div className="attraction-modal-image-overlay" />
                        <button className="attraction-modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                        <span className="attraction-modal-category">{attraction.category}</span>
                    </div>

                    {/* Modal Content */}
                    <div className="attraction-modal-content">
                        <div className="attraction-modal-header">
                            <h2>{attraction.name}</h2>
                            <div className="attraction-modal-rating">
                                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                                <span>{attraction.rating}</span>
                            </div>
                        </div>

                        <p className="attraction-modal-desc">{attraction.description}</p>

                        {/* Info Grid */}
                        <div className="attraction-modal-info-grid">
                            <div className="attraction-modal-info-item">
                                <Clock size={18} />
                                <div>
                                    <span className="label">Duration</span>
                                    <span className="value">{attraction.duration}</span>
                                </div>
                            </div>
                            <div className="attraction-modal-info-item">
                                <Ticket size={18} />
                                <div>
                                    <span className="label">Entry Fee</span>
                                    <span className="value">{attraction.price}</span>
                                </div>
                            </div>
                            <div className="attraction-modal-info-item">
                                <MapPin size={18} />
                                <div>
                                    <span className="label">Location</span>
                                    <span className="value">{attraction.address || 'City Center'}</span>
                                </div>
                            </div>
                            <div className="attraction-modal-info-item">
                                <Info size={18} />
                                <div>
                                    <span className="label">Hours</span>
                                    <span className="value">{attraction.openingHours || '9AM - 6PM'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Highlights */}
                        {attraction.highlights && attraction.highlights.length > 0 && (
                            <div className="attraction-modal-highlights">
                                <h4>Highlights</h4>
                                <ul>
                                    {attraction.highlights.map((highlight, index) => (
                                        <li key={index}>
                                            <Check size={14} />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="attraction-modal-actions">
                            <button
                                className={`attraction-modal-select-btn ${isSelected ? 'selected' : ''}`}
                                onClick={onToggleSelect}
                            >
                                {isSelected ? (
                                    <>
                                        <CheckCircle2 size={20} />
                                        Added to Trip
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Add to Trip
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const AttractionsCard: React.FC<{
    destination: string;
    onContinue: (selectedAttractions: Attraction[]) => void;
}> = ({ destination, onContinue }) => {
    const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>([]);
    const [modalAttraction, setModalAttraction] = useState<Attraction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock attractions based on destination
    const getAttractions = (dest: string): Attraction[] => {
        const attractionsMap: Record<string, Attraction[]> = {
            'Paris': [
                { id: '1', name: 'Eiffel Tower', category: 'Landmark', rating: 4.8, duration: '2-3 hours', price: '€26', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400', description: 'Iconic iron lattice tower on the Champ de Mars. The most visited paid monument in the world, offering stunning panoramic views of Paris from its observation decks.', highlights: ['360° city views', 'Restaurant on 2nd floor', 'Light show at night', 'Skip-the-line tickets available'], openingHours: '9:30 AM - 11:45 PM', address: 'Champ de Mars, Paris', lat: 48.8584, lng: 2.2945 },
                { id: '2', name: 'Louvre Museum', category: 'Museum', rating: 4.9, duration: '3-4 hours', price: '€17', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', description: 'World\'s largest art museum and historic monument. Home to thousands of works including the Mona Lisa and Venus de Milo.', highlights: ['Mona Lisa', 'Venus de Milo', 'Egyptian antiquities', 'French paintings'], openingHours: '9:00 AM - 6:00 PM', address: 'Rue de Rivoli, Paris', lat: 48.8606, lng: 2.3376 },
                { id: '3', name: 'Notre-Dame Cathedral', category: 'Historical', rating: 4.7, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1478391679764-b2d8b3cd1e94?w=400', description: 'Medieval Catholic cathedral on the Île de la Cité. A masterpiece of French Gothic architecture currently under restoration.', highlights: ['Gothic architecture', 'Rose windows', 'Bell towers', 'River Seine views'], openingHours: '8:00 AM - 6:45 PM', address: 'Île de la Cité, Paris', lat: 48.8530, lng: 2.3499 },
                { id: '4', name: 'Montmartre', category: 'Neighborhood', rating: 4.6, duration: '2-3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400', description: 'Historic hilltop district known for Sacré-Cœur Basilica, artistic heritage, and charming cobblestone streets.', highlights: ['Sacré-Cœur Basilica', 'Artist Square', 'Vineyard', 'Panoramic views'], openingHours: 'Open 24 hours', address: 'Montmartre, Paris', lat: 48.8867, lng: 2.3431 },
            ],
            'Tokyo': [
                { id: '1', name: 'Senso-ji Temple', category: 'Temple', rating: 4.8, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=400', description: 'Ancient Buddhist temple in Asakusa. Tokyo\'s oldest temple with a vibrant shopping street leading to its gates.', highlights: ['Thunder Gate', 'Nakamise shopping street', 'Five-story pagoda', 'Fortune slips'], openingHours: '6:00 AM - 5:00 PM', address: 'Asakusa, Tokyo', lat: 35.7148, lng: 139.7967 },
                { id: '2', name: 'Tokyo Skytree', category: 'Landmark', rating: 4.7, duration: '2-3 hours', price: '¥2,100', image: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=400', description: 'Tallest tower in Japan with observation decks offering breathtaking views of Tokyo and beyond.', highlights: ['Tembo Deck (350m)', 'Tembo Galleria (450m)', 'Shopping complex', 'Aquarium'], openingHours: '10:00 AM - 9:00 PM', address: 'Sumida, Tokyo', lat: 35.7101, lng: 139.8107 },
                { id: '3', name: 'Shibuya Crossing', category: 'Attraction', rating: 4.5, duration: '30 mins', price: 'Free', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400', description: 'Famous scramble crossing in Shibuya. One of the busiest pedestrian crossings in the world.', highlights: ['Iconic photo spot', 'Hachiko statue nearby', 'Shopping district', 'Night atmosphere'], openingHours: 'Open 24 hours', address: 'Shibuya, Tokyo', lat: 35.6595, lng: 139.7004 },
                { id: '4', name: 'Meiji Shrine', category: 'Shrine', rating: 4.8, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1583766395091-2eb9994ed094?w=400', description: 'Shinto shrine dedicated to Emperor Meiji. A peaceful forest oasis in the heart of busy Tokyo.', highlights: ['Forest walk', 'Traditional ceremonies', 'Sake barrels', 'Wishes board'], openingHours: 'Sunrise to Sunset', address: 'Shibuya, Tokyo', lat: 35.6764, lng: 139.6993 },
            ],
            'Bali': [
                { id: '1', name: 'Tanah Lot Temple', category: 'Temple', rating: 4.7, duration: '2-3 hours', price: 'IDR 60k', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', description: 'Iconic sea temple on a rock formation. One of Bali\'s most important landmarks and popular sunset spot.', highlights: ['Sunset views', 'Sea temple', 'Cultural performances', 'Local market'], openingHours: '7:00 AM - 7:00 PM', address: 'Tabanan, Bali', lat: -8.6212, lng: 115.0868 },
                { id: '2', name: 'Ubud Rice Terraces', category: 'Nature', rating: 4.8, duration: '2-3 hours', price: 'IDR 80k', image: 'https://images.unsplash.com/photo-1531592937781-344ad608fabf?w=400', description: 'Stunning terraced rice paddies in Tegallalang. A UNESCO World Heritage site showcasing traditional Balinese irrigation.', highlights: ['Photo opportunities', 'Jungle swing', 'Coffee plantation', 'Local crafts'], openingHours: '8:00 AM - 6:00 PM', address: 'Tegallalang, Ubud', lat: -8.4312, lng: 115.2791 },
                { id: '3', name: 'Uluwatu Temple', category: 'Temple', rating: 4.6, duration: '2-3 hours', price: 'IDR 50k', image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400', description: 'Clifftop temple with ocean views and traditional Kecak fire dance performances at sunset.', highlights: ['Cliff views', 'Kecak dance', 'Monkey forest', 'Sunset spot'], openingHours: '7:00 AM - 7:00 PM', address: 'Uluwatu, Bali', lat: -8.8291, lng: 115.0849 },
                { id: '4', name: 'Seminyak Beach', category: 'Beach', rating: 4.5, duration: '3-4 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1559628233-100c798642d4?w=400', description: 'Popular beach with bars and sunset views. Known for its upscale resorts, restaurants, and vibrant nightlife.', highlights: ['Beach clubs', 'Surfing', 'Sunset views', 'Fine dining'], openingHours: 'Open 24 hours', address: 'Seminyak, Bali', lat: -8.6913, lng: 115.1548 },
            ],
            'Dubai': [
                { id: '1', name: 'Burj Khalifa', category: 'Landmark', rating: 4.9, duration: '2-3 hours', price: 'AED 149', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', description: 'World\'s tallest building with observation decks. Standing at 828m, it offers unparalleled views of Dubai.', highlights: ['At The Top observation', '148th floor lounge', 'Dubai Fountain views', 'Sunset timing'], openingHours: '8:30 AM - 11:00 PM', address: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
                { id: '2', name: 'Dubai Mall', category: 'Shopping', rating: 4.7, duration: '4-5 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', description: 'One of the world\'s largest shopping malls with 1,200+ stores, aquarium, and ice rink.', highlights: ['Dubai Aquarium', 'Ice rink', 'Fountain show', 'Luxury brands'], openingHours: '10:00 AM - 12:00 AM', address: 'Downtown Dubai', lat: 25.1985, lng: 55.2796 },
                { id: '3', name: 'Palm Jumeirah', category: 'Attraction', rating: 4.6, duration: '3-4 hours', price: 'Varies', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=400', description: 'Iconic palm-shaped artificial island. Home to luxury hotels, apartments, and entertainment venues.', highlights: ['Atlantis resort', 'Beach clubs', 'Monorail ride', 'Water sports'], openingHours: 'Open 24 hours', address: 'Palm Jumeirah, Dubai', lat: 25.1124, lng: 55.1390 },
                { id: '4', name: 'Desert Safari', category: 'Adventure', rating: 4.8, duration: '6 hours', price: 'AED 200', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400', description: 'Dune bashing, camel rides, and BBQ dinner. An unforgettable Arabian desert experience.', highlights: ['Dune bashing', 'Camel riding', 'BBQ dinner', 'Belly dancing show'], openingHours: '3:00 PM - 9:00 PM', address: 'Dubai Desert', lat: 24.9900, lng: 55.3500 },
            ],
            'Goa': [
                { id: '1', name: 'Baga Beach', category: 'Beach', rating: 4.5, duration: '3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400', description: 'Popular beach known for nightlife and water sports.', highlights: ['Beach shacks', 'Water sports', 'Nightlife', 'Seafood'], openingHours: 'Open 24 hours', address: 'Baga, North Goa', lat: 15.5523, lng: 73.7517 },
                { id: '2', name: 'Fort Aguada', category: 'Heritage', rating: 4.6, duration: '2 hours', price: '₹25', image: 'https://images.unsplash.com/photo-1582972236019-ea4af5edd6d9?w=400', description: '17th-century Portuguese fort with stunning sea views and a lighthouse.', highlights: ['Lighthouse', 'Sea views', 'Portuguese history', 'Photography'], openingHours: '9:00 AM - 5:30 PM', address: 'Candolim, North Goa', lat: 15.4916, lng: 73.7736 },
                { id: '3', name: 'Anjuna Flea Market', category: 'Shopping', rating: 4.4, duration: '2-3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400', description: 'Famous Wednesday market with handicrafts, clothes, and souvenirs.', highlights: ['Handicrafts', 'Live music', 'Food stalls', 'Local art'], openingHours: '8:00 AM - 6:00 PM (Wed)', address: 'Anjuna, North Goa', lat: 15.5770, lng: 73.7394 },
                { id: '4', name: 'Basilica of Bom Jesus', category: 'Heritage', rating: 4.7, duration: '1-2 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', description: 'UNESCO World Heritage Site housing the remains of St. Francis Xavier.', highlights: ['UNESCO site', 'Baroque architecture', 'Religious art', 'History museum'], openingHours: '9:00 AM - 6:30 PM', address: 'Old Goa', lat: 15.5009, lng: 73.9116 },
                { id: '5', name: 'Palolem Beach', category: 'Beach', rating: 4.6, duration: '3 hours', price: 'Free', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', description: 'Crescent-shaped beach with calm waters and beach huts.', highlights: ['Calm waters', 'Beach huts', 'Dolphin trips', 'Kayaking'], openingHours: 'Open 24 hours', address: 'Canacona, South Goa', lat: 15.0100, lng: 74.0232 },
                { id: '6', name: 'Dudhsagar Falls', category: 'Nature', rating: 4.8, duration: '6 hours', price: '₹400', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400', description: 'Four-tiered waterfall on the Mandovi River, one of India\'s tallest.', highlights: ['Waterfall trek', 'Jeep safari', 'Natural pool', 'Wildlife'], openingHours: '8:00 AM - 5:00 PM', address: 'Sanguem, South Goa', lat: 15.3144, lng: 74.3143 },
            ],
        };

        // Get city name from destination
        const cityName = dest.split(',')[0].trim();
        return attractionsMap[cityName] || attractionsMap['Paris']; // Default to Paris
    };

    const attractions = getAttractions(destination);

    const toggleSelection = (id: string) => {
        setSelectedAttractionIds(prev =>
            prev.includes(id)
                ? prev.filter(a => a !== id)
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

    // Get selected attraction objects for the API call
    const getSelectedAttractions = (): Attraction[] => {
        return attractions.filter(a => selectedAttractionIds.includes(a.id));
    };

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
                                {/* Selection Checkbox */}
                                <button
                                    className={`attraction-select-btn ${isSelected ? 'selected' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(attraction.id);
                                    }}
                                >
                                    {isSelected ? <CheckCircle2 size={20} /> : <div className="attraction-select-circle" />}
                                </button>

                                {/* Card Content - Clickable for Modal */}
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
                        : 'Select attractions to generate itinerary'
                    }
                </button>
            </div>

            {/* Attraction Detail Modal */}
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

const InterestsCard: React.FC<{
    onSelect: (interests: string[]) => void;
    selectedInterests: string[];
}> = ({ onSelect, selectedInterests }) => {
    const [interests, setInterests] = useState<string[]>(selectedInterests);

    const options = [
        { id: 'historical', label: 'Historical', emoji: '🏛️' },
        { id: 'culture', label: 'Art & Culture', emoji: '🎨' },
        { id: 'nature', label: 'Nature', emoji: '🌿' },
        { id: 'food', label: 'Food & Dining', emoji: '🍽️' },
        { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
        { id: 'adventure', label: 'Adventure', emoji: '🧗' },
        { id: 'nightlife', label: 'Nightlife', emoji: '🎉' },
        { id: 'relaxation', label: 'Relaxation', emoji: '🧘' },
    ];

    const toggleInterest = (id: string) => {
        const newInterests = interests.includes(id)
            ? interests.filter(i => i !== id)
            : [...interests, id];
        setInterests(newInterests);
    };

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Sparkles size={20} className="text-[var(--color-primary)]" />
                <h3>Your Interests</h3>
            </div>
            <p className="interactive-card-subtitle">Select activities you enjoy (at least 2)</p>

            <div className="interactive-interests-grid">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => toggleInterest(opt.id)}
                        className={`interactive-interest-chip ${interests.includes(opt.id) ? 'selected' : ''}`}
                    >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>

            {interests.length >= 2 && (
                <button onClick={() => onSelect(interests)} className="interactive-confirm-btn">
                    <Check size={18} />
                    Confirm {interests.length} interests
                </button>
            )}
        </div>
    );
};

const TripSummaryCard: React.FC<{ preferences: TripPreferences }> = ({ preferences }) => {
    const transportLabels: Record<string, string> = {
        public: 'Public Transport',
        train: 'Train',
        private: 'Private Vehicle',
        flight: 'Flight'
    };

    return (
        <div className="interactive-card summary">
            <div className="interactive-card-header">
                <Sparkles size={20} className="text-white" />
                <h3 className="text-white">Trip Summary</h3>
            </div>

            <div className="summary-items">
                <div className="summary-item">
                    <MapPin size={16} />
                    <span>{preferences.destination || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <Users size={16} />
                    <span>{preferences.companions || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <DollarSign size={16} />
                    <span>{preferences.budget || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <Calendar size={16} />
                    <span>{preferences.dates || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <Navigation size={16} />
                    <span>From: {preferences.currentLocation || 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <Car size={16} />
                    <span>Transport: {preferences.transportMode ? transportLabels[preferences.transportMode] : 'Not selected'}</span>
                </div>
                <div className="summary-item">
                    <Sparkles size={16} />
                    <span>{preferences.interests.join(', ') || 'Not selected'}</span>
                </div>
            </div>
        </div>
    );
};

interface ChatScreenProps {
    onNavigate?: (tab: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [preferences, setPreferences] = useState<TripPreferences>({
        destination: null,
        companions: null,
        budget: null,
        dates: null,
        currentLocation: null,
        transportMode: null,
        interests: [],
    });
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize with welcome message and first interactive card
    useEffect(() => {
        const initMessages: Message[] = [
            {
                id: '1',
                type: 'ai',
                content: "Hey there! ✨ I'm your AI travel companion. Let's plan your perfect trip together!",
                timestamp: new Date()
            },
            {
                id: '2',
                type: 'interactive',
                interactiveType: 'destination',
                timestamp: new Date()
            }
        ];
        setMessages(initMessages);
    }, []);

    const handleDestinationSelect = (destination: string) => {
        setPreferences(prev => ({ ...prev, destination }));
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', content: `I want to go to ${destination}`, timestamp: new Date() },
            { id: (Date.now() + 1).toString(), type: 'ai', content: `Great choice! ${destination} is amazing! 🌟 Who are you traveling with?`, timestamp: new Date() },
            { id: (Date.now() + 2).toString(), type: 'interactive', interactiveType: 'companions', timestamp: new Date() }
        ]);
        setCurrentStep(1);
    };

    const handleCompanionsSelect = (companions: string) => {
        setPreferences(prev => ({ ...prev, companions }));
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', content: `I'm traveling ${companions}`, timestamp: new Date() },
            { id: (Date.now() + 1).toString(), type: 'ai', content: `Sounds fun! Now let's talk budget 💰`, timestamp: new Date() },
            { id: (Date.now() + 2).toString(), type: 'interactive', interactiveType: 'budget', timestamp: new Date() }
        ]);
        setCurrentStep(2);
    };

    const handleBudgetSelect = (budget: string) => {
        setPreferences(prev => ({ ...prev, budget }));
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', content: `My budget is ${budget}`, timestamp: new Date() },
            { id: (Date.now() + 1).toString(), type: 'ai', content: `Perfect! When are you planning to travel? 📅`, timestamp: new Date() },
            { id: (Date.now() + 2).toString(), type: 'interactive', interactiveType: 'dates', timestamp: new Date() }
        ]);
        setCurrentStep(3);
    };

    const handleDatesSelect = (dates: string) => {
        setPreferences(prev => ({ ...prev, dates }));
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', content: `I'm planning for ${dates}`, timestamp: new Date() },
            { id: (Date.now() + 1).toString(), type: 'ai', content: `Great! Now, where are you from? 📍 This helps us plan the best travel route for you.`, timestamp: new Date() },
            { id: (Date.now() + 2).toString(), type: 'interactive', interactiveType: 'location', timestamp: new Date() }
        ]);
        setCurrentStep(4);
    };

    const handleLocationSelect = (location: string) => {
        setPreferences(prev => ({ ...prev, currentLocation: location }));
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', content: `I'm from ${location}`, timestamp: new Date() },
            { id: (Date.now() + 1).toString(), type: 'ai', content: `Perfect! How would you like to travel from ${location}? 🚀`, timestamp: new Date() },
            { id: (Date.now() + 2).toString(), type: 'interactive', interactiveType: 'transport', timestamp: new Date() }
        ]);
        setCurrentStep(5);
    };

    const handleTransportSelect = (transport: string) => {
        const transportLabels: Record<string, string> = {
            public: 'Public Transport',
            train: 'Train',
            private: 'Private Vehicle',
            flight: 'Flight'
        };
        setPreferences(prev => ({ ...prev, transportMode: transport }));
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', content: `I'll travel by ${transportLabels[transport]}`, timestamp: new Date() },
            { id: (Date.now() + 1).toString(), type: 'ai', content: `Great choice! Now tell me about your interests 🎯`, timestamp: new Date() },
            { id: (Date.now() + 2).toString(), type: 'interactive', interactiveType: 'interests', timestamp: new Date() }
        ]);
        setCurrentStep(6);
    };

    const handleInterestsSelect = (interests: string[]) => {
        const updatedPrefs = { ...preferences, interests };
        setPreferences(updatedPrefs);
        setMessages(prev => [
            ...prev,
            { id: Date.now().toString(), type: 'user', content: `I'm interested in ${interests.join(', ')}`, timestamp: new Date() },
            { id: (Date.now() + 1).toString(), type: 'ai', content: `Excellent! 🎉 Here are the top attractions at your destination that you must visit!`, timestamp: new Date() },
            { id: (Date.now() + 2).toString(), type: 'interactive', interactiveType: 'attractions', timestamp: new Date() }
        ]);
        setCurrentStep(7);
    };

    const handleAttractionsContinue = async (selectedAttractions: Attraction[]) => {
        const attractionCount = selectedAttractions.length;
        
        // Add user message and loading state
        const loadingMsgId = (Date.now() + 2).toString();
        setMessages(prev => [
            ...prev,
            { 
                id: Date.now().toString(), 
                type: 'user', 
                content: attractionCount > 0 
                    ? `I've selected ${attractionCount} attraction${attractionCount > 1 ? 's' : ''}: ${selectedAttractions.map(a => a.name).join(', ')}` 
                    : 'Continuing without selecting attractions', 
                timestamp: new Date() 
            },
            { 
                id: (Date.now() + 1).toString(), 
                type: 'ai', 
                content: attractionCount > 0 
                    ? `✨ Great choices! Let me generate a personalized itinerary for you...`
                    : `✨ Let me generate your trip itinerary...`, 
                timestamp: new Date() 
            },
            { 
                id: loadingMsgId, 
                type: 'interactive', 
                interactiveType: 'itinerary', 
                timestamp: new Date(),
                isLoading: true 
            }
        ]);
        setCurrentStep(8);

        try {
            // Call the itinerary API
            const response = await fetch(`${API_BASE_URL}/api/itinerary`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    startLocation: preferences.currentLocation || 'Delhi, India',
                    destination: preferences.destination || 'Paris, France',
                    dates: preferences.dates || '1 week in March',
                    transportMode: preferences.transportMode || 'public',
                    selectedAttractions: selectedAttractions.map(a => ({
                        id: a.id,
                        name: a.name,
                        category: a.category,
                        duration: a.duration,
                        lat: a.lat,
                        lng: a.lng,
                    })),
                    preferences: {
                        companions: preferences.companions,
                        budget: preferences.budget,
                        interests: preferences.interests,
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate itinerary');
            }

            const data = await response.json();
            
            if (data.success && data.itinerary) {
                // Update the loading message with the actual itinerary
                setMessages(prev => prev.map(msg => 
                    msg.id === loadingMsgId 
                        ? { 
                            ...msg, 
                            isLoading: false, 
                            itineraryData: data.itinerary 
                          }
                        : msg
                ));
            } else {
                throw new Error(data.error || 'Failed to generate itinerary');
            }
        } catch (error) {
            console.error('Itinerary generation error:', error);
            // Update the loading message to show error/fallback
            setMessages(prev => prev.map(msg => 
                msg.id === loadingMsgId 
                    ? { 
                        ...msg, 
                        type: 'ai' as const,
                        interactiveType: undefined,
                        isLoading: false,
                        content: `❌ Sorry, I couldn't generate the itinerary right now. Please make sure the server is running and try again.`
                      }
                    : msg
            ));
        }
    };

    const renderInteractiveCard = (type: string) => {
        switch (type) {
            case 'destination':
                return <DestinationCard onSelect={handleDestinationSelect} selected={preferences.destination} />;
            case 'companions':
                return <CompanionsCard onSelect={handleCompanionsSelect} selected={preferences.companions} />;
            case 'budget':
                return <BudgetCard onSelect={handleBudgetSelect} selected={preferences.budget} />;
            case 'dates':
                return <DatesCard onSelect={handleDatesSelect} selected={preferences.dates} />;
            case 'location':
                return <LocationCard onSelect={handleLocationSelect} selected={preferences.currentLocation} />;
            case 'transport':
                return <TransportCard onSelect={handleTransportSelect} selected={preferences.transportMode} />;
            case 'attractions':
                return <AttractionsCard destination={preferences.destination || 'Paris'} onContinue={handleAttractionsContinue} />;
            case 'interests':
                return <InterestsCard onSelect={handleInterestsSelect} selectedInterests={preferences.interests} />;
            case 'summary':
                return <TripSummaryCard preferences={preferences} />;
            case 'itinerary':
                return null; // Handled separately in the message render
            default:
                return null;
        }
    };

    const renderMessage = (message: Message) => {
        // Special handling for itinerary messages
        if (message.interactiveType === 'itinerary') {
            if (message.isLoading) {
                return (
                    <div className="mobile-chat-interactive">
                        <ItinerarySkeleton />
                    </div>
                );
            }
            if (message.itineraryData) {
                return (
                    <div className="mobile-chat-interactive">
                        <ItineraryDisplay 
                            itinerary={message.itineraryData}
                            preferences={{
                                companions: preferences.companions || undefined,
                                budget: preferences.budget || undefined,
                                interests: preferences.interests,
                            }}
                            transportMode={preferences.transportMode || undefined}
                        />
                    </div>
                );
            }
        }

        // Regular interactive cards
        if (message.type === 'interactive') {
            return (
                <div className="mobile-chat-interactive">
                    {renderInteractiveCard(message.interactiveType!)}
                </div>
            );
        }

        // Text + schema blocks (ai or user)
        return (
            <>
                <div className={`mobile-chat-bubble ${message.type}`}>
                    {message.content && <p>{message.content}</p>}
                    {message.type === 'ai' && message.blocks && (
                        <div className="mt-3">
                            <ChatRenderer
                                response={message.blocks}
                                onAction={(actionId) => console.log('Action:', actionId)}
                            />
                        </div>
                    )}
                </div>
                <span className="mobile-chat-time">
                    {formatTime(message.timestamp)}
                </span>
            </>
        );
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="mobile-chat-screen">
            {/* Chat Header */}
            <header className="mobile-chat-header">
                <div className="mobile-chat-header-left">
                    <div className="mobile-chat-avatar">
                        <Bot size={24} className="text-white" />
                    </div>
                    <div>
                        <h1>AI Travel Assistant</h1>
                        <p>Always here to help</p>
                    </div>
                </div>

                <div className="mobile-chat-header-actions">
                    <button
                        className="chat-header-action"
                        onClick={() => onNavigate?.('favorites')}
                        aria-label="Open favorites"
                    >
                        <Heart size={18} />
                    </button>
                    <button
                        className="chat-header-action"
                        onClick={() => onNavigate?.('profile')}
                        aria-label="Open profile"
                    >
                        <User size={18} />
                    </button>
                </div>
            </header>

            {/* Messages Area */}
            <div className="mobile-chat-messages">
                <AnimatePresence>
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`mobile-chat-message ${message.type}`}
                        >
                            {message.type === 'ai' && (
                                <div className="mobile-chat-ai-avatar">
                                    <Bot size={18} className="text-white" />
                                </div>
                            )}

                            {renderMessage(message)}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default ChatScreen;
