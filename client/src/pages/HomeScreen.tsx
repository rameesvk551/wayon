import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Sparkles, ChevronRight, Heart } from 'lucide-react';
import { searchTours, POPULAR_DESTINATIONS } from '../api/tourApi';
import type { TourListingItem } from '../data/tourListingData';

// Category chips with icons
const categoryChips = [
    { id: '1', label: 'Mountain', icon: '⛰️', isActive: true },
    { id: '2', label: 'Beach', icon: '🏖️', isActive: false },
    { id: '3', label: 'Park', icon: '🌲', isActive: false },
    { id: '4', label: 'City', icon: '🏙️', isActive: false },
    { id: '5', label: 'Desert', icon: '🏜️', isActive: false },
];

// Explore tabs
const exploreTabs = ['All', 'Popular', 'Recommended', 'Most Viewed', 'Recent'];

// Popular categories with image icons
const popularCategories = [
    { id: 'cat1', name: 'Flights', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&q=80' },
    { id: 'cat2', name: 'Hotels', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&q=80' },
    { id: 'cat3', name: 'Transports', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&q=80' },
    { id: 'cat4', name: 'Events', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200&q=80' },
];

interface HomeScreenProps {
    onNavigate?: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [activeTab, setActiveTab] = useState('Popular');
    const [searchQuery, setSearchQuery] = useState('');
    const [exploreCities, setExploreCities] = useState<TourListingItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDynamicData = async () => {
            setIsLoading(true);
            try {
                // Fetch dynamic data for tours based on default or random destination
                const defaultDest = POPULAR_DESTINATIONS[Math.floor(Math.random() * POPULAR_DESTINATIONS.length)];
                const tours = await searchTours({
                    latitude: defaultDest.lat,
                    longitude: defaultDest.lng,
                    radius: 100,
                    limit: 10
                });
                setExploreCities(tours);
            } catch (error) {
                console.error('Failed to fetch dynamic data for home screen:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDynamicData();
    }, []);

    const filteredCities = useMemo(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return exploreCities.filter(
                (city) =>
                    city.name.toLowerCase().includes(query) ||
                    city.location.toLowerCase().includes(query) ||
                    city.country.toLowerCase().includes(query)
            );
        }
        return exploreCities;
    }, [searchQuery, exploreCities]);

    return (
        <div className="home-screen">
            {/* Search Bar */}
            <div className="home-search-container">
                <div className="home-search-bar">
                    <Search size={20} className="home-search-icon" />
                    <input
                        type="text"
                        placeholder="Discover a city"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="home-search-input"
                    />
                </div>
            </div>

            {/* Category Chips */}
            <div className="home-category-chips">
                {categoryChips.map((chip) => (
                    <button
                        key={chip.id}
                        onClick={() => setSelectedCategory(chip.id)}
                        className={`home-chip ${selectedCategory === chip.id ? 'active' : ''}`}
                    >
                        <span className="home-chip-icon">{chip.icon}</span>
                        <span className="home-chip-label">{chip.label}</span>
                    </button>
                ))}
            </div>

            {/* Explore Cities Section */}
            <section className="home-section">
                <h2 className="home-section-title">Explore Cities</h2>

                {/* Explore Tabs */}
                <div className="home-explore-tabs">
                    {exploreTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`home-explore-tab ${activeTab === tab ? 'active' : ''}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Cities Grid */}
                <div className="home-cities-grid">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="home-city-card" style={{ opacity: 0.5, backgroundColor: '#f0f0f0', height: '200px', borderRadius: '16px' }}></div>
                        ))
                    ) : filteredCities.length === 0 ? (
                        <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '20px 0' }}>No cities found.</p>
                    ) : (
                        filteredCities.map((city, index) => (
                            <motion.div
                                key={city.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="home-city-card"
                            >
                                <div className="home-city-image-container">
                                    <img
                                        src={city.images?.[0] || 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80'}
                                        alt={city.name}
                                        className="home-city-image"
                                    />
                                    <button className="home-city-favorite">
                                        <Heart
                                            size={16}
                                            fill="none"
                                            stroke="#fff"
                                        />
                                    </button>
                                    <div className="home-city-rating">
                                        <Star size={12} fill="#FFD700" stroke="#FFD700" />
                                        <span>{(city.rating || 4.5).toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="home-city-info">
                                    <h3 className="home-city-name">{city.name}</h3>
                                    <div className="home-city-location">
                                        <MapPin size={12} />
                                        <span>{city.location || city.country}</span>
                                    </div>
                                    <div className="home-city-price">
                                        <span className="price-value">{city.currency}{(city.price || 0).toLocaleString()}</span>
                                        <span className="price-unit">/person</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Popular Categories Section */}
            <section className="home-section">
                <h2 className="home-section-title">Popular Categories</h2>
                <div className="home-popular-categories">
                    {popularCategories.map((cat) => (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="home-category-item"
                        >
                            <div className="home-category-icon-circle">
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <span className="home-category-name">{cat.name}</span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* AI Trip Planner Card */}
            <section className="home-section">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate?.('chat')}
                    className="home-ai-card"
                >
                    <div className="home-ai-icon">
                        <Sparkles size={28} className="text-white" />
                    </div>
                    <div className="home-ai-content">
                        <h3>AI Trip Planner</h3>
                        <p>Get personalized itineraries powered by AI</p>
                    </div>
                    <ChevronRight size={24} className="text-white" />
                </motion.button>
            </section>

            {/* Bottom spacing for nav */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default HomeScreen;
