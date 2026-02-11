import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, X } from 'lucide-react';
import type { Country } from '../../data/countries';
import { countries, regions } from '../../data/countries';

interface CountryPickerProps {
    label: string;
    value: Country | null;
    onChange: (country: Country) => void;
    placeholder?: string;
    excludeCode?: string;
}

const CountryPicker: React.FC<CountryPickerProps> = ({
    label,
    value,
    onChange,
    placeholder = 'Select country',
    excludeCode,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeRegion, setActiveRegion] = useState('All Regions');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [isOpen]);

    const filtered = countries.filter((c) => {
        if (excludeCode && c.code === excludeCode) return false;
        const matchSearch = !search ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.code.toLowerCase().includes(search.toLowerCase());
        const matchRegion = activeRegion === 'All Regions' || c.region === activeRegion;
        return matchSearch && matchRegion;
    });

    const popularCountries = filtered.filter(c => c.popular);
    const otherCountries = filtered.filter(c => !c.popular);

    const handleSelect = (country: Country) => {
        onChange(country);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="visa-country-picker" ref={dropdownRef}>
            <label className="visa-country-picker-label">{label}</label>
            <button
                className={`visa-country-picker-trigger ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                {value ? (
                    <div className="visa-country-picker-value">
                        <span className="visa-country-flag">{value.flag}</span>
                        <span className="visa-country-name">{value.name}</span>
                    </div>
                ) : (
                    <span className="visa-country-picker-placeholder">{placeholder}</span>
                )}
                <ChevronDown
                    size={18}
                    className={`visa-country-picker-arrow ${isOpen ? 'rotated' : ''}`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="visa-country-dropdown"
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Search */}
                        <div className="visa-dropdown-search">
                            <Search size={16} className="visa-dropdown-search-icon" />
                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search countries..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="visa-dropdown-search-input"
                            />
                            {search && (
                                <button
                                    className="visa-dropdown-search-clear"
                                    onClick={() => setSearch('')}
                                    type="button"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* Region Chips */}
                        <div className="visa-dropdown-regions">
                            {regions.map((region) => (
                                <button
                                    key={region}
                                    className={`visa-region-chip ${activeRegion === region ? 'active' : ''}`}
                                    onClick={() => setActiveRegion(region)}
                                    type="button"
                                >
                                    {region}
                                </button>
                            ))}
                        </div>

                        {/* Country List */}
                        <div className="visa-dropdown-list">
                            {!search && popularCountries.length > 0 && (
                                <>
                                    <div className="visa-dropdown-group-label">Popular</div>
                                    {popularCountries.map((country) => (
                                        <button
                                            key={country.code}
                                            className={`visa-dropdown-item ${value?.code === country.code ? 'selected' : ''}`}
                                            onClick={() => handleSelect(country)}
                                            type="button"
                                        >
                                            <span className="visa-country-flag">{country.flag}</span>
                                            <span className="visa-country-name">{country.name}</span>
                                            {value?.code === country.code && (
                                                <span className="visa-dropdown-check">✓</span>
                                            )}
                                        </button>
                                    ))}
                                </>
                            )}

                            {(!search && otherCountries.length > 0) && (
                                <div className="visa-dropdown-group-label">All Countries</div>
                            )}
                            {(search ? filtered : otherCountries).map((country) => (
                                <button
                                    key={country.code}
                                    className={`visa-dropdown-item ${value?.code === country.code ? 'selected' : ''}`}
                                    onClick={() => handleSelect(country)}
                                    type="button"
                                >
                                    <span className="visa-country-flag">{country.flag}</span>
                                    <span className="visa-country-name">{country.name}</span>
                                    {value?.code === country.code && (
                                        <span className="visa-dropdown-check">✓</span>
                                    )}
                                </button>
                            ))}

                            {filtered.length === 0 && (
                                <div className="visa-dropdown-empty">
                                    No countries found for "{search}"
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CountryPicker;
