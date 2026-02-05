import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Star, MapPin, Sparkles, ChevronRight } from 'lucide-react';

const categories = [
    { id: '1', label: 'All', icon: '🌍' },
    { id: '2', label: 'Adventure', icon: '🧭' },
    { id: '3', label: 'Beach', icon: '☀️' },
    { id: '4', label: 'Culture', icon: '🏛️' },
    { id: '5', label: 'Food', icon: '🍽️' },
    { id: '6', label: 'Nature', icon: '🌿' },
];

const destinations: Array<{
    id: string;
    name: string;
    country: string;
    image: string;
    rating: number;
    price: string;
    category: string;
}> = [];

const nearbyDestinations: Array<{
    id: string;
    name: string;
    country: string;
    rating: number;
    price: string;
    image: string;
}> = [];

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

                {nearbyDestinations.length === 0 ? (
                    <div className="mobile-empty-state">
                        <MapPin size={48} className="text-[var(--color-text-light)]" />
                        <p>No nearby destinations yet</p>
                    </div>
                ) : (
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
                )}
            </section>

            {/* Bottom spacing for nav */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default HomeScreen;
