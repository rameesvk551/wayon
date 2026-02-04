import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Wallet, Briefcase } from 'lucide-react';

// Mock trips data matching mobile app
const mockTrips = [
    {
        id: '1',
        destination: 'Paris, France',
        startDate: '2026-03-15',
        endDate: '2026-03-22',
        budget: 2500,
        status: 'upcoming',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    },
    {
        id: '2',
        destination: 'Tokyo, Japan',
        startDate: '2026-04-10',
        endDate: '2026-04-20',
        budget: 4000,
        status: 'planned',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    },
    {
        id: '3',
        destination: 'Bali, Indonesia',
        startDate: '2025-12-01',
        endDate: '2025-12-08',
        budget: 1800,
        status: 'completed',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    },
];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'upcoming': return 'var(--color-primary)';
        case 'planned': return 'var(--color-accent)';
        case 'completed': return 'var(--color-text-muted)';
        default: return 'var(--color-text-secondary)';
    }
};

const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
};

const getDaysDiff = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
};

export const TripsScreen: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all');

    const displayTrips = mockTrips.filter((trip) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'upcoming') return trip.status === 'upcoming' || trip.status === 'planned';
        return trip.status === 'completed';
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
                {displayTrips.length === 0 ? (
                    <div className="mobile-empty-state">
                        <Briefcase size={64} className="text-[var(--color-text-light)]" />
                        <h3>No trips yet</h3>
                        <p>Start planning your next adventure!</p>
                    </div>
                ) : (
                    displayTrips.map((trip, index) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="mobile-trip-card"
                        >
                            <img src={trip.image} alt={trip.destination} className="mobile-trip-image" />

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
                                    <span>{formatDate(trip.startDate, trip.endDate)}</span>
                                </div>
                                <div className="mobile-trip-details">
                                    <div className="mobile-trip-detail">
                                        <Clock size={16} className="text-[var(--color-primary)]" />
                                        <span>{getDaysDiff(trip.startDate, trip.endDate)} days</span>
                                    </div>
                                    <div className="mobile-trip-detail">
                                        <Wallet size={16} className="text-[var(--color-primary)]" />
                                        <span>${trip.budget.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Bottom spacing */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default TripsScreen;
