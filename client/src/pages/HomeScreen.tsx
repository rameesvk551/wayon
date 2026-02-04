import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Star, MapPin, Sparkles, ChevronRight } from 'lucide-react';

// Mock data matching mobile app
const categories = [
    { id: '1', label: 'All', icon: '🌍' },
    { id: '2', label: 'Adventure', icon: '🧭' },
    { id: '3', label: 'Beach', icon: '☀️' },
    { id: '4', label: 'Culture', icon: '🏛️' },
    { id: '5', label: 'Food', icon: '🍽️' },
    { id: '6', label: 'Nature', icon: '🌿' },
];

const destinations = [
    {
        id: '1',
        name: 'Venice Grand Canal',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400',
        rating: 4.8,
        price: '$139/person',
        category: 'Culture',
    },
    {
        id: '2',
        name: 'Tahitian Island',
        country: 'French Polynesia',
        image: 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=400',
        rating: 4.9,
        price: '$249/person',
        category: 'Beach',
    },
    {
        id: '3',
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
        rating: 4.7,
        price: '$199/person',
        category: 'Beach',
    },
    {
        id: '4',
        name: 'Swiss Alps',
        country: 'Switzerland',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
        rating: 4.9,
        price: '$299/person',
        category: 'Adventure',
    },
    {
        id: '5',
        name: 'Kyoto Temples',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
        rating: 4.8,
        price: '$179/person',
        category: 'Culture',
    },
];

const nearbyDestinations = [
    {
        id: '1',
        name: 'Piazza del Campo',
        country: 'Italy',
        rating: 4.4,
        price: '$83/person',
        image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400',
    },
    {
        id: '2',
        name: 'Leaning Tower of Pisa',
        country: 'Italy',
        rating: 4.4,
        price: '$83/person',
        image: 'https://images.unsplash.com/photo-1544944379-c962cec84ab8?w=400',
    },
];

interface HomeScreenProps {
    onNavigate?: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDestinations = useMemo(() => {
        let filtered = destinations;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (dest) =>
                    dest.name.toLowerCase().includes(query) ||
                    dest.country.toLowerCase().includes(query)
            );
        }

        if (selectedCategory !== '1') {
            const categoryName = categories.find(c => c.id === selectedCategory)?.label;
            if (categoryName) {
                filtered = filtered.filter(dest => dest.category === categoryName);
            }
        }

        return filtered;
    }, [searchQuery, selectedCategory]);

    return (
        <div className="mobile-screen">
            {/* Header */}
            <header className="mobile-header">
                <div>
                    <h1 className="mobile-greeting">Hi, Traveler 👋</h1>
                    <p className="mobile-subtitle">Where do you want to explore?</p>
                </div>
                <div className="mobile-avatar">
                    <span>👤</span>
                </div>
            </header>

            {/* Search Bar */}
            <div className="mobile-search-bar">
                <Search size={20} className="text-[var(--color-text-muted)]" />
                <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mobile-search-input"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')}>
                        <X size={20} className="text-[var(--color-text-muted)]" />
                    </button>
                )}
            </div>

            {/* Categories */}
            <div className="mobile-categories">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`mobile-category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                    >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Popular Destinations */}
            <section className="mobile-section">
                <div className="mobile-section-header">
                    <h2 className="mobile-section-title">
                        {searchQuery ? `Results for "${searchQuery}"` : 'Popular Destinations'}
                    </h2>
                    {!searchQuery && (
                        <button className="mobile-see-all">See All</button>
                    )}
                </div>

                {filteredDestinations.length === 0 ? (
                    <div className="mobile-empty-state">
                        <Search size={48} className="text-[var(--color-text-light)]" />
                        <p>No destinations found</p>
                    </div>
                ) : (
                    <div className="mobile-destinations-scroll">
                        {filteredDestinations.map((dest, index) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="mobile-destination-card"
                            >
                                <img src={dest.image} alt={dest.name} className="mobile-destination-image" />
                                <div className="mobile-destination-rating">
                                    <Star size={12} fill="#FCD34D" stroke="#FCD34D" />
                                    <span>{dest.rating}</span>
                                </div>
                                <div className="mobile-destination-info">
                                    <h3>{dest.name}</h3>
                                    <div className="mobile-destination-meta">
                                        <MapPin size={12} />
                                        <span>{dest.country}</span>
                                    </div>
                                    <p className="mobile-destination-price">{dest.price}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* AI Trip Planner Card */}
            <section className="mobile-section">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate?.('planner')}
                    className="mobile-ai-card"
                >
                    <div className="mobile-ai-icon">
                        <Sparkles size={28} className="text-white" />
                    </div>
                    <div className="mobile-ai-content">
                        <h3>AI Trip Planner</h3>
                        <p>Get personalized itineraries powered by AI</p>
                    </div>
                    <ChevronRight size={24} className="text-white" />
                </motion.button>
            </section>

            {/* Nearby Destinations */}
            <section className="mobile-section">
                <div className="mobile-section-header">
                    <h2 className="mobile-section-title">Nearby Destinations</h2>
                    <button className="mobile-see-all">See All</button>
                </div>

                <div className="mobile-nearby-list">
                    {nearbyDestinations.map((dest) => (
                        <div key={dest.id} className="mobile-nearby-card">
                            <img src={dest.image} alt={dest.name} className="mobile-nearby-image" />
                            <div className="mobile-nearby-info">
                                <h3>{dest.name}</h3>
                                <div className="mobile-nearby-meta">
                                    <MapPin size={14} />
                                    <span>{dest.country}</span>
                                    <Star size={14} fill="#FCD34D" stroke="#FCD34D" />
                                    <span>{dest.rating}</span>
                                </div>
                                <p className="mobile-nearby-price">{dest.price}</p>
                            </div>
                            <button className="mobile-heart-button">
                                ❤️
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom spacing for nav */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default HomeScreen;
