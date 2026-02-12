import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';
import type { EditableItem } from '../../types/itinerary-editor';
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../types/itinerary-editor';
import { useItineraryEditorStore } from '../../store/useItineraryEditorStore';

interface ItineraryCardProps {
    item: EditableItem;
    dayNumber: number;
}

export default function ItineraryCard({ item, dayNumber }: ItineraryCardProps) {
    const { updateItem, toggleLock, removeItem } = useItineraryEditorStore();
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);
    const [editTime, setEditTime] = useState(item.startTime);
    const [editDuration, setEditDuration] = useState(item.duration);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: item.itemId,
        data: { dayNumber, item },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleSaveEdit = () => {
        updateItem(dayNumber, item.itemId, {
            name: editName,
            startTime: editTime,
            duration: editDuration,
        });
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSaveEdit();
        if (e.key === 'Escape') {
            setEditName(item.name);
            setEditTime(item.startTime);
            setEditDuration(item.duration);
            setIsEditing(false);
        }
    };

    const categoryColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.general;
    const categoryIcon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.general;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`ie-card ${isDragging ? 'ie-card--dragging' : ''} ${item.isLocked ? 'ie-card--locked' : ''}`}
        >
            {/* Left accent bar */}
            <div className="ie-card__accent" style={{ backgroundColor: categoryColor }} />

            <div className="ie-card__body">
                {/* Drag handle */}
                <button
                    className="ie-card__drag-handle"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to reorder"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <circle cx="3" cy="2" r="1.2" /><circle cx="9" cy="2" r="1.2" />
                        <circle cx="3" cy="6" r="1.2" /><circle cx="9" cy="6" r="1.2" />
                        <circle cx="3" cy="10" r="1.2" /><circle cx="9" cy="10" r="1.2" />
                    </svg>
                </button>

                {/* Content */}
                <div className="ie-card__content">
                    {isEditing ? (
                        <div className="ie-card__edit-form">
                            <input
                                className="ie-card__edit-input"
                                value={editName}
                                onChange={e => setEditName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                placeholder="Place name"
                            />
                            <div className="ie-card__edit-row">
                                <input
                                    type="time"
                                    className="ie-card__time-input"
                                    value={editTime}
                                    onChange={e => setEditTime(e.target.value)}
                                />
                                <select
                                    className="ie-card__duration-select"
                                    value={editDuration}
                                    onChange={e => setEditDuration(Number(e.target.value))}
                                >
                                    <option value={30}>30 min</option>
                                    <option value={45}>45 min</option>
                                    <option value={60}>1 hr</option>
                                    <option value={90}>1.5 hr</option>
                                    <option value={120}>2 hr</option>
                                    <option value={180}>3 hr</option>
                                    <option value={240}>4 hr</option>
                                </select>
                                <button className="ie-card__save-btn" onClick={handleSaveEdit}>✓</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="ie-card__header">
                                <span className="ie-card__icon">{categoryIcon}</span>
                                <span
                                    className="ie-card__name"
                                    onClick={() => setIsEditing(true)}
                                    title="Click to edit"
                                >
                                    {item.name}
                                </span>
                                {item.aiSuggested && <span className="ie-card__ai-badge">AI</span>}
                            </div>
                            <div className="ie-card__meta">
                                <span className="ie-card__time">🕐 {item.startTime}</span>
                                <span className="ie-card__duration">{item.duration} min</span>
                                <span className="ie-card__category">{item.category}</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Actions */}
                <div className="ie-card__actions">
                    <button
                        className={`ie-card__lock-btn ${item.isLocked ? 'ie-card__lock-btn--active' : ''}`}
                        onClick={() => toggleLock(dayNumber, item.itemId)}
                        title={item.isLocked ? 'Unlock (AI can move)' : 'Lock (AI won\'t move)'}
                        aria-label={item.isLocked ? 'Unlock item' : 'Lock item'}
                    >
                        {item.isLocked ? '🔒' : '🔓'}
                    </button>
                    {!isEditing && (
                        <button
                            className="ie-card__edit-btn"
                            onClick={() => setIsEditing(true)}
                            title="Edit"
                            aria-label="Edit item"
                        >
                            ✏️
                        </button>
                    )}
                    <button
                        className="ie-card__delete-btn"
                        onClick={() => removeItem(dayNumber, item.itemId)}
                        title="Remove"
                        aria-label="Remove item"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}
