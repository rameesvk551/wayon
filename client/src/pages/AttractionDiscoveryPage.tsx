import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import DestinationCard from '../components/discovery/DestinationCard';
import CategoryScroller from '../components/discovery/CategoryScroller';
import { SkeletonDestinationRow } from '../components/discovery/SkeletonLoader';
import TripMiniBar from '../components/discovery/TripMiniBar';
import TripBuilderSheet from '../components/discovery/TripBuilderSheet';
import ItineraryResultSheet from '../components/discovery/ItineraryResultSheet';
import { useAttractionStore } from '../store/useAttractionStore';
import {
    trendingCities,
    attractionCategories,
    popularCityChips,
} from '../data/attractionData';
import type { AttractionCategoryId } from '../types/attraction';

const AttractionDiscoveryPage: React.FC = () => {
    const navigate = useNavigate();
    const toastMessage = useAttractionStore((s) => s.toastMessage);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<AttractionCategoryId | null>(null);
    const [isLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredCities = trendingCities.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCityClick = useCallback(
        (cityId: string) => navigate(`/attractions/${cityId}`),
        [navigate]
    );

    const handleChipClick = (city: string) => {
        navigate(`/attractions/${city.toLowerCase()}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            const match = trendingCities.find(
                (c) => c.name.toLowerCase() === searchQuery.toLowerCase()
            );
            navigate(`/attractions/${match?.id || searchQuery.toLowerCase()}`);
        }
    };

    return (
        <div className="discovery-page">
            {/* ===== HERO SECTION ===== */}
            <section className="disc-hero">
                <div className="disc-hero__bg">
                    <img
                        src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=500&fit=crop"
                        alt="Travel"
                        className="disc-hero__bg-img"
                    />
                    <div className="disc-hero__gradient" />
                </div>

                <div className="disc-hero__content">
                    <motion.h1
                        className="disc-hero__title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Where do you want to go?
                    </motion.h1>

                    <motion.form
                        className="disc-search"
                        onSubmit={handleSearchSubmit}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <Search size={20} className="disc-search__icon" />
                        <input
                            type="text"
                            className="disc-search__input"
                            placeholder="Search cities, attractions..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSuggestions(e.target.value.length > 0);
                            }}
                            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />

                        {/* Autocomplete dropdown */}
                        {showSuggestions && filteredCities.length > 0 && (
                            <div className="disc-search__dropdown">
                                {filteredCities.map((city) => (
                                    <button
                                        key={city.id}
                                        className="disc-search__suggestion"
                                        type="button"
                                        onMouseDown={() => handleCityClick(city.id)}
                                    >
                                        <MapPin size={15} />
                                        <span>{city.name}</span>
                                        <span className="disc-search__sug-country">{city.country}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.form>

                    {/* City Chips */}
                    <motion.div
                        className="disc-chips"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {popularCityChips.map((city) => (
                            <button
                                key={city}
                                className="disc-chip"
                                onClick={() => handleChipClick(city)}
                                type="button"
                            >
                                {city}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== TRENDING DESTINATIONS ===== */}
            <section className="disc-section">
                <h2 className="disc-section__title">🔥 Trending Destinations</h2>
                {isLoading ? (
                    <SkeletonDestinationRow />
                ) : (
                    <div className="disc-dest-scroll no-scrollbar">
                        {trendingCities.map((city) => (
                            <DestinationCard key={city.id} city={city} onClick={handleCityClick} />
                        ))}
                    </div>
                )}
            </section>

            {/* ===== EXPLORE BY CATEGORY ===== */}
            <section className="disc-section">
                <h2 className="disc-section__title">🧭 Explore by Category</h2>
                <CategoryScroller
                    categories={attractionCategories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />
            </section>

            {/* ===== EXPLORE BY CATEGORY (continued) ===== */}
            <section className="disc-section disc-section--last">
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '16px 0' }}>
                    Select a city above to browse attractions
                </p>
            </section>

            {/* Trip Builder */}
            <TripMiniBar />
            <TripBuilderSheet />
            <ItineraryResultSheet />

            {/* Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        className="toast-notification"
                        initial={{ y: 60, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 60, opacity: 0 }}
                    >
                        ✅ {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AttractionDiscoveryPage;
