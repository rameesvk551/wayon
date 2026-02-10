import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, Sparkles, ChevronRight, Heart } from 'lucide-react';

// Explore Cities dummy data
const exploreCities: Array<{
    id: string;
    name: string;
    image: string;
    rating: number;
    location: string;
    price: string;
    priceUnit: string;
    isFavorite: boolean;
}> = [
        {
            id: 'c1',
            name: 'Mount Bromo',
            image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=400&q=80',
            rating: 4.9,
            location: 'Thailand',
            price: '$890',
            priceUnit: '/person',
            isFavorite: true
        },
        {
            id: 'c2',
            name: 'Koh Phi Phi',
            image: 'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=400&q=80',
            rating: 4.8,
            location: 'Thailand',
            price: '$950',
            priceUnit: '/person',
            isFavorite: false
        },
        {
            id: 'c3',
            name: 'Bali Beach',
            image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
            rating: 4.7,
            location: 'Indonesia',
            price: '$799',
            priceUnit: '/person',
            isFavorite: false
        },
        {
            id: 'c4',
            name: 'Santorini',
            image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
            rating: 4.9,
            location: 'Greece',
            price: '$1,199',
            priceUnit: '/person',
            isFavorite: true
        }
    ];

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

    const filteredCities = useMemo(() => {
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return exploreCities.filter(
                (city) =>
                    city.name.toLowerCase().includes(query) ||
                    city.location.toLowerCase().includes(query)
            );
        }
        return exploreCities;
    }, [searchQuery]);

    return (
        <div className="home-screen">
            {/* Header Section */}
            <header className="home-header">
                <div className="home-header-left">
                    <div className="home-user-avatar">
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                            alt="User"
                        />
                    </div>
                    <div className="home-user-info">
                        <span className="home-welcome-text">Welcome Back</span>
                        <h1 className="home-user-name">Ronald Richards</h1>
                    </div>
                </div>
                <div className="home-header-right">
                    <button className="home-notification-btn">
                        <span className="notification-icon">🔔</span>
                    </button>
                </div>
            </header>

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
                    {filteredCities.map((city, index) => (
                        <motion.div
                            key={city.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="home-city-card"
                        >
                            <div className="home-city-image-container">
                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="home-city-image"
                                />
                                <button className="home-city-favorite">
                                    <Heart
                                        size={16}
                                        fill={city.isFavorite ? '#FF6B6B' : 'none'}
                                        stroke={city.isFavorite ? '#FF6B6B' : '#fff'}
                                    />
                                </button>
                                <div className="home-city-rating">
                                    <Star size={12} fill="#FFD700" stroke="#FFD700" />
                                    <span>{city.rating}</span>
                                </div>
                            </div>
                            <div className="home-city-info">
                                <h3 className="home-city-name">{city.name}</h3>
                                <div className="home-city-location">
                                    <MapPin size={12} />
                                    <span>{city.location}</span>
                                </div>
                                <div className="home-city-price">
                                    <span className="price-value">{city.price}</span>
                                    <span className="price-unit">{city.priceUnit}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
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
