import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpDown, Sparkles, Clock, Trash2 } from 'lucide-react';
import CountryPicker from '../components/visa/CountryPicker';
import VisaResultCard from '../components/visa/VisaResultCard';
import type { Country } from '../data/countries';
import type { VisaInfo } from '../data/visaData';
import { checkVisa } from '../api/visaApi';

interface RecentSearch {
    from: string;
    to: string;
    fromFlag: string;
    toFlag: string;
    fromName: string;
    toName: string;
    timestamp: number;
}

const VisaCheckerPage: React.FC = () => {
    const [citizenship, setCitizenship] = useState<Country | null>(null);
    const [destination, setDestination] = useState<Country | null>(null);
    const [result, setResult] = useState<VisaInfo | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('visa-recent-searches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch { /* ignore */ }
        }
    }, []);

    const saveRecentSearch = (from: Country, to: Country) => {
        const newSearch: RecentSearch = {
            from: from.code,
            to: to.code,
            fromFlag: from.flag,
            toFlag: to.flag,
            fromName: from.name,
            toName: to.name,
            timestamp: Date.now(),
        };
        const updated = [newSearch, ...recentSearches.filter(
            s => !(s.from === from.code && s.to === to.code)
        )].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('visa-recent-searches', JSON.stringify(updated));
    };

    const handleCheck = async () => {
        if (!citizenship || !destination) return;
        setIsLoading(true);
        setError(null);

        try {
            const info = await checkVisa(citizenship.code, destination.code);
            setResult(info);
            setShowResult(true);
            saveRecentSearch(citizenship, destination);
        } catch (err: any) {
            setError(
                err?.message ||
                `Visa information for ${citizenship.name} → ${destination.name} is not available right now. Please try again.`
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwap = () => {
        const temp = citizenship;
        setCitizenship(destination);
        setDestination(temp);
    };

    const handleBack = () => {
        setShowResult(false);
        setResult(null);
    };

    const handleRecentClick = async (search: RecentSearch) => {
        const { getCountryByCode } = await import('../data/countries');
        const from = getCountryByCode(search.from);
        const to = getCountryByCode(search.to);
        if (from && to) {
            setCitizenship(from);
            setDestination(to);
            setIsLoading(true);
            setError(null);
            try {
                const info = await checkVisa(search.from, search.to);
                setResult(info);
                setShowResult(true);
            } catch {
                // silently fail for recent searches
            } finally {
                setIsLoading(false);
            }
        }
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('visa-recent-searches');
    };

    if (showResult && result) {
        return (
            <div className="visa-checker-page">
                <VisaResultCard
                    visaInfo={result}
                    onBack={handleBack}
                    onShare={() => {
                        if (navigator.share) {
                            navigator.share({ title: 'Visa Requirements', text: `Visa info for ${result.from} → ${result.to}` });
                        }
                    }}
                    onSave={() => { }}
                />
            </div>
        );
    }

    return (
        <div className="visa-checker-page">
            <motion.div
                className="visa-checker-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Hero */}
                <div className="visa-checker-hero">
                    <motion.div
                        className="visa-checker-icon"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                    >
                        ✈️
                    </motion.div>
                    <h1 className="visa-checker-title">Check Visa Requirements Instantly</h1>
                    <p className="visa-checker-subtitle">
                        Find out if you need a visa, what documents are required, and how to apply.
                    </p>
                </div>

                {/* Form Card */}
                <motion.div
                    className="visa-checker-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <CountryPicker
                        label="Your citizenship"
                        value={citizenship}
                        onChange={setCitizenship}
                        placeholder="Where are you from?"
                        excludeCode={destination?.code}
                    />

                    {/* Swap Button */}
                    <div className="visa-swap-container">
                        <motion.button
                            className="visa-swap-btn"
                            onClick={handleSwap}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9, rotate: 180 }}
                            type="button"
                            disabled={!citizenship && !destination}
                        >
                            <ArrowUpDown size={18} />
                        </motion.button>
                    </div>

                    <CountryPicker
                        label="Destination"
                        value={destination}
                        onChange={setDestination}
                        placeholder="Where do you want to go?"
                        excludeCode={citizenship?.code}
                    />

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className="visa-checker-error"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* CTA */}
                    <motion.button
                        className="visa-check-btn"
                        onClick={handleCheck}
                        disabled={!citizenship || !destination || isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                    >
                        {isLoading ? (
                            <div className="visa-check-btn-loading">
                                <motion.div
                                    className="visa-spinner"
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                />
                                Checking...
                            </div>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Check Requirements
                            </>
                        )}
                    </motion.button>
                </motion.div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                    <motion.div
                        className="visa-recent-section"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="visa-recent-header">
                            <h3 className="visa-recent-title">
                                <Clock size={16} />
                                Recent Searches
                            </h3>
                            <button className="visa-recent-clear" onClick={clearRecent} type="button">
                                <Trash2 size={14} />
                                Clear
                            </button>
                        </div>
                        <div className="visa-recent-list">
                            {recentSearches.map((search, i) => (
                                <motion.button
                                    key={`${search.from}-${search.to}`}
                                    className="visa-recent-item"
                                    onClick={() => handleRecentClick(search)}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                >
                                    <span>{search.fromFlag}</span>
                                    <span className="visa-recent-arrow">→</span>
                                    <span>{search.toFlag}</span>
                                    <span className="visa-recent-names">
                                        {search.fromName} → {search.toName}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default VisaCheckerPage;
