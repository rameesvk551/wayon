import { motion, AnimatePresence } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X, GripVertical, Clock, Trash2, MapPin, Minus, Plus, Settings } from 'lucide-react';
import { useAttractionStore, type TripPace, type TravelType } from '../../store/useAttractionStore';
import type { TripAttraction } from '../../types/attraction';
import { useState } from 'react';

// ===== SORTABLE ITEM =====
const SortableItem: React.FC<{
    item: TripAttraction;
    onRemove: (id: string) => void;
}> = ({ item, onRemove }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 10 : 0,
    };

    return (
        <div ref={setNodeRef} style={style} className="trip-item" {...attributes}>
            <button className="trip-item__grip" {...listeners} type="button" aria-label="Drag to reorder">
                <GripVertical size={18} />
            </button>
            <img
                src={item.attraction.image}
                alt={item.attraction.name}
                className="trip-item__img"
                loading="lazy"
            />
            <div className="trip-item__info">
                <h4 className="trip-item__name">{item.attraction.name}</h4>
                <span className="trip-item__duration">
                    <Clock size={12} /> {item.attraction.duration}
                </span>
            </div>
            <button
                className="trip-item__remove"
                onClick={() => onRemove(item.id)}
                type="button"
                aria-label={`Remove ${item.attraction.name}`}
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

// ===== TRIP BUILDER SHEET =====
const TripBuilderSheet: React.FC = () => {
    const {
        tripAttractions,
        isTripSheetOpen,
        setTripSheetOpen,
        removeAttraction,
        reorderAttractions,
        clearTrip,
        totalDurationMinutes,
        buildItinerary,
        isBuilding,
        buildProgress,
        tripSettings,
        setTripSettings,
    } = useAttractionStore();

    const [showSettings, setShowSettings] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = tripAttractions.findIndex((t) => t.id === active.id);
        const newIndex = tripAttractions.findIndex((t) => t.id === over.id);
        reorderAttractions(oldIndex, newIndex);
    };

    const totalMins = totalDurationMinutes();
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    return (
        <AnimatePresence>
            {isTripSheetOpen && (
                <>
                    <motion.div
                        className="filter-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setTripSheetOpen(false)}
                    />
                    <motion.div
                        className="trip-builder-sheet"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    >
                        <div className="filter-sheet__handle-row">
                            <div className="filter-sheet__handle" />
                        </div>

                        <div className="trip-builder__header">
                            <div>
                                <h3>Your Trip</h3>
                                <p className="trip-builder__summary">
                                    <MapPin size={14} /> {tripAttractions.length} place{tripAttractions.length > 1 ? 's' : ''}
                                    {' · '}
                                    <Clock size={14} /> {hours > 0 ? `${hours}h ` : ''}{mins > 0 ? `${mins}m` : ''}
                                </p>
                            </div>
                            <div className="trip-builder__header-actions">
                                <button
                                    className={`trip-builder__settings-btn${showSettings ? ' active' : ''}`}
                                    onClick={() => setShowSettings(!showSettings)}
                                    type="button"
                                    aria-label="Trip settings"
                                >
                                    <Settings size={18} />
                                </button>
                                <button
                                    className="filter-sheet__close"
                                    onClick={() => setTripSheetOpen(false)}
                                    type="button"
                                    aria-label="Close trip builder"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* ── Trip Settings Panel ── */}
                        <AnimatePresence>
                            {showSettings && (
                                <motion.div
                                    className="trip-settings"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="trip-settings__inner">
                                        {/* Days stepper */}
                                        <div className="trip-settings__row">
                                            <span className="trip-settings__label">Days</span>
                                            <div className="trip-settings__stepper">
                                                <button
                                                    type="button"
                                                    disabled={tripSettings.numDays <= 1}
                                                    onClick={() => setTripSettings({ numDays: Math.max(1, tripSettings.numDays - 1) })}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="trip-settings__stepper-value">{tripSettings.numDays}</span>
                                                <button
                                                    type="button"
                                                    disabled={tripSettings.numDays >= 14}
                                                    onClick={() => setTripSettings({ numDays: Math.min(14, tripSettings.numDays + 1) })}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Pace toggle */}
                                        <div className="trip-settings__row">
                                            <span className="trip-settings__label">Pace</span>
                                            <div className="trip-settings__toggle-group">
                                                {(['relaxed', 'moderate', 'packed'] as TripPace[]).map((p) => (
                                                    <button
                                                        key={p}
                                                        type="button"
                                                        className={`trip-settings__toggle${tripSettings.pace === p ? ' active' : ''}`}
                                                        onClick={() => setTripSettings({ pace: p })}
                                                    >
                                                        {p === 'relaxed' ? '🌿' : p === 'moderate' ? '⚡' : '🚀'}{' '}
                                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Travel type */}
                                        <div className="trip-settings__row">
                                            <span className="trip-settings__label">Travel</span>
                                            <div className="trip-settings__toggle-group">
                                                {([
                                                    { value: 'DRIVING' as TravelType, icon: '🚗', label: 'Drive' },
                                                    { value: 'WALKING' as TravelType, icon: '🚶', label: 'Walk' },
                                                    { value: 'PUBLIC_TRANSPORT' as TravelType, icon: '🚌', label: 'Transit' },
                                                    { value: 'CYCLING' as TravelType, icon: '🚲', label: 'Bike' },
                                                ]).map((t) => (
                                                    <button
                                                        key={t.value}
                                                        type="button"
                                                        className={`trip-settings__toggle${tripSettings.travelType === t.value ? ' active' : ''}`}
                                                        onClick={() => setTripSettings({ travelType: t.value })}
                                                    >
                                                        {t.icon} {t.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>


                        <div className="trip-builder__list">
                            {tripAttractions.length === 0 ? (
                                <div className="trip-builder__empty">
                                    <MapPin size={40} strokeWidth={1.2} />
                                    <p>No places added yet</p>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={tripAttractions.map((t) => t.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {tripAttractions.map((item) => (
                                            <SortableItem
                                                key={item.id}
                                                item={item}
                                                onRemove={removeAttraction}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </div>

                        {tripAttractions.length > 0 && (
                            <div className="trip-builder__footer">
                                <button
                                    className="trip-builder__clear"
                                    onClick={clearTrip}
                                    type="button"
                                    disabled={isBuilding}
                                >
                                    Clear All
                                </button>
                                {tripAttractions.length >= 2 ? (
                                    <button
                                        className="trip-builder__build"
                                        onClick={buildItinerary}
                                        type="button"
                                        disabled={isBuilding}
                                    >
                                        {isBuilding ? (
                                            <>
                                                <span className="trip-builder__spinner" />
                                                {buildProgress || 'Building...'}
                                            </>
                                        ) : (
                                            '🗺️ Build Itinerary'
                                        )}
                                    </button>
                                ) : (
                                    <span className="trip-builder__hint">
                                        Add {2 - tripAttractions.length} more to build
                                    </span>
                                )}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TripBuilderSheet;
