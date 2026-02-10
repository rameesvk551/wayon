import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, Star, ChevronRight } from 'lucide-react';
import { useHotelStore } from '../../store/useHotelStore';
import { allAmenities, sortOptions, type SortOption } from '../../data/hotelListingData';
import { PriceRangeSlider } from '../molecules/PriceRangeSlider';

interface FilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'sort' | 'filters';
}

export const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
    isOpen,
    onClose,
    initialTab = 'filters',
}) => {
    const { filters, sortBy, setFilters, setSortBy, getFilteredHotels } = useHotelStore();

    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange);
    const [localMinRating, setLocalMinRating] = useState(filters.minRating);
    const [localAmenities, setLocalAmenities] = useState<string[]>(filters.amenities);
    const [localSort, setLocalSort] = useState<SortOption>(sortBy);
    const [activeTab, setActiveTab] = useState<'sort' | 'filters'>(initialTab);

    useEffect(() => {
        if (isOpen) {
            setLocalPriceRange(filters.priceRange);
            setLocalMinRating(filters.minRating);
            setLocalAmenities([...filters.amenities]);
            setLocalSort(sortBy);
            setActiveTab(initialTab);
        }
    }, [isOpen, filters, sortBy, initialTab]);

    const toggleAmenity = (a: string) => {
        setLocalAmenities((prev) =>
            prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
        );
    };

    const handleApply = () => {
        setFilters({
            priceRange: localPriceRange,
            minRating: localMinRating,
            amenities: localAmenities,
        });
        setSortBy(localSort);
        onClose();
    };

    const handleReset = () => {
        setLocalPriceRange([0, 1000]);
        setLocalMinRating(0);
        setLocalAmenities([]);
        setLocalSort('recommended');
    };

    const resultCount = getFilteredHotels().length;
    const ratingOptions = [0, 3, 3.5, 4, 4.5];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fbs-backdrop"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                        className="fbs-sheet"
                    >
                        {/* Handle */}
                        <div className="fbs-handle-row">
                            <div className="fbs-handle" />
                        </div>

                        {/* Header */}
                        <div className="fbs-header">
                            <button onClick={handleReset} className="fbs-reset-btn">
                                <RotateCcw size={13} />
                                Reset
                            </button>
                            <h3 className="fbs-title">Filters & Sort</h3>
                            <button onClick={onClose} className="fbs-close-btn">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="fbs-tabs">
                            {(['filters', 'sort'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`fbs-tab ${activeTab === tab ? 'active' : ''}`}
                                >
                                    {tab === 'filters' ? 'Filters' : 'Sort By'}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="fbs-tab-indicator"
                                            className="fbs-tab-indicator"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <div className="fbs-content">
                            <AnimatePresence mode="wait">
                                {activeTab === 'sort' ? (
                                    <motion.div
                                        key="sort-tab"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                        className="fbs-sort-list"
                                    >
                                        {sortOptions.map((opt) => {
                                            const isSelected = localSort === opt.value;
                                            return (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setLocalSort(opt.value)}
                                                    className={`fbs-sort-item ${isSelected ? 'active' : ''}`}
                                                >
                                                    <span className="fbs-sort-label">{opt.label}</span>
                                                    {isSelected ? (
                                                        <div className="fbs-sort-check">
                                                            <Check size={14} />
                                                        </div>
                                                    ) : (
                                                        <ChevronRight size={16} className="text-gray-300" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="filters-tab"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.2 }}
                                        className="fbs-filters"
                                    >
                                        {/* Price Range */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Price per night</h4>
                                                <span className="fbs-section-hint">Set your budget</span>
                                            </div>
                                            <PriceRangeSlider
                                                min={0}
                                                max={1000}
                                                value={localPriceRange}
                                                onChange={setLocalPriceRange}
                                            />
                                        </div>

                                        {/* Divider */}
                                        <div className="fbs-divider" />

                                        {/* Rating */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Minimum Rating</h4>
                                                <span className="fbs-section-hint">Guest review score</span>
                                            </div>
                                            <div className="fbs-rating-grid">
                                                {ratingOptions.map((r) => {
                                                    const isSelected = localMinRating === r;
                                                    return (
                                                        <button
                                                            key={r}
                                                            onClick={() => setLocalMinRating(r)}
                                                            className={`fbs-rating-btn ${isSelected ? 'active' : ''}`}
                                                        >
                                                            {r === 0 ? (
                                                                'Any'
                                                            ) : (
                                                                <>
                                                                    <Star
                                                                        size={13}
                                                                        className={isSelected ? 'fill-amber-400 text-amber-400' : 'fill-gray-300 text-gray-300'}
                                                                    />
                                                                    {r}+
                                                                </>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="fbs-divider" />

                                        {/* Amenities */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Amenities</h4>
                                                <span className="fbs-section-hint">
                                                    {localAmenities.length > 0 ? `${localAmenities.length} selected` : 'Select amenities'}
                                                </span>
                                            </div>
                                            <div className="fbs-amenity-grid">
                                                {allAmenities.map((a) => {
                                                    const isSelected = localAmenities.includes(a);
                                                    return (
                                                        <button
                                                            key={a}
                                                            onClick={() => toggleAmenity(a)}
                                                            className={`fbs-amenity-btn ${isSelected ? 'active' : ''}`}
                                                        >
                                                            {isSelected && (
                                                                <motion.span
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    className="fbs-amenity-check"
                                                                >
                                                                    <Check size={10} />
                                                                </motion.span>
                                                            )}
                                                            {a}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="fbs-footer">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleApply}
                                className="fbs-apply-btn"
                            >
                                Show {resultCount} hotel{resultCount !== 1 ? 's' : ''}
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterBottomSheet;
