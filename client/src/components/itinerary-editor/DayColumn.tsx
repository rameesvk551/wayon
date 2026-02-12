import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { EditableDay } from '../../types/itinerary-editor';
import ItineraryCard from './ItineraryCard';
import { useItineraryEditorStore } from '../../store/useItineraryEditorStore';

interface DayColumnProps {
    day: EditableDay;
}

export default function DayColumn({ day }: DayColumnProps) {
    const { setAddPlaceModal } = useItineraryEditorStore();

    const { setNodeRef, isOver } = useDroppable({
        id: `day-${day.dayNumber}`,
        data: { dayNumber: day.dayNumber },
    });

    const formatDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr + 'T00:00:00');
            return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        } catch { return dateStr; }
    };

    const totalDuration = day.items.reduce((sum, item) => sum + item.duration, 0);
    const hours = Math.floor(totalDuration / 60);
    const mins = totalDuration % 60;

    return (
        <div className={`ie-day-col ${isOver ? 'ie-day-col--over' : ''}`}>
            {/* Day Header */}
            <div className="ie-day-col__header">
                <div className="ie-day-col__header-top">
                    <h3 className="ie-day-col__day-label">Day {day.dayNumber}</h3>
                    <span className="ie-day-col__item-count">{day.items.length} places</span>
                </div>
                <p className="ie-day-col__date">{formatDate(day.date)}</p>
                {day.title && <p className="ie-day-col__title">{day.title}</p>}
                <p className="ie-day-col__duration">
                    ⏱ {hours > 0 ? `${hours}h ` : ''}{mins > 0 ? `${mins}m` : ''}
                </p>
            </div>

            {/* Sortable Items */}
            <div ref={setNodeRef} className="ie-day-col__items">
                <SortableContext
                    items={day.items.map(i => i.itemId)}
                    strategy={verticalListSortingStrategy}
                >
                    {day.items.length > 0 ? (
                        day.items
                            .sort((a, b) => a.order - b.order)
                            .map(item => (
                                <ItineraryCard
                                    key={item.itemId}
                                    item={item}
                                    dayNumber={day.dayNumber}
                                />
                            ))
                    ) : (
                        <div className="ie-day-col__empty">
                            <span className="ie-day-col__empty-icon">📭</span>
                            <p>No items yet</p>
                            <p className="ie-day-col__empty-hint">Drag items here or add a place</p>
                        </div>
                    )}
                </SortableContext>
            </div>

            {/* Add Place Button */}
            <button
                className="ie-day-col__add-btn"
                onClick={() => setAddPlaceModal({ isOpen: true, dayNumber: day.dayNumber })}
                aria-label={`Add place to Day ${day.dayNumber}`}
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="1" x2="7" y2="13" />
                    <line x1="1" y1="7" x2="13" y2="7" />
                </svg>
                Add Place
            </button>
        </div>
    );
}
