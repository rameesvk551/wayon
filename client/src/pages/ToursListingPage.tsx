import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { TourSearchBar } from '../components/organisms/TourSearchBar';
import { TourFilterBar } from '../components/organisms/TourFilterBar';
import { TourFilterBottomSheet } from '../components/organisms/TourFilterBottomSheet';
import { TourListSection } from '../components/organisms/TourListSection';
import { FilterChip } from '../components/atoms/FilterChip';
import { useTourStore } from '../store/useTourStore';

const ToursListingPage: React.FC = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterTab, setFilterTab] = useState<'sort' | 'filters'>('filters');
    const { filters, sortBy, setFilters, setSortBy } = useTourStore();
    const navigate = useNavigate();

    const openFilters = () => {
        setFilterTab('filters');
        setIsFilterOpen(true);
    };

    const openSort = () => {
        setFilterTab('sort');
        setIsFilterOpen(true);
    };

    const handleViewDetails = (tourId: string) => {
        navigate(`/tours/${tourId}`);
    };

    // Build active filter chips
    const activeChips: { label: string; onRemove: () => void }[] = [];

    if (sortBy !== 'recommended') {
        activeChips.push({
            label: `Sort: ${sortBy.replace('_', ' ')}`,
            onRemove: () => setSortBy('recommended'),
        });
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) {
        activeChips.push({
            label: `$${filters.priceRange[0]}–$${filters.priceRange[1]}${filters.priceRange[1] >= 5000 ? '+' : ''}`,
            onRemove: () => setFilters({ priceRange: [0, 5000] }),
        });
    }
    if (filters.duration !== 'all') {
        activeChips.push({
            label: `${filters.duration} days`,
            onRemove: () => setFilters({ duration: 'all' }),
        });
    }
    filters.categories.forEach((c) => {
        activeChips.push({
            label: c,
            onRemove: () => setFilters({ categories: filters.categories.filter((x) => x !== c) }),
        });
    });
    if (filters.minRating > 0) {
        activeChips.push({
            label: `${filters.minRating}+ Stars`,
            onRemove: () => setFilters({ minRating: 0 }),
        });
    }
    if (filters.groupSize !== 'all') {
        activeChips.push({
            label: `Group: ${filters.groupSize}`,
            onRemove: () => setFilters({ groupSize: 'all' }),
        });
    }
    filters.languages.forEach((l) => {
        activeChips.push({
            label: l,
            onRemove: () => setFilters({ languages: filters.languages.filter((x) => x !== l) }),
        });
    });

    return (
        <div className="tour-listing-page">
            {/* Sticky Search Bar */}
            <div className="tour-listing-sticky-header">
                <TourSearchBar />
            </div>

            {/* Filter Bar */}
            <TourFilterBar onOpenFilters={openFilters} onOpenSort={openSort} />

            {/* Active Filter Chips */}
            <AnimatePresence>
                {activeChips.length > 0 && (
                    <div className="tour-active-chips">
                        {activeChips.map((chip, i) => (
                            <FilterChip key={i} label={chip.label} onRemove={chip.onRemove} />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="tour-listing-content">
                <TourListSection onViewDetails={handleViewDetails} />
            </div>

            {/* Filter Bottom Sheet */}
            <TourFilterBottomSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                initialTab={filterTab}
            />
        </div>
    );
};

export default ToursListingPage;
