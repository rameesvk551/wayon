import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Sparkles, ChevronRight, Compass } from 'lucide-react';
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
    getFeaturedAttractions,
} from '../data/attractionData';
import type { AttractionCategoryId } from '../types/attraction';

const featured = getFeaturedAttractions()[0];

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
                <div className="disc-section__header">
                    <h2 className="disc-section__title" style={{ marginBottom: 0 }}>🔥 Trending Destinations</h2>
                    <button className="disc-section__see-all" type="button">
                        See all <ChevronRight size={14} />
                    </button>
                </div>
                {isLoading ? (
                    <SkeletonDestinationRow />
                ) : (
                    <div className="disc-dest-scroll no-scrollbar">
                        {trendingCities.map((city, index) => (
                            <motion.div
                                key={city.id}
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.08 }}
                            >
                                <DestinationCard city={city} onClick={handleCityClick} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>

            {/* ===== FEATURED SPOTLIGHT ===== */}
            {featured && (
                <section className="disc-section">
                    <h2 className="disc-section__title">⭐ Featured Attraction</h2>
                    <motion.div
                        className="disc-featured"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        onClick={() => navigate(`/attractions/${featured.city}`)}
                    >
                        <img
                            src={featured.image}
                            alt={featured.name}
                            className="disc-featured__img"
                            loading="lazy"
                        />
                        <div className="disc-featured__overlay" />
                        <div className="disc-featured__rating">
                            <Star size={12} fill="#FBBF24" stroke="#FBBF24" />
                            <span>{featured.rating}</span>
                        </div>
                        <div className="disc-featured__content">
                            <div className="disc-featured__badge">
                                <Sparkles size={10} />
                                Top Rated
                            </div>
                            <h3 className="disc-featured__name">{featured.name}</h3>
                            <p className="disc-featured__desc">{featured.description}</p>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* ===== EXPLORE BY CATEGORY ===== */}
            <section className="disc-section">
                <h2 className="disc-section__title">🧭 Explore by Category</h2>
                <CategoryScroller
                    categories={attractionCategories}
                    activeCategory={activeCategory}
                    onSelect={setActiveCategory}
                />
            </section>

            {/* ===== CTA CARD ===== */}
            <section className="disc-section disc-section--last">
                <motion.button
                    className="disc-cta"
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    onClick={() => navigate('/plan/new')}
                >
                    <div className="disc-cta__icon">
                        <Compass size={24} />
                    </div>
                    <div className="disc-cta__text">
                        <div className="disc-cta__title">Plan Your Perfect Trip</div>
                        <div className="disc-cta__desc">AI-powered itineraries tailored just for you</div>
                    </div>
                    <ChevronRight size={20} className="disc-cta__arrow" />
                </motion.button>
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
