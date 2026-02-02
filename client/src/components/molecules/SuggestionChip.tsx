import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SuggestionChipProps {
    children: React.ReactNode;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'highlight';
}

export const SuggestionChip: React.FC<SuggestionChipProps> = ({
    children,
    onClick,
    icon,
    variant = 'default'
}) => {
    const isHighlight = variant === 'highlight';

    return (
        <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onClick={onClick}
            className={`
        inline-flex items-center gap-2
        px-4 py-2.5
        text-sm font-medium
        rounded-xl
        transition-all duration-200
        ${isHighlight
                    ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white shadow-md hover:shadow-lg'
                    : 'bg-white text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] shadow-sm'
                }
      `}
        >
            {icon || (isHighlight && <Sparkles size={14} />)}
            {children}
        </motion.button>
    );
};
