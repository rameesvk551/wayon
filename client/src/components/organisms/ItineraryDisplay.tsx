import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    MapPin, Calendar, Clock, Train, Car, Plane, Bus,
    Camera, Sparkles, CheckCircle2, AlertCircle,
    Palmtree, Building, FileDown, Loader2, PencilLine
} from 'lucide-react';

// Types matching the backend itinerary-generator output
interface TravelDayPlan {
    day: number;
    type: 'travel';
    description: string;
}

interface SightseeingDayPlan {
    day: number;
    region?: string;
    activities: string[];
    totalDurationHours: number;
}

interface LeisureDayPlan {
    day: number;
    type: 'leisure';
    description: string;
}

type DayPlan = TravelDayPlan | SightseeingDayPlan | LeisureDayPlan;

interface ItineraryOutput {
    destination: string;
    totalDays: number;
    dailyPlan: DayPlan[];
    unassignedAttractions?: string[];
    warnings?: string[];
}

interface ItineraryDisplayProps {
    itinerary: ItineraryOutput;
    itineraryTripId?: string;
    preferences?: {
        companions?: string;
        budget?: string;
        interests?: string[];
    };
    transportMode?: string;
    isLoading?: boolean;
}

// Helper to determine day type
function isTravelDay(day: DayPlan): day is TravelDayPlan {
    return 'type' in day && day.type === 'travel';
}

function isLeisureDay(day: DayPlan): day is LeisureDayPlan {
    return 'type' in day && day.type === 'leisure';
}

function isSightseeingDay(day: DayPlan): day is SightseeingDayPlan {
    return 'activities' in day && Array.isArray((day as SightseeingDayPlan).activities);
}

// Transport icon mapping
const transportIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
    train: Train,
    public: Bus,
    private: Car,
    flight: Plane,
};

// Day type icons and colors
const dayTypeConfig = {
    travel: { icon: Plane, color: '#3B82F6', bgColor: '#EFF6FF', label: 'Travel Day' },
    sightseeing: { icon: Camera, color: '#10B981', bgColor: '#ECFDF5', label: 'Sightseeing' },
    leisure: { icon: Palmtree, color: '#F59E0B', bgColor: '#FFFBEB', label: 'Leisure Day' },
};

