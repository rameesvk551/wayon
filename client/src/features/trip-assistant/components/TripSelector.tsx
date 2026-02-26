import { useEffect } from 'react';
import { useTripAssistantStore } from '../store/useTripAssistantStore';

export const TripSelector = () => {
    const { trips, activeTripId, isLoadingTrips, fetchTrips, selectTrip } = useTripAssistantStore();

    useEffect(() => {
        // Hardcoded userId for now, ideally fetched from auth context
        fetchTrips('test-user-id');
    }, [fetchTrips]);

    if (isLoadingTrips) {
        return <div className="text-sm text-slate-500 py-2">Loading trips...</div>;
    }

    if (trips.length === 0) {
        return <div className="text-sm text-slate-500 py-2">No trips available. Go to Discover to plan one!</div>;
    }

    return (
        <div className="mb-4">
            <label htmlFor="trip-selector" className="block text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 mb-1">
                Select Trip
            </label>
            <select
                id="trip-selector"
                value={activeTripId || ''}
                onChange={(e) => selectTrip(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
                {trips.map((trip) => (
                    <option key={trip.tripId} value={trip.tripId}>
                        {trip.tripName} ({trip.destination})
                    </option>
                ))}
            </select>
        </div>
    );
};
