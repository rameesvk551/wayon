import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarHeart, Shuffle } from 'lucide-react';
import { WizardStepCard } from '../../molecules/WizardStepCard';
import { useTripWizard } from '../../../store/TripWizardContext';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export const DatesStep: React.FC = () => {
    const { wizardData, setDates } = useTripWizard();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();

    const [selectedYear, setSelectedYear] = useState(wizardData.dates?.year || currentYear.toString());
    const [selectedMonth, setSelectedMonth] = useState(wizardData.dates?.month || months[currentMonth]);
    const [isFlexible, setIsFlexible] = useState(wizardData.dates?.flexible || false);

    useEffect(() => {
        setDates({
            month: selectedMonth,
            year: selectedYear,
            flexible: isFlexible
        });
    }, [selectedMonth, selectedYear, isFlexible, setDates]);

    const years = [currentYear, currentYear + 1, currentYear + 2].map(String);

    return (
        <WizardStepCard
            title="When do you want to travel?"
            subtitle="Pick your preferred dates"
            icon={<CalendarHeart size={36} />}
        >
            <div className="space-y-8">
                {/* Year Selector */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-3">
                        Year
                    </label>
                    <div className="flex gap-3">
                        {years.map((year, index) => (
                            <motion.button
                                key={year}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.08 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedYear(year)}
                                className={`
                                    flex-1 py-3 px-6 rounded-xl
                                    font-semibold text-lg
                                    border-2 transition-all duration-200
                                    ${selectedYear === year
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                        : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary-light)]'
                                    }
                                `}
                            >
                                {year}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Month Grid */}
                <div>
                    <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-3">
                        Month
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {months.map((month, index) => {
                            // Disable past months for current year
                            const isPast = selectedYear === currentYear.toString() && index < currentMonth;

                            return (
                                <motion.button
                                    key={month}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.35 + index * 0.03 }}
                                    whileHover={!isPast ? { scale: 1.05 } : {}}
                                    whileTap={!isPast ? { scale: 0.95 } : {}}
                                    onClick={() => !isPast && setSelectedMonth(month)}
                                    disabled={isPast}
                                    className={`
                                        py-3 px-2 rounded-xl
                                        font-medium text-sm
                                        border-2 transition-all duration-200
                                        ${selectedMonth === month && !isPast
                                            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                                            : isPast
                                                ? 'border-[var(--color-border-light)] bg-[var(--color-bg-tertiary)] text-[var(--color-text-light)] cursor-not-allowed'
                                                : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary-light)]'
                                        }
                                    `}
                                >
                                    {month.slice(0, 3)}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Flexible Dates Toggle */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setIsFlexible(!isFlexible)}
                    className={`
                        w-full p-4 rounded-xl
                        border-2 transition-all duration-200
                        flex items-center justify-center gap-3
                        ${isFlexible
                            ? 'border-[var(--color-secondary)] bg-[var(--color-secondary-subtle)] text-[var(--color-secondary)]'
                            : 'border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-secondary-light)]'
                        }
                    `}
                >
                    <Shuffle size={20} />
                    <span className="font-medium">My dates are flexible</span>
                    <div className={`
                        w-10 h-6 rounded-full p-0.5 transition-colors duration-200
                        ${isFlexible ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-border)]'}
                    `}>
                        <motion.div
                            animate={{ x: isFlexible ? 16 : 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="w-5 h-5 rounded-full bg-white shadow"
                        />
                    </div>
                </motion.button>
            </div>
        </WizardStepCard>
    );
};
