import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TripHeader, ItineraryPanel, MapPanel, RouteOverview } from '../components/organisms';
import { useTripStore } from '../store/tripStore';
import { trips } from '../data/trips';

const ItineraryPage: React.FC = () => {
    const { tripId } = useParams<{ tripId: string }>();
    const { loadTrip, currentTrip, selectedDay, setSelectedDay } = useTripStore();
    const [trip, setTrip] = useState(trips[0]); // Default to first trip

    useEffect(() => {
        if (tripId) {
            loadTrip(tripId);
            const foundTrip = trips.find(t => t.id === tripId);
            if (foundTrip) {
                setTrip(foundTrip);
            }
        }
    }, [tripId, loadTrip]);

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Header */}
            <TripHeader trip={trip} />

            {/* Route Overview */}
            <RouteOverview
                activeStop={selectedDay}
                onStopClick={setSelectedDay}
            />

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Itinerary Panel */}
                <div className="w-[420px] h-full bg-[var(--color-bg-tertiary)] border-r border-[var(--color-border)]">
                    <ItineraryPanel
                        selectedDay={selectedDay}
                        onDaySelect={setSelectedDay}
                    />
                </div>

                {/* Right: Map Panel */}
                <div className="flex-1 h-full">
                    <MapPanel
                        selectedDay={selectedDay}
                        onDaySelect={setSelectedDay}
                    />
                </div>
            </div>
        </div>
    );
};

export default ItineraryPage;
