import { motion } from 'framer-motion';

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    size?: BadgeSize;
    icon?: React.ReactNode;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
    primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary-hover)]',
    accent: 'bg-[var(--color-accent-light)] text-[#0369A1]',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700'
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs'
};

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'default',
    size = 'md',
    icon,
    className = ''
}) => {
    return (
        <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={`
        inline-flex items-center gap-1
        font-medium
        rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.span>
    );
};
