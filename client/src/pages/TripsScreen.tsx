import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Wallet, Briefcase } from 'lucide-react';
import { useTripAssistantStore } from '../features/trip-assistant/store/useTripAssistantStore';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'upcoming': return 'var(--color-primary)';
        case 'draft': return 'var(--color-accent)';
        case 'final': return 'var(--color-success)';
        case 'completed': return 'var(--color-text-muted)';
        default: return 'var(--color-text-secondary)';
    }
};

const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (startDate: string, totalDays: number) => {
    if (!startDate) return 'TBD';
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + totalDays);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

export const TripsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');
    const { trips, fetchTrips, isLoadingTrips } = useTripAssistantStore();

    useEffect(() => {
        fetchTrips('test-user-id');
    }, [fetchTrips]);

    const displayTrips = trips.filter(() => {
        if (activeTab === 'all') return true;
        // simplistic filter for now
        return true;
    });

    return (
        <div className="mobile-screen">
            {/* Header */}
            <header className="mobile-trips-header">
                <h1>My Trips</h1>
                <button className="mobile-add-btn">
                    <Plus size={24} />
                </button>
            </header>

            {/* Tabs */}
            <div className="mobile-tabs">
                {(['all', 'upcoming', 'completed'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`mobile-tab ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Trips List */}
            <div className="mobile-trips-list">
                {isLoadingTrips ? (
                    <div className="mobile-empty-state">
                        <p>Loading trips...</p>
                    </div>
                ) : displayTrips.length === 0 ? (
                    <div className="mobile-empty-state">
                        <Briefcase size={64} className="text-[var(--color-text-light)]" />
                        <h3>No trips yet</h3>
                        <p>Start planning your next adventure!</p>
                    </div>
                ) : (
                    displayTrips.map((trip, index) => {
                        const budgetTotal = (trip.budget || []).reduce((sum, exp) => sum + exp.amount, 0);
                        return (
                            <motion.div
                                key={trip.tripId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="mobile-trip-card"
                            >
                                <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop" alt={trip.destination} className="mobile-trip-image" />

                                <div
                                    className="mobile-trip-status"
                                    style={{ '--status-color': getStatusColor(trip.status) } as React.CSSProperties}
                                >
                                    <span className="status-dot" />
                                    {getStatusLabel(trip.status)}
                                </div>

                                <div className="mobile-trip-info">
                                    <h3>{trip.destination}</h3>
                                    <div className="mobile-trip-meta">
                                        <Calendar size={14} />
                                        <span>{formatDate(trip.startDate, trip.totalDays)}</span>
                                    </div>
                                    <div className="mobile-trip-details">
                                        <div className="mobile-trip-detail">
                                            <Clock size={16} className="text-[var(--color-primary)]" />
                                            <span>{trip.totalDays} days</span>
                                        </div>
                                        <div className="mobile-trip-detail">
                                            <Wallet size={16} className="text-[var(--color-primary)]" />
                                            <span>${budgetTotal.toLocaleString()} spent</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* Bottom spacing */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default TripsScreen;
