import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Sparkles } from 'lucide-react';
import { useAttractionStore } from '../../store/useAttractionStore';

const TripMiniBar: React.FC = () => {
    const { tripAttractions, totalDurationMinutes, setTripSheetOpen, buildItinerary, isBuilding } =
        useAttractionStore();

    const count = tripAttractions.length;
    if (count === 0) return null;

    const totalMins = totalDurationMinutes();
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    const durationText = hours > 0
        ? `${hours}h ${mins > 0 ? `${mins}m` : ''}`
        : `${mins}m`;

    return (
        <AnimatePresence>
            <motion.div
                className="trip-mini-bar"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            >
                <div className="trip-mini-bar__info" onClick={() => setTripSheetOpen(true)}>
                    <div className="trip-mini-bar__count">
                        <MapPin size={16} />
                        <strong>{count}</strong> place{count > 1 ? 's' : ''} added
                    </div>
                    <div className="trip-mini-bar__duration">
                        <Clock size={14} />
                        {durationText}
                    </div>
                </div>

                <div className="trip-mini-bar__actions">
                    {count >= 2 && (
                        <button
                            className="trip-mini-bar__build"
                            onClick={buildItinerary}
                            type="button"
                            disabled={isBuilding}
                        >
                            <Sparkles size={14} />
                            {isBuilding ? 'Building...' : 'Build'}
                        </button>
                    )}
                    <button
                        className="trip-mini-bar__btn"
                        onClick={() => setTripSheetOpen(true)}
                        type="button"
                    >
                        View <ChevronRight size={16} />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TripMiniBar;
