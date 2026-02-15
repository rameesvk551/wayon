import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Route,
    Download,
    Edit3,
    Clock,
    MapPin,
    CheckCircle,
    AlertTriangle,
    Car,
    Footprints,
    Bike,
    Train,
    ArrowDown,
    Calendar,
} from 'lucide-react';
import { useAttractionStore } from '../../store/useAttractionStore';
import type { TransportLeg, OptimizeRouteResponse, ItineraryResponse } from '../../api/routeOptimizerApi';

// ── Transport mode helpers ────────────────────────────────────────────────
const transportIcon = (travelType: string) => {
    const type = travelType?.toUpperCase() || '';
    if (type.includes('WALK')) return <Footprints size={14} />;
    if (type.includes('CYCLING') || type.includes('BIKE') || type.includes('SCOOTER'))
        return <Bike size={14} />;
    if (type.includes('PUBLIC') || type.includes('TRANSIT') || type.includes('TRAIN') || type.includes('BUS'))
        return <Train size={14} />;
    return <Car size={14} />;
};

const transportLabel = (travelType: string) => {
    const type = travelType?.toUpperCase() || '';
    if (type.includes('WALK')) return 'Walking';
    if (type.includes('CYCLING')) return 'Cycling';
    if (type.includes('SCOOTER')) return 'E-Scooter';
    if (type.includes('PUBLIC') || type.includes('TRANSIT')) return 'Public Transport';
    if (type.includes('TRAIN')) return 'Train';
    if (type.includes('BUS')) return 'Bus';
    if (type.includes('DRIVING') || type.includes('CAR')) return 'Driving';
    return travelType || 'Driving';
};

const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remaining = mins % 60;
    return remaining > 0 ? `${hrs}h ${remaining}m` : `${hrs}h`;
};

