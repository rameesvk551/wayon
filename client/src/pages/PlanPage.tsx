import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TripTopBar } from '../components/organisms/TripTopBar';
import { PlanItineraryPanel } from '../components/organisms/PlanItineraryPanel';
import { CompactMapPanel } from '../components/organisms/CompactMapPanel';
import { InlineAIInput } from '../components/molecules/InlineAIInput';
import type { DayItinerary } from '../types';

const PlanPage: React.FC = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [activeDay, setActiveDay] = useState(1);
    const [isAILoading, setIsAILoading] = useState(false);
    const [days, setDays] = useState<DayItinerary[]>([]);

    const handleModeSwitch = (mode: 'plan' | 'review') => {
        if (mode === 'review') {
            navigate(`/review/${tripId || 'trip-1'}`);
        }
    };

    const handleDayClick = (dayNumber: number) => {
        setActiveDay(dayNumber);
    };

    const handleAISubmit = (message: string) => {
        console.log('AI Request:', message);
        setIsAILoading(true);
        setIsAILoading(false);
    };

    const handleAIAction = (action: string) => {
        console.log('AI Action:', action);
        setIsAILoading(true);
        setIsAILoading(false);
    };

    const handleMarkerClick = (markerId: string) => {
        const matchingDay = days.find((day) => day.id === markerId);
        if (matchingDay) {
            setActiveDay(matchingDay.dayNumber);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Top Bar */}
            <TripTopBar
                tripName="Your Trip"
                startDate="--"
                endDate="--"
                travelers={0}
                currentMode="plan"
                onModeSwitch={handleModeSwitch}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Itinerary Panel (60-65%) */}
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-[62%] flex flex-col border-r border-[var(--color-border)]"
                >
                    {/* Scrollable Itinerary */}
                    <div className="flex-1 overflow-hidden">
                        <PlanItineraryPanel
                            days={days}
                            onReorder={setDays}
                            onDayClick={handleDayClick}
                        />
                    </div>

                    {/* Fixed AI Input at Bottom */}
                    <InlineAIInput
                        onSubmit={handleAISubmit}
                        isLoading={isAILoading}
                        placeholder="Ask AI to modify your trip..."
                    />
                </motion.div>

                {/* Right: Map Panel (35-38%) */}
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex-1"
                >
                    <CompactMapPanel
                        activeDay={activeDay}
                        onMarkerClick={handleMarkerClick}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default PlanPage;
