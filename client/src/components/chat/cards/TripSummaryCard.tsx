import { Sparkles, MapPin, Users, DollarSign, Calendar, Navigation, Car } from 'lucide-react';
import type { TripPreferences } from '../types';

interface TripSummaryCardProps {
    preferences: TripPreferences;
}

const transportLabels: Record<string, string> = {
    public: 'Public Transport',
    train: 'Train',
    private: 'Private Vehicle',
    flight: 'Flight',
};

export const TripSummaryCard = ({ preferences }: TripSummaryCardProps) => (
    <div className="interactive-card summary">
        <div className="interactive-card-header">
            <Sparkles size={20} className="text-white" />
            <h3 className="text-white">Trip Summary</h3>
        </div>

        <div className="summary-items">
            <div className="summary-item">
                <MapPin size={16} />
                <span>{preferences.destination || 'Not selected'}</span>
            </div>
            <div className="summary-item">
                <Users size={16} />
                <span>{preferences.companions || 'Not selected'}</span>
            </div>
            <div className="summary-item">
                <DollarSign size={16} />
                <span>{preferences.budget || 'Not selected'}</span>
            </div>
            <div className="summary-item">
                <Calendar size={16} />
                <span>{preferences.dates || 'Not selected'}</span>
            </div>
            <div className="summary-item">
                <Navigation size={16} />
                <span>From: {preferences.currentLocation || 'Not selected'}</span>
            </div>
            <div className="summary-item">
                <Car size={16} />
                <span>Transport: {preferences.transportMode ? transportLabels[preferences.transportMode] : 'Not selected'}</span>
            </div>
            <div className="summary-item">
                <Sparkles size={16} />
                <span>{preferences.interests.join(', ') || 'Not selected'}</span>
            </div>
        </div>
    </div>
);
