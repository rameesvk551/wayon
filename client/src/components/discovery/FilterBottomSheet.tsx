import { motion, AnimatePresence } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useAttractionStore } from '../../store/useAttractionStore';
import { attractionCategories } from '../../data/attractionData';

const durationOptions = [
    { label: '1-2 hours', value: '1-2h' },
    { label: 'Half day', value: 'half-day' },
    { label: 'Full day', value: 'full-day' },
];

const FilterBottomSheet: React.FC = () => {
    const { filters, isFilterOpen, setFilters, resetFilters, setFilterOpen } =
        useAttractionStore();

    const toggleCategory = (catId: string) => {
        const cats = filters.categories.includes(catId as any)
            ? filters.categories.filter((c) => c !== catId)
            : [...filters.categories, catId as any];
        setFilters({ categories: cats });
    };

    return (
        <AnimatePresence>
            {isFilterOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="filter-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setFilterOpen(false)}
                    />

                    {/* Sheet */}
                    <motion.div
                        className="filter-sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    >
                        {/* Handle */}
                        <div className="filter-sheet__handle-row">
                            <div className="filter-sheet__handle" />
                        </div>

                        {/* Header */}
                        <div className="filter-sheet__header">
                            <h3>Filters</h3>
                            <button
                                className="filter-sheet__close"
                                onClick={() => setFilterOpen(false)}
                                type="button"
                                aria-label="Close filters"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="filter-sheet__body">
                            {/* Category */}
                            <div className="filter-section">
                                <h4 className="filter-section__title">Category</h4>
                                <div className="filter-chips">
                                    {attractionCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            className={`filter-chip ${filters.categories.includes(cat.id) ? 'filter-chip--active' : ''
                                                }`}
                                            onClick={() => toggleCategory(cat.id)}
                                            type="button"
                                        >
                                            {cat.icon} {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="filter-section">
                                <h4 className="filter-section__title">Minimum Rating</h4>
                                <div className="filter-chips">
                                    {[0, 3, 3.5, 4, 4.5].map((r) => (
                                        <button
                                            key={r}
                                            className={`filter-chip ${filters.minRating === r ? 'filter-chip--active' : ''
                                                }`}
                                            onClick={() => setFilters({ minRating: r })}
                                            type="button"
                                        >
                                            {r === 0 ? 'Any' : (
                                                <>
                                                    <Star size={13} fill="#F59E0B" stroke="#F59E0B" /> {r}+
                                                </>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="filter-section">
                                <h4 className="filter-section__title">Duration</h4>
                                <div className="filter-chips">
                                    <button
                                        className={`filter-chip ${!filters.duration ? 'filter-chip--active' : ''}`}
                                        onClick={() => setFilters({ duration: null })}
                                        type="button"
                                    >
                                        Any
                                    </button>
                                    {durationOptions.map((d) => (
                                        <button
                                            key={d.value}
                                            className={`filter-chip ${filters.duration === d.value ? 'filter-chip--active' : ''
                                                }`}
                                            onClick={() => setFilters({ duration: d.value })}
                                            type="button"
                                        >
                                            {d.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="filter-section">
                                <h4 className="filter-section__title">More</h4>
                                <div className="filter-toggles">
                                    <label className="filter-toggle">
                                        <input
                                            type="checkbox"
                                            checked={filters.freeOnly}
                                            onChange={(e) => setFilters({ freeOnly: e.target.checked })}
                                        />
                                        <span className="filter-toggle__slider" />
                                        Free only
                                    </label>
                                    <label className="filter-toggle">
                                        <input
                                            type="checkbox"
                                            checked={filters.openNow}
                                            onChange={(e) => setFilters({ openNow: e.target.checked })}
                                        />
                                        <span className="filter-toggle__slider" />
                                        Open now
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="filter-sheet__footer">
                            <button
                                className="filter-sheet__reset"
                                onClick={resetFilters}
                                type="button"
                            >
                                Reset
                            </button>
                            <button
                                className="filter-sheet__apply"
                                onClick={() => setFilterOpen(false)}
                                type="button"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default FilterBottomSheet;
