import { motion } from 'framer-motion';
import { useState } from 'react';
import type { DayItinerary } from '../../types';
import { DayTimeline } from './DayTimeline';
import { greekItineraryDays } from '../../data/itinerary';

interface ItineraryPanelProps {
    days?: DayItinerary[];
    onDaySelect?: (dayNumber: number) => void;
    selectedDay?: number;
}

export const ItineraryPanel: React.FC<ItineraryPanelProps> = ({
    days = greekItineraryDays,
    onDaySelect,
    selectedDay = 1
}) => {
    const [expandedDay, setExpandedDay] = useState<number | null>(selectedDay);

    const handleDayToggle = (dayNumber: number) => {
        setExpandedDay(expandedDay === dayNumber ? null : dayNumber);
        onDaySelect?.(dayNumber);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
        h-full
        overflow-y-auto
        p-4
        space-y-3
        no-scrollbar
      "
        >
            {days.map((day, index) => (
                <motion.div
                    key={day.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <DayTimeline
                        day={day}
                        isActive={expandedDay === day.dayNumber}
                        onToggle={() => handleDayToggle(day.dayNumber)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
};
