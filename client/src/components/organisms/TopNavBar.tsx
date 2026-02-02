import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, User, Settings, ChevronDown } from 'lucide-react';

interface TopNavBarProps {
    tripInfo?: {
        destination: string;
        duration: string;
        guests: string;
    };
    onSavedTripsClick?: () => void;
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
    tripInfo,
    onSavedTripsClick,
    onProfileClick,
    onSettingsClick
}) => {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
                sticky top-0 z-50
                flex items-center justify-between
                px-6 py-3
                bg-white/90 backdrop-blur-xl
                border-b border-[var(--color-border-light)]
                shadow-sm
            "
        >
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
                <div className="
                    w-10 h-10 
                    rounded-xl
                    bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]
                    flex items-center justify-center
                    shadow-md
                ">
                    <Globe size={22} className="text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-[var(--color-text-primary)]">
                        NomadicNook
                    </h1>
                    <span className="text-xs text-[var(--color-text-muted)]">AI Travel Assistant</span>
                </div>
            </div>

            {/* Center: Trip Info Chip */}
            {tripInfo && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="
                        flex items-center gap-2
                        px-4 py-2
                        bg-[var(--color-bg-tertiary)]
                        border border-[var(--color-border)]
                        rounded-full
                        text-sm font-medium text-[var(--color-text-secondary)]
                        hover:bg-[var(--color-primary-subtle)]
                        hover:border-[var(--color-primary)]
                        hover:text-[var(--color-primary)]
                        transition-all duration-200
                    "
                >
                    <span>{tripInfo.destination}</span>
                    <span className="text-[var(--color-text-muted)]">·</span>
                    <span>{tripInfo.duration}</span>
                    <span className="text-[var(--color-text-muted)]">·</span>
                    <span>{tripInfo.guests}</span>
                    <ChevronDown size={16} className="text-[var(--color-text-muted)]" />
                </motion.button>
            )}

            {/* Right: Action Icons */}
            <div className="flex items-center gap-1">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSavedTripsClick}
                    className="
                        p-2.5 rounded-xl
                        text-[var(--color-text-muted)]
                        hover:text-[var(--color-primary)]
                        hover:bg-[var(--color-primary-subtle)]
                        transition-all duration-200
                    "
                    title="Saved Trips"
                >
                    <Heart size={20} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onProfileClick}
                    className="
                        p-2.5 rounded-xl
                        text-[var(--color-text-muted)]
                        hover:text-[var(--color-primary)]
                        hover:bg-[var(--color-primary-subtle)]
                        transition-all duration-200
                    "
                    title="Profile"
                >
                    <User size={20} />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSettingsClick}
                    className="
                        p-2.5 rounded-xl
                        text-[var(--color-text-muted)]
                        hover:text-[var(--color-text-secondary)]
                        hover:bg-[var(--color-bg-tertiary)]
                        transition-all duration-200
                    "
                    title="Settings"
                >
                    <Settings size={20} />
                </motion.button>
            </div>
        </motion.nav>
    );
};
