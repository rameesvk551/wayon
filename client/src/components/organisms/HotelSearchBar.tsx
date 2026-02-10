import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, Users, ChevronDown, ChevronUp, X, MapPin } from 'lucide-react';
import { useHotelStore } from '../../store/useHotelStore';
import { destinationSuggestions } from '../../data/hotelListingData';

export const HotelSearchBar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const {
        destination, setDestination,
        checkIn, setCheckIn,
        checkOut, setCheckOut,
        guests, setGuests,
        setSearchQuery,
    } = useHotelStore();

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchInput = (val: string) => {
        setDestination(val);
        setShowSuggestions(val.length > 0);
    };

    const filteredSuggestions = destinationSuggestions.filter((s) =>
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

    // Compact mode (collapsed)
    if (!isExpanded) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="hotel-search-compact"
                onClick={() => setIsExpanded(true)}
            >
                <div className="hotel-search-compact-icon">
                    <Search size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="hotel-search-compact-content">
                    <span className="hotel-search-compact-title">{destination || 'Where to?'}</span>
                    <span className="hotel-search-compact-subtitle">
                        {checkIn || 'Any dates'} · {guests} guest{guests > 1 ? 's' : ''}
                    </span>
                </div>
                <button className="hotel-search-compact-edit">
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
            className="hotel-search-expanded"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-800">Edit Search</h3>
                <button
                    onClick={() => { setIsExpanded(false); setShowSuggestions(false); }}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronUp size={18} className="text-gray-500" />
                </button>
            </div>

            {/* Destination */}
            <div className="hotel-search-field relative">
                <MapPin size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <input
                    ref={inputRef}
                    type="text"
                    value={destination}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    onFocus={() => setShowSuggestions(destination.length > 0)}
                    placeholder="Where are you going?"
                    className="hotel-search-input"
                />
                {destination && (
                    <button onClick={() => { setDestination(''); setSearchQuery(''); setShowSuggestions(false); }} className="p-1 rounded-full hover:bg-gray-100">
                        <X size={14} className="text-gray-400" />
                    </button>
                )}
            </div>

            {/* Suggestions dropdown */}
            <AnimatePresence>
                {showSuggestions && filteredSuggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="hotel-search-suggestions"
                    >
                        {filteredSuggestions.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => selectSuggestion(s.name)}
                                className="hotel-search-suggestion-item"
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

            {/* Date Row */}
            <div className="flex gap-2 mt-2">
                <div className="hotel-search-field flex-1">
                    <Calendar size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        placeholder="Check-in"
                        className="hotel-search-input text-xs"
                    />
                </div>
                <div className="hotel-search-field flex-1">
                    <Calendar size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        placeholder="Check-out"
                        className="hotel-search-input text-xs"
                    />
                </div>
            </div>

            {/* Guests */}
            <div className="hotel-search-field mt-2">
                <Users size={14} className="text-[var(--color-primary)] flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1">
                    {guests} Guest{guests > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setGuests(guests - 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        −
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{guests}</span>
                    <button
                        onClick={() => setGuests(guests + 1)}
                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm font-bold text-gray-500 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Search Button */}
            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => { setIsExpanded(false); setShowSuggestions(false); setSearchQuery(destination); }}
                className="hotel-search-btn mt-3"
            >
                <Search size={16} />
                Search Hotels
            </motion.button>
        </motion.div>
    );
};

export default HotelSearchBar;
