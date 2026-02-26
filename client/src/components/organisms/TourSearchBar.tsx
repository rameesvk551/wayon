import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, ChevronDown, ChevronUp, X, MapPin, Tag } from 'lucide-react';
import { useTourStore } from '../../store/useTourStore';
import { tourDestinations, tourCategories } from '../../data/tourListingData';

export const TourSearchBar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const {
        destination, setDestination,
        date, setDate,
        tourType, setTourType,
        setSearchQuery,
    } = useTourStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchInput = (val: string) => {
        setDestination(val);
        setShowSuggestions(val.length > 0);
    };

    const filteredSuggestions = tourDestinations.filter((s) =>
        s.name.toLowerCase().includes(destination.toLowerCase())
    );

    const selectSuggestion = (name: string) => {
        setDestination(name);
        setShowSuggestions(false);
        setSearchQuery(name);
    };

    useEffect(() => {
        if (isExpanded && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isExpanded]);

    // Compact mode
    if (!isExpanded) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="tour-search-compact"
                onClick={() => setIsExpanded(true)}
            >
                <div className="tour-search-compact-icon">
                    <Search size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="tour-search-compact-content">
                    <span className="tour-search-compact-title">{destination || 'Where do you want to explore?'}</span>
                    <span className="tour-search-compact-subtitle">
                        {date || 'Any dates'} · {tourType || 'All types'}
                    </span>
                </div>
                <button className="tour-search-compact-edit">
                    <ChevronDown size={16} />
                </button>
            </motion.div>
        );
    }

    // Expanded mode
    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="tour-search-expanded"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800">Find Tours</h3>
                <button
                    onClick={() => { setIsExpanded(false); setShowSuggestions(false); }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronUp size={18} className="text-gray-500" />
                </button>
            </div>

            {/* Destination */}
            <div className="tour-search-field relative">
                <MapPin size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={destination}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onFocus={() => setShowSuggestions(destination.length > 0)}
                    placeholder="Where are you going?"
                    className="tour-search-input"
                />
                {destination && (
                    <button onClick={() => { setDestination(''); setSearchQuery(''); setShowSuggestions(false); }} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={14} className="text-gray-400" />
                    </button>
                )}
            </div>

            {/* Suggestions */}
            <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="tour-search-suggestions"
                    >
                        {filteredSuggestions.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => selectSuggestion(s.name)}
                                className="tour-search-suggestion-item"
                            >
                                <span className="text-lg">{s.icon}</span>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-medium text-gray-800">{s.name}</p>
                                    <p className="text-[11px] text-gray-400">{s.subtitle}</p>
                                </div>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Date & Tour Type */}
            <div className="flex gap-2 mt-2">
                <div className="tour-search-field flex-1">
                    <Calendar size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="When?"
                        className="tour-search-input text-xs"
                    />
                </div>
                <div className="tour-search-field flex-1">
                    <Tag size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                    <select
                        value={tourType}
                        onChange={(e) => setTourType(e.target.value)}
                        className="tour-search-input text-xs bg-transparent"
                    >
                        <option value="">All Types</option>
                        {tourCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search Button */}
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                    setIsExpanded(false);
                    setShowSuggestions(false);
                    setSearchQuery(destination);
                    if (tourType) {
                        useTourStore.getState().setFilters({ categories: tourType ? [tourType as any] : [] });
                    }
                    // Trigger API fetch with resolved coordinates
                    useTourStore.getState().fetchTours();
                }}
                className="tour-search-btn mt-3"
            >
                <Search size={16} />
                Search Tours
            </motion.button>
        </motion.div>
    );
};

export default TourSearchBar;