const ItineraryResultSheet: React.FC = () => {
    const navigate = useNavigate();
    const {
        isResultSheetOpen,
        setResultSheetOpen,
        itineraryResult,
        pdfResult,
        buildError,
        downloadPdf,
        tripAttractions,
    } = useAttractionStore();

    if (!isResultSheetOpen) return null;

    const handleEdit = () => {
        const tripId = itineraryResult?.jobId || `trip-${Date.now()}`;
        setResultSheetOpen(false);
        navigate(`/itinerary/${tripId}/edit`);
    };

    const handleClose = () => {
        setResultSheetOpen(false);
    };

    // Helper to find attraction name from placeId
    const getAttractionName = (placeId: string) => {
        const found = tripAttractions.find((t) => t.id === placeId);
        return found?.attraction.name || placeId;
    };

    // Check if result is multi-day
    const isMultiDay = itineraryResult && 'dailyPlan' in itineraryResult;
    const multiDayResult = isMultiDay ? (itineraryResult as ItineraryResponse) : null;
    const singleDayResult = !isMultiDay ? (itineraryResult as OptimizeRouteResponse) : null;

    // Build the legs data for single-day fallback — use API legs if available
    const legs: TransportLeg[] = singleDayResult?.legs || [];

    // Stats
    const totalDistKm = isMultiDay
        ? 0 // TODO: sum from dailyPlan if needed, or use summary
        : (singleDayResult?.totalDistanceMeters || 0) / 1000;

    const totalDurationMin = isMultiDay
        ? (multiDayResult?.summary?.totalTravelMinutes || 0) + (multiDayResult?.summary?.totalVisitMinutes || 0)
        : (singleDayResult?.estimatedDurationMinutes || 0);

    const stopsCount = isMultiDay
        ? (multiDayResult?.summary?.assignedAttractions || 0)
        : (singleDayResult?.optimizedOrder?.length || 0);

    return createPortal(
        <AnimatePresence>
            {isResultSheetOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="result-sheet__backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        className="result-sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    >
                        <div className="result-sheet__handle" />

                        <button
                            className="result-sheet__close"
                            onClick={handleClose}
                            type="button"
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>

                        {/* Error State */}
                        {buildError && (
                            <div className="result-sheet__error">
                                <AlertTriangle size={32} />
                                <h3>Build Failed</h3>
                                <p>{buildError}</p>
                            </div>
                        )}

                        {/* Success State */}
                        {itineraryResult && !buildError && (
                            <>
                                <div className="result-sheet__scrollable">
                                    <div className="result-sheet__header">
                                        <CheckCircle size={28} className="result-sheet__check" />
                                        <h3 className="result-sheet__title">Itinerary Ready!</h3>
                                        <p className="result-sheet__subtitle">
                                            Your optimized {isMultiDay ? `${multiDayResult?.numDays}-day ` : ''}route for {stopsCount} attractions
                                        </p>
                                    </div>

                                    {/* Route Stats */}
                                    <div className="result-sheet__stats">
                                        {!isMultiDay && (
                                            <div className="result-sheet__stat">
                                                <Route size={18} />
                                                <span className="result-sheet__stat-value">
                                                    {totalDistKm.toFixed(1)} km
                                                </span>
                                                <span className="result-sheet__stat-label">Total Distance</span>
                                            </div>
                                        )}
                                        {isMultiDay && (
                                            <div className="result-sheet__stat">
                                                <Calendar size={18} />
                                                <span className="result-sheet__stat-value">
                                                    {multiDayResult?.numDays} Days
                                                </span>
                                                <span className="result-sheet__stat-label">Duration</span>
                                            </div>
                                        )}
                                        <div className="result-sheet__stat">
                                            <Clock size={18} />
                                            <span className="result-sheet__stat-value">
                                                {isMultiDay ? Math.round(totalDurationMin / 60) + 'h' : Math.round(totalDurationMin) + 'm'}
                                            </span>
                                            <span className="result-sheet__stat-label">Est. Time</span>
                                        </div>
                                        <div className="result-sheet__stat">
                                            <MapPin size={18} />
                                            <span className="result-sheet__stat-value">
                                                {stopsCount}
                                            </span>
                                            <span className="result-sheet__stat-label">Stops</span>
                                        </div>
                                    </div>

                                    {/* Multi-Day Route Breakdown */}
                                    {isMultiDay && multiDayResult?.dailyPlan && (
                                        <div className="result-sheet__breakdown">
                                            {multiDayResult.dailyPlan.map((day) => (
                                                <div key={day.day} className="result-sheet__day-group">
                                                    <div className="result-sheet__day-header">
                                                        <h4>Day {day.day}</h4>
                                                        <span>{Math.round(day.summary.totalMinutes / 60)}h • {day.stops.length} stops</span>
                                                    </div>

                                                    {day.stops.map((stop, i) => (
                                                        <div key={stop.attractionId}>
                                                            <div className="result-sheet__stop-card">
                                                                <span className="result-sheet__stop-num">{stop.seq}</span>
                                                                <div className="result-sheet__stop-info">
                                                                    <span className="result-sheet__stop-name">
                                                                        {stop.name}
                                                                    </span>
                                                                    <span className="result-sheet__stop-details">
                                                                        {stop.visitDurationMinutes} min visit • Arr: {stop.arrivalTime}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Travel info to next stop (if applicable) */}
                                                            {i < day.stops.length - 1 && (
                                                                <div className="result-sheet__leg">
                                                                    <div className="result-sheet__leg-line">
                                                                        <ArrowDown size={14} />
                                                                    </div>
                                                                    <div className="result-sheet__leg-details">
                                                                        <div className="result-sheet__leg-transport">
                                                                            {transportIcon(day.stops[i + 1].transportMode)}
                                                                            <span>{transportLabel(day.stops[i + 1].transportMode)}</span>
                                                                        </div>
                                                                        <div className="result-sheet__leg-metrics">
                                                                            <span>{day.stops[i + 1].travelFromPrevMinutes} min</span>
                                                                            <span className="result-sheet__leg-separator">•</span>
                                                                            <span>{day.stops[i + 1].distanceFromPrevKm} km</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Single Day / Legacy Route Breakdown */}
                                    {!isMultiDay && singleDayResult && (
                                        <div className="result-sheet__breakdown">
                                            <h4 className="result-sheet__order-title">Route Breakdown</h4>

                                            {singleDayResult.optimizedOrder.map((stop, i) => {
                                                const legAfter = legs[i];
                                                return (
                                                    <div key={stop.placeId}>
                                                        <div className="result-sheet__stop-card">
                                                            <span className="result-sheet__stop-num">{i + 1}</span>
                                                            <div className="result-sheet__stop-info">
                                                                <span className="result-sheet__stop-name">
                                                                    {getAttractionName(stop.placeId)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {legAfter && i < singleDayResult.optimizedOrder.length - 1 && (
                                                            <div className="result-sheet__leg">
                                                                <div className="result-sheet__leg-line">
                                                                    <ArrowDown size={14} />
                                                                </div>
                                                                <div className="result-sheet__leg-details">
                                                                    <div className="result-sheet__leg-transport">
                                                                        {transportIcon(legAfter.travelType)}
                                                                        <span>{transportLabel(legAfter.travelType)}</span>
                                                                    </div>
                                                                    <div className="result-sheet__leg-metrics">
                                                                        <span className="result-sheet__leg-distance">
                                                                            {(legAfter.distanceMeters / 1000).toFixed(1)} km
                                                                        </span>
                                                                        <span className="result-sheet__leg-separator">•</span>
                                                                        <span className="result-sheet__leg-time">
                                                                            {formatDuration(legAfter.travelTimeSeconds)}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Notes */}
                                    {itineraryResult.notes && (
                                        <div className="result-sheet__notes">
                                            <p>{/* Handle notes array if multi-day, or string if single */
                                                Array.isArray(itineraryResult.notes)
                                                    ? itineraryResult.notes.join('. ')
                                                    : itineraryResult.notes
                                            }</p>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="result-sheet__actions">
                                    {pdfResult?.pdfBytesBase64 && (
                                        <button
                                            className="result-sheet__btn result-sheet__btn--secondary"
                                            onClick={downloadPdf}
                                            type="button"
                                        >
                                            <Download size={18} />
                                            Download PDF
                                        </button>
                                    )}
                                    <button
                                        className="result-sheet__btn result-sheet__btn--primary"
                                        onClick={handleEdit}
                                        type="button"
                                    >
                                        <Edit3 size={18} />
                                        Edit Itinerary
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ItineraryResultSheet;
