import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Building2, Cloud, FileCheck, Map, Sparkles } from 'lucide-react';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface QuickActionsChipsProps {
    onActionClick?: (actionId: string) => void;
}

const defaultActions: QuickAction[] = [
    { id: 'plan', label: 'Plan my trip', icon: <Plane size={16} /> },
    { id: 'hotels', label: 'Find hotels', icon: <Building2 size={16} /> },
    { id: 'weather', label: 'Weather', icon: <Cloud size={16} /> },
    { id: 'visa', label: 'Visa info', icon: <FileCheck size={16} /> },
    { id: 'itinerary', label: 'Build itinerary', icon: <Map size={16} /> },
];

export const QuickActionsChips: React.FC<QuickActionsChipsProps> = ({ onActionClick }) => {
    return (
        <div className="flex flex-wrap items-center gap-3 py-1">
            {/* AI Sparkle Chip */}
            <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onActionClick?.('ai-suggest')}
                className="
                    flex items-center gap-2
                    px-5 py-2.5
                    bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
                    text-white
                    text-sm font-semibold
                    rounded-xl
                    shadow-md
                    whitespace-nowrap
                    hover:shadow-lg
                    transition-all duration-200
                "
            >
                <Sparkles size={16} />
                <span>AI Suggest</span>
            </motion.button>

            {/* Quick Action Chips */}
            {defaultActions.map((action, index) => (
                <motion.button
                    key={action.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onActionClick?.(action.id)}
                    className="
                        flex items-center gap-2
                        px-4 py-2.5
                        bg-[var(--color-bg-tertiary)]
                        border border-[var(--color-border)]
                        text-[var(--color-text-secondary)]
                        text-sm font-medium
                        rounded-xl
                        whitespace-nowrap
                        hover:border-[var(--color-primary)]
                        hover:text-[var(--color-primary)]
                        hover:bg-[var(--color-primary-subtle)]
                        hover:shadow-md
                        transition-all duration-200
                    "
                >
                    <span className="text-[var(--color-primary)]">{action.icon}</span>
                    <span>{action.label}</span>
                </motion.button>
            ))}
        </div>
    );
};
