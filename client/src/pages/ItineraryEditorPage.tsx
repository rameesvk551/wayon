import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    DragOverlay,
    type DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useState } from 'react';

import { useItineraryEditorStore } from '../store/useItineraryEditorStore';
import DayColumn from '../components/itinerary-editor/DayColumn';
import AddPlaceModal from '../components/itinerary-editor/AddPlaceModal';
import VersionHistoryDrawer from '../components/itinerary-editor/VersionHistoryDrawer';
import AutosaveIndicator from '../components/itinerary-editor/AutosaveIndicator';
import ReOptimizeButton from '../components/itinerary-editor/ReOptimizeButton';
import ItineraryEditorSkeleton from '../components/itinerary-editor/ItineraryEditorSkeleton';
import type { EditableItem } from '../types/itinerary-editor';
import '../styles/itinerary-editor.css';

export default function ItineraryEditorPage() {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();
    const {
        trip,
        isLoading,
        error,
        loadTrip,
        reorderItem,
        setVersionDrawerOpen,
        setStatus,
    } = useItineraryEditorStore();

    const [activeItem, setActiveItem] = useState<EditableItem | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (tripId) loadTrip(tripId);
    }, [tripId]);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const item = active.data.current?.item as EditableItem | undefined;
        setActiveItem(item || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveItem(null);

        if (!over || !active.data.current) return;

        const sourceData = active.data.current;
        const sourceDayNumber = sourceData.dayNumber as number;
        const itemId = active.id as string;

        // Determine target day
        let targetDayNumber: number;
        let newOrder: number;

        if (over.data.current?.dayNumber !== undefined) {
            // Dropped on day column
            targetDayNumber = over.data.current.dayNumber as number;
            const targetDay = trip?.days.find(d => d.dayNumber === targetDayNumber);
            newOrder = targetDay ? targetDay.items.length : 0;
        } else if (over.data.current?.sortable) {
            // Dropped on another card
            const overItemId = over.id as string;
            const overDay = trip?.days.find(d => d.items.some(i => i.itemId === overItemId));
            if (!overDay) return;
            targetDayNumber = overDay.dayNumber;
            newOrder = overDay.items.findIndex(i => i.itemId === overItemId);
            if (newOrder === -1) newOrder = overDay.items.length;
        } else {
            return;
        }

        // Skip if no change
        if (sourceDayNumber === targetDayNumber) {
            const day = trip?.days.find(d => d.dayNumber === sourceDayNumber);
            const currentIdx = day?.items.findIndex(i => i.itemId === itemId);
            if (currentIdx === newOrder) return;
        }

        reorderItem({
            itemId,
            sourceDayNumber,
            targetDayNumber,
            newOrder,
        });
    };

    // ── Loading state ──────────────────────────────────────────────────
    if (isLoading && !trip) return <ItineraryEditorSkeleton />;

    // ── Error state ────────────────────────────────────────────────────
    if (error && !trip) {
        return (
            <div className="ie-error">
                <span className="ie-error__icon">⚠️</span>
                <h2>Something went wrong</h2>
                <p>{error}</p>
                <button className="ie-error__btn" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    // ── Empty state ────────────────────────────────────────────────────
    if (!trip) {
        return (
            <div className="ie-empty">
                <span className="ie-empty__icon">🗺️</span>
                <h2>No itinerary found</h2>
                <p>Generate an itinerary from the chat to start editing.</p>
                <button className="ie-empty__btn" onClick={() => navigate('/chat')}>Go to Chat</button>
            </div>
        );
    }

    return (
        <div className="ie-page">
            {/* Header */}
            <header className="ie-header">
                <div className="ie-header__left">
                    <button className="ie-header__back" onClick={() => navigate(-1)} aria-label="Go back">
                        ←
                    </button>
                    <div>
                        <h1 className="ie-header__title">{trip.tripName}</h1>
                        <p className="ie-header__subtitle">
                            📍 {trip.destination} · {trip.totalDays} days · {trip.startDate}
                        </p>
                    </div>
                </div>
                <div className="ie-header__right">
                    <AutosaveIndicator />
                    <select
                        className="ie-header__status-select"
                        value={trip.status}
                        onChange={e => setStatus(e.target.value as 'draft' | 'final')}
                    >
                        <option value="draft">📝 Draft</option>
                        <option value="final">✅ Final</option>
                    </select>
                </div>
            </header>

            {/* Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="ie-board">
                    {trip.days
                        .sort((a, b) => a.dayNumber - b.dayNumber)
                        .map(day => (
                            <DayColumn key={day.dayNumber} day={day} />
                        ))}

                    {/* Unassigned column */}
                    {trip.unassigned.length > 0 && (
                        <div className="ie-day-col ie-day-col--unassigned">
                            <div className="ie-day-col__header">
                                <h3 className="ie-day-col__day-label">📦 Unassigned</h3>
                                <span className="ie-day-col__item-count">{trip.unassigned.length} places</span>
                            </div>
                            <div className="ie-day-col__items">
                                {trip.unassigned.map(item => (
                                    <div key={item.itemId} className="ie-card ie-card--unassigned">
                                        <div className="ie-card__body">
                                            <span className="ie-card__name">{item.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Drag overlay */}
                <DragOverlay>
                    {activeItem ? (
                        <div className="ie-card ie-card--overlay">
                            <div className="ie-card__body">
                                <span className="ie-card__name">{activeItem.name}</span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Footer toolbar */}
            <footer className="ie-footer">
                <ReOptimizeButton />
                <button
                    className="ie-footer__versions-btn"
                    onClick={() => setVersionDrawerOpen(true)}
                >
                    🕐 Version History
                </button>
            </footer>

            {/* Modals / Drawers */}
            <AddPlaceModal />
            <VersionHistoryDrawer />
        </div>
    );
}
