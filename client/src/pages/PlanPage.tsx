import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TripTopBar } from '../components/organisms/TripTopBar';
import { PlanItineraryPanel } from '../components/organisms/PlanItineraryPanel';
import { CompactMapPanel } from '../components/organisms/CompactMapPanel';
import { InlineAIInput } from '../components/molecules/InlineAIInput';
import { greekItineraryDays } from '../data/itinerary';

const PlanPage: React.FC = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [activeDay, setActiveDay] = useState(1);
    const [isAILoading, setIsAILoading] = useState(false);

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
        // Simulate AI response
        setTimeout(() => {
            setIsAILoading(false);
        }, 2000);
    };

    const handleAIAction = (action: string) => {
        console.log('AI Action:', action);
        setIsAILoading(true);
        setTimeout(() => {
            setIsAILoading(false);
        }, 1500);
    };

    const handleMarkerClick = (markerId: string) => {
        // Find day by marker ID
        const marker = [
            { id: 'athens', day: 1 },
            { id: 'mykonos', day: 3 },
            { id: 'santorini', day: 5 }
        ].find(m => m.id === markerId);
        if (marker) {
            setActiveDay(marker.day);
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Top Bar */}
            <TripTopBar
                tripName="Greek Island Adventure"
                startDate="Mar 15"
                endDate="Mar 22"
                travelers={2}
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
                            days={greekItineraryDays}
                            onDayClick={handleDayClick}
                        />
                    </div>

                    {/* Fixed AI Input at Bottom */}
                    <InlineAIInput
                        onSubmit={handleAISubmit}
                        onActionClick={handleAIAction}
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
