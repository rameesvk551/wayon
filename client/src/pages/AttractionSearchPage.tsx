import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, SlidersHorizontal, Map as MapIcon, List, Search, X } from 'lucide-react';
import AttractionCard from '../components/discovery/AttractionCard';
import FilterBottomSheet from '../components/discovery/FilterBottomSheet';
import TripMiniBar from '../components/discovery/TripMiniBar';
import TripBuilderSheet from '../components/discovery/TripBuilderSheet';
import ItineraryResultSheet from '../components/discovery/ItineraryResultSheet';
import MapView from '../components/discovery/MapView';
import CategoryScroller from '../components/discovery/CategoryScroller';
import { SkeletonAttractionList } from '../components/discovery/SkeletonLoader';
import { useAttractionStore } from '../store/useAttractionStore';
import { attractionCategories, trendingCities } from '../data/attractionData';
import { searchAttractions } from '../api/attractionApi';
import type { Attraction, AttractionCategoryId } from '../types/attraction';

const ITEMS_PER_PAGE = 8;

const AttractionSearchPage: React.FC = () => {
    const { city } = useParams<{ city: string }>();
    const navigate = useNavigate();
    const {
        filters,
        isMapView,
        toggleMapView,
        setFilterOpen,
        toastMessage,
    } = useAttractionStore();

    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<AttractionCategoryId | null>(null);
    const [page, setPage] = useState(1);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [apiAttractions, setApiAttractions] = useState<Attraction[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const cityName = trendingCities.find((c) => c.id === city)?.name || city || 'All';

    // Fetch attractions from API when city changes
    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setFetchError(null);

        const fetchAttractions = async () => {
            try {
                const cityQuery = trendingCities.find((c) => c.id === city)?.name || city || '';
                const results = await searchAttractions(cityQuery, { limit: 30 });
                if (!cancelled) {
                    setApiAttractions(results);
                }
            } catch (err: any) {
                console.error('Failed to fetch attractions:', err);
                if (!cancelled) {
                    setFetchError(err.message || 'Failed to load attractions');
                }
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchAttractions();
        return () => { cancelled = true; };
    }, [city]);

    // Apply filters
    const filteredAttractions = useMemo(() => {
        let result = [...apiAttractions];

        // Search query filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (a) =>
                    a.name.toLowerCase().includes(q) ||
                    a.description.toLowerCase().includes(q) ||
                    a.tags?.some((t) => t.toLowerCase().includes(q))
            );
        }

        // Category filter (from pills or filter sheet)
        const activeCats = activeCategory
            ? [activeCategory]
            : filters.categories.length > 0
                ? filters.categories
                : [];
        if (activeCats.length > 0) {
            result = result.filter((a) => activeCats.includes(a.category));
        }

        // Rating filter
        if (filters.minRating > 0) {
            result = result.filter((a) => a.rating >= filters.minRating);
        }

        // Duration filter
        if (filters.duration) {
            result = result.filter((a) => {
                if (filters.duration === '1-2h') return a.durationMinutes <= 120;
                if (filters.duration === 'half-day')
                    return a.durationMinutes > 120 && a.durationMinutes <= 360;
                if (filters.duration === 'full-day') return a.durationMinutes > 360;
                return true;
            });
        }

        // Free only
        if (filters.freeOnly) {
            result = result.filter((a) => a.isFree);
        }

        // Open now
        if (filters.openNow) {
            result = result.filter((a) => a.isOpenNow);
        }

        return result;
    }, [apiAttractions, activeCategory, filters, searchQuery]);

    // Pagination
    const paginatedAttractions = filteredAttractions.slice(0, page * ITEMS_PER_PAGE);
    const hasMore = paginatedAttractions.length < filteredAttractions.length;

    const activeFilterCount =
        filters.categories.length +
        (filters.minRating > 0 ? 1 : 0) +
        (filters.duration ? 1 : 0) +
        (filters.freeOnly ? 1 : 0) +
        (filters.openNow ? 1 : 0);

    return (
        <div className="search-page">
            {/* ===== TOP BAR ===== */}
            <div className="search-topbar">
                <button
                    className="search-topbar__back"
                    onClick={() => navigate('/attractions')}
                    type="button"
                    aria-label="Go back"
                >
                    <ArrowLeft size={22} />
                </button>

                {searchOpen ? (
                    <div className="search-topbar__search-wrap">
                        <Search size={16} className="search-topbar__search-icon" />
                        <input
                            type="text"
                            className="search-topbar__search-input"
                            placeholder={`Search in ${cityName}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button
                            className="search-topbar__search-close"
                            onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                            type="button"
                            aria-label="Close search"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ) : (
                    <h2 className="search-topbar__title">{cityName}</h2>
                )}

                <div className="search-topbar__actions">
                    {!searchOpen && (
                        <button
                            className="search-topbar__btn"
                            onClick={() => setSearchOpen(true)}
                            type="button"
                            aria-label="Search attractions"
                        >
                            <Search size={20} />
                        </button>
                    )}
                    <button
                        className="search-topbar__btn"
                        onClick={() => setFilterOpen(true)}
                        type="button"
                        aria-label="Open filters"
                    >
                        <SlidersHorizontal size={20} />
                        {activeFilterCount > 0 && (
                            <span className="search-topbar__badge">{activeFilterCount}</span>
                        )}
                    </button>
                    <button
                        className="search-topbar__btn"
                        onClick={toggleMapView}
                        type="button"
                        aria-label={isMapView ? 'List view' : 'Map view'}
                    >
                        {isMapView ? <List size={20} /> : <MapIcon size={20} />}
                    </button>
                </div>
            </div>

            {/* ===== MAP VIEW ===== */}
            <AnimatePresence>
                {isMapView && (
                    <MapView attractions={filteredAttractions} onClose={toggleMapView} />
                )}
            </AnimatePresence>

            {/* ===== LIST VIEW ===== */}
            {!isMapView && (
                <div className="search-body">
                    {/* Category pills */}
                    <CategoryScroller
                        categories={attractionCategories}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />

                    {/* Result count */}
                    <p className="search-result-count">
                        {filteredAttractions.length} Attraction{filteredAttractions.length !== 1 ? 's' : ''}
                    </p>

                    {/* Error state */}
                    {fetchError && !isLoading && (
                        <div className="disc-empty">
                            <p>⚠️ {fetchError}</p>
                            <button
                                className="disc-empty__reset"
                                onClick={() => window.location.reload()}
                                type="button"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Attraction list */}
                    {isLoading ? (
                        <SkeletonAttractionList count={4} />
                    ) : (
                        <>
                            <div className="search-attraction-list">
                                {paginatedAttractions.map((attraction, i) => (
                                    <AttractionCard
                                        key={attraction.id}
                                        attraction={attraction}
                                        index={i}
                                    />
                                ))}
                            </div>

                            {paginatedAttractions.length === 0 && !fetchError && (
                                <div className="disc-empty">
                                    <p>No attractions match your filters</p>
                                    <button
                                        className="disc-empty__reset"
                                        onClick={() => {
                                            setActiveCategory(null);
                                            useAttractionStore.getState().resetFilters();
                                        }}
                                        type="button"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )}

                            {hasMore && (
                                <button
                                    className="search-load-more"
                                    onClick={() => setPage((p) => p + 1)}
                                    type="button"
                                >
                                    Load More
                                </button>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Filter Sheet */}
            <FilterBottomSheet />

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

export default AttractionSearchPage;
