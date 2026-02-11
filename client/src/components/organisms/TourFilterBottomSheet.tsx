import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Check, Star, ChevronRight } from 'lucide-react';
import { useTourStore } from '../../store/useTourStore';
import { tourSortOptions, tourCategories, tourLanguages, type TourSortOption, type TourCategory } from '../../data/tourListingData';
import { PriceRangeSlider } from '../molecules/PriceRangeSlider';

interface TourFilterBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: 'sort' | 'filters';
}

export const TourFilterBottomSheet: React.FC<TourFilterBottomSheetProps> = ({
    isOpen,
    onClose,
    initialTab = 'filters',
}) => {
    const { filters, sortBy, setFilters, setSortBy, getFilteredTours } = useTourStore();

    const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(filters.priceRange);
    const [localDuration, setLocalDuration] = useState(filters.duration);
    const [localCategories, setLocalCategories] = useState<TourCategory[]>(filters.categories);
    const [localMinRating, setLocalMinRating] = useState(filters.minRating);
    const [localGroupSize, setLocalGroupSize] = useState(filters.groupSize);
    const [localLanguages, setLocalLanguages] = useState<string[]>(filters.languages);
    const [localSort, setLocalSort] = useState<TourSortOption>(sortBy);
    const [activeTab, setActiveTab] = useState<'sort' | 'filters'>(initialTab);

    useEffect(() => {
        if (isOpen) {
            setLocalPriceRange(filters.priceRange);
            setLocalDuration(filters.duration);
            setLocalCategories([...filters.categories]);
            setLocalMinRating(filters.minRating);
            setLocalGroupSize(filters.groupSize);
            setLocalLanguages([...filters.languages]);
            setLocalSort(sortBy);
            setActiveTab(initialTab);
        }
    }, [isOpen, filters, sortBy, initialTab]);

    const toggleCategory = (c: TourCategory) => {
        setLocalCategories((prev) =>
            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
        );
    };

    const toggleLanguage = (l: string) => {
        setLocalLanguages((prev) =>
            prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]
        );
    };

    const handleApply = () => {
        setFilters({
            priceRange: localPriceRange,
            duration: localDuration,
            categories: localCategories,
            minRating: localMinRating,
            groupSize: localGroupSize,
            languages: localLanguages,
        });
        setSortBy(localSort);
        onClose();
    };

    const handleReset = () => {
        setLocalPriceRange([0, 5000]);
        setLocalDuration('all');
        setLocalCategories([]);
        setLocalMinRating(0);
        setLocalGroupSize('all');
        setLocalLanguages([]);
        setLocalSort('recommended');
    };

    const resultCount = getFilteredTours().length;
    const ratingOptions = [0, 3, 3.5, 4, 4.5];
    const durationOptions = [
        { value: 'all', label: 'Any' },
        { value: '1-3', label: '1-3 Days' },
        { value: '4-7', label: '4-7 Days' },
        { value: '7+', label: '7+ Days' },
    ];
    const groupSizeOptions = [
        { value: 'all', label: 'Any' },
        { value: 'small', label: 'Small (≤8)' },
        { value: 'medium', label: 'Medium (9-14)' },
        { value: 'large', label: 'Large (15+)' },
    ];

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
                                            layoutId="tour-fbs-tab-indicator"
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
                                        {tourSortOptions.map((opt) => {
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
                                                <h4 className="fbs-section-title">Price Range</h4>
                                                <span className="fbs-section-hint">Per person</span>
                                            </div>
                                            <PriceRangeSlider
                                                min={0}
                                                max={5000}
                                                value={localPriceRange}
                                                onChange={setLocalPriceRange}
                                            />
                                        </div>

                                        <div className="fbs-divider" />

                                        {/* Duration */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Duration</h4>
                                            </div>
                                            <div className="fbs-rating-grid">
                                                {durationOptions.map((d) => {
                                                    const isSelected = localDuration === d.value;
                                                    return (
                                                        <button
                                                            key={d.value}
                                                            onClick={() => setLocalDuration(d.value)}
                                                            className={`fbs-rating-btn ${isSelected ? 'active' : ''}`}
                                                        >
                                                            {d.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="fbs-divider" />

                                        {/* Category */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Category</h4>
                                                <span className="fbs-section-hint">
                                                    {localCategories.length > 0 ? `${localCategories.length} selected` : 'Select categories'}
                                                </span>
                                            </div>
                                            <div className="fbs-amenity-grid">
                                                {tourCategories.map((c) => {
                                                    const isSelected = localCategories.includes(c);
                                                    return (
                                                        <button
                                                            key={c}
                                                            onClick={() => toggleCategory(c)}
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
                                                            {c}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="fbs-divider" />

                                        {/* Rating */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Minimum Rating</h4>
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

                                        <div className="fbs-divider" />

                                        {/* Group Size */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Group Size</h4>
                                            </div>
                                            <div className="fbs-rating-grid">
                                                {groupSizeOptions.map((g) => {
                                                    const isSelected = localGroupSize === g.value;
                                                    return (
                                                        <button
                                                            key={g.value}
                                                            onClick={() => setLocalGroupSize(g.value)}
                                                            className={`fbs-rating-btn ${isSelected ? 'active' : ''}`}
                                                        >
                                                            {g.label}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="fbs-divider" />

                                        {/* Language */}
                                        <div className="fbs-section">
                                            <div className="fbs-section-header">
                                                <h4 className="fbs-section-title">Language</h4>
                                                <span className="fbs-section-hint">
                                                    {localLanguages.length > 0 ? `${localLanguages.length} selected` : 'Any language'}
                                                </span>
                                            </div>
                                            <div className="fbs-amenity-grid">
                                                {tourLanguages.map((l) => {
                                                    const isSelected = localLanguages.includes(l);
                                                    return (
                                                        <button
                                                            key={l}
                                                            onClick={() => toggleLanguage(l)}
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
                                                            {l}
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
                                Show {resultCount} tour{resultCount !== 1 ? 's' : ''}
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TourFilterBottomSheet;
