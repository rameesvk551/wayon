import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HotelSearchBar } from '../components/organisms/HotelSearchBar';
import { FilterBar } from '../components/organisms/FilterBar';
import { FilterBottomSheet } from '../components/organisms/FilterBottomSheet';
import { HotelListSection } from '../components/organisms/HotelListSection';
import { HotelMapView } from '../components/organisms/HotelMapView';
import { FilterChip } from '../components/atoms/FilterChip';
import { useHotelStore } from '../store/useHotelStore';

const HotelListingPage: React.FC = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterTab, setFilterTab] = useState<'sort' | 'filters'>('filters');

    // Use individual selectors for proper re-rendering
    const viewMode = useHotelStore((s) => s.viewMode);
    const filters = useHotelStore((s) => s.filters);
    const sortBy = useHotelStore((s) => s.sortBy);
    const setFilters = useHotelStore((s) => s.setFilters);
    const setSortBy = useHotelStore((s) => s.setSortBy);

    const openFilters = () => {
        setFilterTab('filters');
        setIsFilterOpen(true);
    };

    const openSort = () => {
        setFilterTab('sort');
        setIsFilterOpen(true);
    };

    // Build active filter chip labels
    const activeChips: { label: string; onRemove: () => void }[] = [];

    if (sortBy !== 'recommended') {
        activeChips.push({
            label: `Sort: ${sortBy.replace('_', ' ')}`,
            onRemove: () => setSortBy('recommended'),
        });
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
        activeChips.push({
            label: `$${filters.priceRange[0]}–$${filters.priceRange[1]}${filters.priceRange[1] >= 1000 ? '+' : ''}`,
            onRemove: () => setFilters({ priceRange: [0, 1000] }),
        });
    }
    if (filters.minRating > 0) {
        activeChips.push({
            label: `${filters.minRating}+ Stars`,
            onRemove: () => setFilters({ minRating: 0 }),
        });
    }
    filters.amenities.forEach((a) => {
        activeChips.push({
            label: a,
            onRemove: () =>
                setFilters({ amenities: filters.amenities.filter((x) => x !== a) }),
        });
    });

    return (
        <div className="hotel-listing-page">
            {/* Sticky Search Bar */}
            <div className="hotel-listing-sticky-header">
                <HotelSearchBar />
            </div>

            {/* Filter Bar */}
            <FilterBar onOpenFilters={openFilters} onOpenSort={openSort} />

            {/* Active Filter Chips */}
            <AnimatePresence>
                {activeChips.length > 0 && (
                    <div className="hotel-active-chips">
                        {activeChips.map((chip, i) => (
                            <FilterChip key={i} label={chip.label} onRemove={chip.onRemove} />
                        ))}
                    </div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="hotel-listing-content">
                {viewMode === 'list' ? <HotelListSection /> : <HotelMapView />}
            </div>

            {/* Filter Bottom Sheet */}
            <FilterBottomSheet
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                initialTab={filterTab}
            />
        </div>
    );
};

export default HotelListingPage;
