import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ChipProps {
    children: React.ReactNode;
    selected?: boolean;
    onSelect?: () => void;
    onRemove?: () => void;
    icon?: React.ReactNode;
    className?: string;
}

export const Chip: React.FC<ChipProps> = ({
    children,
    selected = false,
    onSelect,
    onRemove,
    icon,
    className = ''
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onClick={onSelect}
            className={`
        inline-flex items-center gap-1.5
        px-3 py-1.5
        text-sm font-medium
        rounded-full
        transition-all duration-200 ease-out
        ${selected
                    ? 'bg-[var(--color-primary)] text-white shadow-sm'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-bg-tertiary)]'
                }
        ${className}
      `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
            {onRemove && (
                <motion.span
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="flex-shrink-0 ml-0.5 cursor-pointer opacity-60 hover:opacity-100"
                >
                    <X size={14} />
                </motion.span>
            )}
        </motion.button>
    );
};
