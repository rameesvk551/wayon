import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Compass, Sparkles } from 'lucide-react';
import { WizardStepCard } from '../../molecules/WizardStepCard';
import { useTripWizard } from '../../../store/TripWizardContext';

// Popular destination suggestions
const popularDestinations = [
    { id: 'paris', name: 'Paris, France', emoji: '🗼' },
    { id: 'tokyo', name: 'Tokyo, Japan', emoji: '🗾' },
    { id: 'bali', name: 'Bali, Indonesia', emoji: '🏝️' },
    { id: 'dubai', name: 'Dubai, UAE', emoji: '🏙️' },
    { id: 'new-york', name: 'New York, USA', emoji: '🗽' },
    { id: 'thailand', name: 'Thailand', emoji: '🐘' },
];

export const DestinationStep: React.FC = () => {
    const { wizardData, setDestination } = useTripWizard();
    const [inputValue, setInputValue] = useState(wizardData.destination || '');
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        setDestination(value);
    };

    const handleSuggestionClick = (name: string) => {
        setInputValue(name);
        setDestination(name);
    };

    return (
        <WizardStepCard
            title="Where do you want to go?"
            subtitle="Enter a city, country, or region"
            icon={<MapPin size={36} />}
        >
            <div className="space-y-8">
                {/* Search Input */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={`
                        relative flex items-center gap-4
                        p-5 rounded-2xl
                        bg-white border-2 transition-all duration-200
                        ${isFocused
                            ? 'border-[var(--color-primary)] shadow-lg ring-4 ring-[var(--color-primary-light)]'
                            : 'border-[var(--color-border)] hover:border-[var(--color-primary-light)]'
                        }
                    `}
                >
                    <Search size={24} className={`
                        transition-colors duration-200
                        ${isFocused ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}
                    `} />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="e.g., Paris, Bali, Japan..."
                        className="
                            flex-1 text-lg
                            bg-transparent outline-none
                            text-[var(--color-text-primary)]
                            placeholder:text-[var(--color-text-light)]
                        "
                    />
                    {inputValue && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="
                                w-8 h-8 rounded-full
                                bg-[var(--color-primary)]
                                flex items-center justify-center
                            "
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </motion.div>
                    )}
                </motion.div>

                {/* AI Suggestion */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSuggestionClick('')}
                    className="
                        w-full p-4 rounded-xl
                        bg-gradient-to-r from-[var(--color-primary-subtle)] to-[var(--color-secondary-subtle)]
                        border border-[var(--color-primary-light)]
                        flex items-center justify-center gap-3
                        text-[var(--color-primary)] font-medium
                        hover:shadow-md transition-all duration-200
                    "
                >
                    <Sparkles size={20} />
                    <span>Let AI surprise me with a destination</span>
                    <Compass size={18} className="animate-spin-slow" />
                </motion.button>

                {/* Popular Destinations */}
                <div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="text-sm font-medium text-[var(--color-text-muted)] mb-4"
                    >
                        Popular destinations
                    </motion.p>
                    <div className="flex flex-wrap gap-3">
                        {popularDestinations.map((dest, index) => (
                            <motion.button
                                key={dest.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSuggestionClick(dest.name)}
                                className={`
                                    inline-flex items-center gap-2
                                    px-4 py-2.5 rounded-full
                                    border-2 transition-all duration-200
                                    font-medium text-sm
                                    ${inputValue === dest.name
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                        : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary-light)]'
                                    }
                                `}
                            >
                                <span>{dest.emoji}</span>
                                <span>{dest.name}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </WizardStepCard>
    );
};