// Loading skeleton component
export const ItinerarySkeleton: React.FC = () => (
    <div className="itinerary-skeleton">
        <div className="skeleton-header">
            <div className="skeleton-line lg" />
            <div className="skeleton-line sm" />
        </div>
        {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-day">
                <div className="skeleton-day-badge" />
                <div className="skeleton-day-content">
                    <div className="skeleton-line md" />
                    <div className="skeleton-line sm" />
                    <div className="skeleton-activities">
                        {[1, 2].map(j => (
                            <div key={j} className="skeleton-activity" />
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Individual day card component
const DayCard: React.FC<{ day: DayPlan; index: number }> = ({ day, index }) => {
    let config = dayTypeConfig.sightseeing;
    let content: React.ReactNode = null;

    if (isTravelDay(day)) {
        config = dayTypeConfig.travel;
        content = (
            <div className="day-travel-content">
                <div className="travel-icon-container" style={{ backgroundColor: config.bgColor }}>
                    <Plane size={24} style={{ color: config.color }} />
                </div>
                <p className="travel-description">{day.description}</p>
            </div>
        );
    } else if (isLeisureDay(day)) {
        config = dayTypeConfig.leisure;
        content = (
            <div className="day-leisure-content">
                <div className="leisure-icon-container" style={{ backgroundColor: config.bgColor }}>
                    <Palmtree size={24} style={{ color: config.color }} />
                </div>
                <p className="leisure-description">{day.description}</p>
                <div className="leisure-suggestions">
                    <span>💆 Spa & Wellness</span>
                    <span>☕ Local Cafes</span>
                    <span>🛍️ Shopping</span>
                </div>
            </div>
        );
    } else if (isSightseeingDay(day)) {
        config = dayTypeConfig.sightseeing;
        content = (
            <div className="day-sightseeing-content">
                <div className="region-header">
                    <MapPin size={16} style={{ color: config.color }} />
                    <span className="region-name">{day.region || 'Sightseeing'}</span>
                    <span className="duration-badge">
                        <Clock size={12} />
                        {day.totalDurationHours}h
                    </span>
                </div>
                <div className="activities-list">
                    {day.activities.map((activity, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="activity-item"
                        >
                            <div className="activity-bullet">
                                <CheckCircle2 size={16} />
                            </div>
                            <span className="activity-name">{activity}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="itinerary-day-card"
        >
            <div className="day-number-badge" style={{ backgroundColor: config.color }}>
                <span>Day {day.day}</span>
            </div>
            <div className="day-type-label" style={{ color: config.color }}>
                {config.label}
            </div>
            <div className="day-content">
                {content}
            </div>
        </motion.div>
    );
};

// Main Itinerary Display Component
export const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({
    itinerary,
    itineraryTripId,
    preferences,
    transportMode,
    isLoading = false,
}) => {
    const [pdfLoading, setPdfLoading] = useState(false);
    const navigate = useNavigate();

    const handleGeneratePdf = async () => {
        setPdfLoading(true);
        try {
            const pdfServiceUrl = 'http://localhost:4010';
            const payload = {
                destination: itinerary.destination,
                totalDays: itinerary.totalDays,
                days: itinerary.dailyPlan.map((day) => {
                    if (isSightseeingDay(day)) {
                        return {
                            day: day.day,
                            city: day.region || itinerary.destination,
                            activities: day.activities.map((a) => ({
                                name: a,
                                description: a,
                                duration: `${(day.totalDurationHours / day.activities.length).toFixed(1)}h`,
                                category: 'sightseeing',
                            })),
                        };
                    }
                    if (isTravelDay(day)) {
                        return {
                            day: day.day,
                            city: itinerary.destination,
                            activities: [{ name: 'Travel', description: day.description, duration: 'Full day', category: 'travel' }],
                        };
                    }
                    // leisure
                    return {
                        day: day.day,
                        city: itinerary.destination,
                        activities: [{ name: 'Leisure', description: (day as LeisureDayPlan).description, duration: 'Full day', category: 'leisure' }],
                    };
                }),
                output: { format: 'A4', includeInfographicCover: true },
            };

            const response = await fetch(`${pdfServiceUrl}/api/v1/generate-itinerary-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/pdf' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error(`PDF generation failed (${response.status})`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${itinerary.destination.replace(/\s+/g, '-')}-itinerary.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Failed to generate PDF. Make sure the PDF service is running.');
        } finally {
            setPdfLoading(false);
        }
    };

    if (isLoading) {
        return <ItinerarySkeleton />;
    }

    const TransportIcon = transportMode ? transportIcons[transportMode] || Bus : Bus;

    return (
        <div className="itinerary-display">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="itinerary-header"
            >
                <div className="itinerary-title-row">
                    <Sparkles size={24} className="text-[var(--color-primary)]" />
                    <h2>Your {itinerary.destination} Itinerary</h2>
                </div>
                <p className="itinerary-subtitle">
                    {itinerary.totalDays} days of adventure planned just for you
                </p>
                
                {/* Quick Stats */}
                <div className="itinerary-stats">
                    <div className="stat-item">
                        <Calendar size={18} />
                        <span>{itinerary.totalDays} Days</span>
                    </div>
                    <div className="stat-item">
                        <TransportIcon size={18} />
                        <span className="capitalize">{transportMode || 'Public'}</span>
                    </div>
                    {preferences?.budget && (
                        <div className="stat-item">
                            <Building size={18} />
                            <span className="capitalize">{preferences.budget}</span>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Warnings */}
            {itinerary.warnings && itinerary.warnings.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="itinerary-warnings"
                >
                    {itinerary.warnings.map((warning, i) => (
                        <div key={i} className="warning-item">
                            <AlertCircle size={16} />
                            <span>{warning}</span>
                        </div>
                    ))}
                </motion.div>
            )}

            {/* Day Cards */}
            <div className="itinerary-days">
                {itinerary.dailyPlan.map((day, index) => (
                    <DayCard key={day.day} day={day} index={index} />
                ))}
            </div>

            {/* Unassigned Attractions */}
            {itinerary.unassignedAttractions && itinerary.unassignedAttractions.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="unassigned-attractions"
                >
                    <h4>
                        <AlertCircle size={16} />
                        Couldn't fit these attractions:
                    </h4>
                    <div className="unassigned-list">
                        {itinerary.unassignedAttractions.map((name, i) => (
                            <span key={i} className="unassigned-chip">{name}</span>
                        ))}
                    </div>
                    <p className="unassigned-tip">
                        Consider extending your trip or visiting them on leisure days!
                    </p>
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="itinerary-actions"
            >
                <button
                    className="itinerary-action-btn primary"
                    onClick={handleGeneratePdf}
                    disabled={pdfLoading}
                >
                    {pdfLoading ? <Loader2 size={18} className="animate-spin" /> : <FileDown size={18} />}
                    {pdfLoading ? 'Generating…' : 'Generate PDF'}
                </button>
                <button
                    className="itinerary-action-btn secondary"
                    onClick={() => navigate(`/itinerary/${itineraryTripId || 'demo'}/edit`)}
                    type="button"
                >
                    <PencilLine size={18} />
                    Edit Itinerary
                </button>
            </motion.div>
        </div>
    );
};

export default ItineraryDisplay;
