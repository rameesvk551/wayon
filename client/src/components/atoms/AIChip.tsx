import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

interface AIChipProps {
    children: ReactNode;
    onClick?: () => void;
    icon?: ReactNode;
    variant?: 'default' | 'primary' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3.5 py-1.5 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2'
};

const variantStyles = {
    default: `
        bg-[var(--color-primary-subtle)]
        text-[var(--color-primary)]
        border border-transparent
        hover:bg-[var(--color-primary-light)]
        hover:border-[var(--color-primary)]
        hover:shadow-[var(--ai-glow)]
    `,
    primary: `
        bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
        text-white
        border border-transparent
        hover:shadow-[var(--ai-glow)]
    `,
    subtle: `
        bg-transparent
        text-[var(--color-primary)]
        border border-[var(--color-border)]
        hover:bg-[var(--color-primary-subtle)]
        hover:border-[var(--color-primary)]
    `
};

export const AIChip: React.FC<AIChipProps> = ({
    children,
    onClick,
    icon,
    variant = 'default',
    size = 'md',
    disabled = false
}) => {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            onClick={onClick}
            disabled={disabled}
            className={`
                inline-flex items-center
                font-medium
                rounded-full
                transition-all duration-200
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizeStyles[size]}
                ${variantStyles[variant]}
            `}
        >
            {icon || <Sparkles size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />}
            {children}
        </motion.button>
    );
};
