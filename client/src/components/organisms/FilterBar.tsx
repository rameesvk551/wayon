import React from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ArrowUpDown, DollarSign, Star, Sparkles, Map } from 'lucide-react';
import { useHotelStore } from '../../store/useHotelStore';

interface FilterBarProps {
    onOpenFilters: () => void;
    onOpenSort: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ onOpenFilters, onOpenSort }) => {
    const { viewMode, setViewMode, getActiveFilterCount, filters, sortBy } = useHotelStore();
    const activeCount = getActiveFilterCount();

    const pills = [
        {
            id: 'filters',
            label: 'Filters',
            icon: <SlidersHorizontal size={14} />,
            badge: activeCount > 0 ? activeCount : undefined,
            onClick: onOpenFilters,
            isActive: activeCount > 0,
        },
        {
            id: 'sort',
            label: 'Sort',
            icon: <ArrowUpDown size={14} />,
            onClick: onOpenSort,
            isActive: sortBy !== 'recommended',
        },
        {
            id: 'price',
            label: 'Price',
            icon: <DollarSign size={14} />,
            onClick: onOpenFilters,
            isActive: filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
        },
        {
            id: 'rating',
            label: 'Rating',
            icon: <Star size={14} />,
            onClick: onOpenFilters,
            isActive: filters.minRating > 0,
        },
        {
            id: 'amenities',
            label: 'Amenities',
            icon: <Sparkles size={14} />,
            onClick: onOpenFilters,
            isActive: filters.amenities.length > 0,
        },
        {
            id: 'map',
            label: viewMode === 'map' ? 'List' : 'Map',
            icon: <Map size={14} />,
            onClick: () => setViewMode(viewMode === 'map' ? 'list' : 'map'),
            isActive: viewMode === 'map',
        },
    ];

    return (
        <div className="hotel-filter-bar no-scrollbar">
            {pills.map((pill) => (
                <motion.button
                    key={pill.id}
                    whileTap={{ scale: 0.93 }}
                    onClick={pill.onClick}
                    className={`hotel-filter-pill ${pill.isActive ? 'active' : ''}`}
                >
                    {pill.icon}
                    <span>{pill.label}</span>
                    {pill.badge && (
                        <span className="hotel-filter-badge">{pill.badge}</span>
                    )}
                </motion.button>
            ))}
        </div>
    );
};

export default FilterBar;
