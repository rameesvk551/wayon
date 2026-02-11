import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, List } from 'lucide-react';
import { useTourStore } from '../../store/useTourStore';

interface TourFilterBarProps {
    onOpenFilters: () => void;
    onOpenSort: () => void;
}

export const TourFilterBar: React.FC<TourFilterBarProps> = ({ onOpenFilters, onOpenSort }) => {
    const { viewMode, setViewMode, getActiveFilterCount } = useTourStore();
    const filterCount = getActiveFilterCount();

    return (
        <div className="tour-filter-bar">
            <div className="tour-filter-bar-left">
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenSort}
                    className="tour-filter-btn"
                >
                    <ArrowUpDown size={14} />
                    <span>Sort</span>
                </motion.button>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenFilters}
                    className="tour-filter-btn"
                >
                    <SlidersHorizontal size={14} />
                    <span>Filters</span>
                    {filterCount > 0 && (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="tour-filter-badge"
                        >
                            {filterCount}
                        </motion.span>
                    )}
                </motion.button>
            </div>

            <div className="tour-filter-bar-right">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`tour-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                >
                    <LayoutGrid size={16} />
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`tour-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                >
                    <List size={16} />
                </button>
            </div>
        </div>
    );
};

export default TourFilterBar;
