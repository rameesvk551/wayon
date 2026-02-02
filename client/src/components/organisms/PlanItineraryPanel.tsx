import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DayTimeline } from './DayTimeline';
import { AISuggestionCard } from '../molecules/AISuggestionCard';
import type { DayItinerary } from '../../types';
import { greekItineraryDays } from '../../data/itinerary';

interface PlanItineraryPanelProps {
    days?: DayItinerary[];
    onDayClick?: (dayNumber: number) => void;
    onReorder?: (days: DayItinerary[]) => void;
    showAISuggestion?: boolean;
}

export const PlanItineraryPanel: React.FC<PlanItineraryPanelProps> = ({
    days = greekItineraryDays,
    onDayClick,
    onReorder,
    showAISuggestion = true
}) => {
    const [expandedDay, setExpandedDay] = useState<number>(1);
    const [orderedDays, setOrderedDays] = useState(days);
    const [showSuggestion, setShowSuggestion] = useState(showAISuggestion);

    const handleDayToggle = (dayNumber: number) => {
        setExpandedDay(expandedDay === dayNumber ? -1 : dayNumber);
        onDayClick?.(dayNumber);
    };

    const handleReorder = (newOrder: DayItinerary[]) => {
        setOrderedDays(newOrder);
        onReorder?.(newOrder);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-[var(--color-border)]">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        Your Itinerary
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        {orderedDays.length} days • Drag to reorder
                    </p>
                </div>
                <button className="
                    flex items-center gap-2
                    px-3 py-1.5
                    text-sm font-medium
                    text-[var(--color-primary)]
                    bg-[var(--color-primary-subtle)]
                    rounded-lg
                    hover:bg-[var(--color-primary-light)]
                    transition-colors
                ">
                    <Plus size={16} />
                    Add Day
                </button>
            </div>

            {/* Scrollable Days List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <Reorder.Group
                    axis="y"
                    values={orderedDays}
                    onReorder={handleReorder}
                    className="space-y-3"
                >
                    {orderedDays.map((day, index) => (
                        <Reorder.Item
                            key={day.id}
                            value={day}
                            className="cursor-grab active:cursor-grabbing"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <DayTimeline
                                    day={day}
                                    isActive={expandedDay === day.dayNumber}
                                    onToggle={() => handleDayToggle(day.dayNumber)}
                                />
                            </motion.div>

                            {/* AI Suggestion (show after first day) */}
                            <AnimatePresence>
                                {showSuggestion && index === 0 && expandedDay === day.dayNumber && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3"
                                    >
                                        <AISuggestionCard
                                            title="Acropolis Museum"
                                            description="Perfect addition after your Acropolis visit - just 5 min walk. World-class ancient Greek artifacts."
                                            type="attraction"
                                            image="https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=80"
                                            onAccept={() => setShowSuggestion(false)}
                                            onDismiss={() => setShowSuggestion(false)}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {/* Add More Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="
                        flex items-center justify-center
                        py-8
                        border-2 border-dashed border-[var(--color-border)]
                        rounded-xl
                        text-[var(--color-text-muted)]
                        hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
                        cursor-pointer
                        transition-colors
                    "
                >
                    <Plus size={20} className="mr-2" />
                    <span className="text-sm font-medium">Add another day</span>
                </motion.div>
            </div>
        </div>
    );
};
