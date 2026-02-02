import { motion } from 'framer-motion';
import { forwardRef } from 'react';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'default' | 'primary' | 'ghost';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ReactNode;
    size?: IconButtonSize;
    variant?: IconButtonVariant;
    tooltip?: string;
}

const sizeStyles: Record<IconButtonSize, string> = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
};

const variantStyles: Record<IconButtonVariant, string> = {
    default: `
    bg-[var(--color-bg-secondary)] 
    text-[var(--color-text-secondary)]
    border border-[var(--color-border)]
    hover:bg-[var(--color-bg-tertiary)] 
    hover:text-[var(--color-text-primary)]
    shadow-sm
  `,
    primary: `
    bg-[var(--color-primary)] 
    text-white
    hover:bg-[var(--color-primary-hover)]
    shadow-sm
  `,
    ghost: `
    bg-transparent 
    text-[var(--color-text-muted)]
    hover:bg-[var(--color-bg-tertiary)] 
    hover:text-[var(--color-text-primary)]
  `
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({
        icon,
        size = 'md',
        variant = 'default',
        tooltip,
        className = '',
        disabled,
        ...props
    }, ref) => {
        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: disabled ? 1 : 1.05 }}
                whileTap={{ scale: disabled ? 1 : 0.95 }}
                transition={{ duration: 0.15 }}
                disabled={disabled}
                title={tooltip}
                className={`
          inline-flex items-center justify-center
          rounded-xl
          transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
                {...props}
            >
                {icon}
            </motion.button>
        );
    }
);

IconButton.displayName = 'IconButton';
