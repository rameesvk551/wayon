import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface HeroSectionProps {
    onSearch?: (query: string) => void;
}

const trendingSearches: string[] = [];

export const HeroSection: React.FC<HeroSectionProps> = ({
    onSearch
}) => {
    const [searchValue, setSearchValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            onSearch?.(searchValue);
        }
    };

    const handleTrendingClick = (search: string) => {
        setSearchValue(search);
        inputRef.current?.focus();
    };

    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80"
                    alt="Travel destination"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                {/* AI Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm mb-8"
                >
                    <Sparkles size={16} className="text-[var(--color-primary-light)]" />
                    <span>AI-Powered Trip Planning</span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-display text-white mb-6"
                >
                    Where do you want to go?
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-white/80 mb-10 max-w-xl mx-auto"
                >
                    Describe your dream trip and let AI create a personalized itinerary
                </motion.p>

                {/* Search Input */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="relative max-w-2xl mx-auto mb-8"
                >
                    <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                        <Search size={22} className="absolute left-5 text-[var(--color-text-muted)]" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Describe your trip preferences..."
                            className="
                                w-full py-5 pl-14 pr-36
                                text-base text-[var(--color-text-primary)]
                                placeholder:text-[var(--color-text-muted)]
                                outline-none
                            "
                        />
                        <button
                            type="submit"
                            className="
                                absolute right-3
                                flex items-center gap-2
                                px-5 py-2.5
                                bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
                                text-white font-medium
                                rounded-xl
                                hover:shadow-lg
                                transition-all duration-200
                            "
                        >
                            <Sparkles size={16} />
                            Plan Trip
                        </button>
                    </div>
                </motion.form>

                {/* Trending Searches */}
                {trendingSearches.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-2"
                    >
                        <span className="text-sm text-white/60 mr-2">Trending:</span>
                        {trendingSearches.map((search, index) => (
                            <motion.button
                                key={search}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                onClick={() => handleTrendingClick(search)}
                                className="
                                    px-3 py-1.5
                                    text-sm text-white/90
                                    bg-white/10 backdrop-blur-sm
                                    border border-white/20
                                    rounded-full
                                    hover:bg-white/20 hover:border-white/30
                                    transition-all duration-200
                                "
                            >
                                {search}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
                >
                    <div className="w-1 h-2 bg-white/50 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};
