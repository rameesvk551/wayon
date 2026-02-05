import { motion } from 'framer-motion';
import { Calendar, Users, ChevronDown, Edit3, Share2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';

interface TripTopBarProps {
    tripName?: string;
    startDate?: string;
    endDate?: string;
    travelers?: number;
    onEditName?: (name: string) => void;
    onEditDates?: () => void;
    onEditTravelers?: () => void;
    onShare?: () => void;
    onModeSwitch?: (mode: 'plan' | 'review') => void;
    currentMode?: 'plan' | 'review';
}

export const TripTopBar: React.FC<TripTopBarProps> = ({
    tripName = 'Your Trip',
    startDate = '--',
    endDate = '--',
    travelers = 0,
    onEditName,
    onEditDates,
    onEditTravelers,
    onShare,
    onModeSwitch,
    currentMode = 'plan'
}) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [editedName, setEditedName] = useState(tripName);

    const handleNameSubmit = () => {
        setIsEditingName(false);
        onEditName?.(editedName);
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
                flex items-center justify-between
                px-6 py-3
                bg-white
                border-b border-[var(--color-border)]
            "
        >
            {/* Left: Trip Info */}
            <div className="flex items-center gap-6">
                {/* Trip Name */}
                <div className="flex items-center gap-2">
                    {isEditingName ? (
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            onBlur={handleNameSubmit}
                            onKeyDown={(e) => e.key === 'Enter' && handleNameSubmit()}
                            autoFocus
                            className="
                                text-lg font-semibold
                                text-[var(--color-text-primary)]
                                bg-transparent
                                border-b-2 border-[var(--color-primary)]
                                outline-none
                                px-1
                            "
                        />
                    ) : (
                        <button
                            onClick={() => setIsEditingName(true)}
                            className="
                                flex items-center gap-2
                                group
                            "
                        >
                            <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                {tripName}
                            </h1>
                            <Edit3
                                size={14}
                                className="text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
                            />
                        </button>
                    )}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-[var(--color-border)]" />

                {/* Dates */}
                <button
                    onClick={onEditDates}
                    className="
                        flex items-center gap-2
                        px-3 py-1.5
                        rounded-lg
                        hover:bg-[var(--color-bg-tertiary)]
                        transition-colors
                        group
                    "
                >
                    <Calendar size={16} className="text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                        {startDate} – {endDate}
                    </span>
                    <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
                </button>

                {/* Travelers */}
                <button
                    onClick={onEditTravelers}
                    className="
                        flex items-center gap-2
                        px-3 py-1.5
                        rounded-lg
                        hover:bg-[var(--color-bg-tertiary)]
                        transition-colors
                    "
                >
                    <Users size={16} className="text-[var(--color-text-muted)]" />
                    <span className="text-sm text-[var(--color-text-secondary)]">
                        {travelers} {travelers === 1 ? 'traveler' : 'travelers'}
                    </span>
                    <ChevronDown size={14} className="text-[var(--color-text-muted)]" />
                </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Mode Toggle */}
                <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-lg p-1">
                    <button
                        onClick={() => onModeSwitch?.('plan')}
                        className={`
                            px-4 py-1.5
                            text-sm font-medium
                            rounded-md
                            transition-all duration-200
                            ${currentMode === 'plan'
                                ? 'bg-white text-[var(--color-primary)] shadow-sm'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                            }
                        `}
                    >
                        Plan
                    </button>
                    <button
                        onClick={() => onModeSwitch?.('review')}
                        className={`
                            px-4 py-1.5
                            text-sm font-medium
                            rounded-md
                            transition-all duration-200
                            ${currentMode === 'review'
                                ? 'bg-white text-[var(--color-primary)] shadow-sm'
                                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                            }
                        `}
                    >
                        Review
                    </button>
                </div>

                {/* Share */}
                <button
                    onClick={onShare}
                    className="
                        flex items-center gap-2
                        px-4 py-2
                        text-sm font-medium
                        text-[var(--color-text-secondary)]
                        border border-[var(--color-border)]
                        rounded-lg
                        hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
                        transition-colors
                    "
                >
                    <Share2 size={16} />
                    Share
                </button>

                {/* More */}
                <button
                    className="
                        w-9 h-9
                        flex items-center justify-center
                        text-[var(--color-text-muted)]
                        rounded-lg
                        hover:bg-[var(--color-bg-tertiary)]
                        transition-colors
                    "
                >
                    <MoreHorizontal size={18} />
                </button>
            </div>
        </motion.div>
    );
};
