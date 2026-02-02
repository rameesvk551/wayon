import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface WizardStepCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    icon?: ReactNode;
}

export const WizardStepCard: React.FC<WizardStepCardProps> = ({
    title,
    subtitle,
    children,
    icon
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Header */}
            <div className="text-center mb-10">
                {icon && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className="
                            w-20 h-20 mx-auto mb-6
                            rounded-2xl
                            bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]
                            flex items-center justify-center
                            shadow-lg
                        "
                    >
                        <div className="text-white">{icon}</div>
                    </motion.div>
                )}
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                    className="text-3xl font-bold text-[var(--color-text-primary)] mb-3"
                >
                    {title}
                </motion.h2>
                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        className="text-lg text-[var(--color-text-muted)]"
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

// Selection Option Card Component
interface SelectionOptionProps {
    icon: ReactNode;
    label: string;
    description?: string;
    selected: boolean;
    onClick: () => void;
    delay?: number;
}

export const SelectionOption: React.FC<SelectionOptionProps> = ({
    icon,
    label,
    description,
    selected,
    onClick,
    delay = 0
}) => {
    return (
        <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + delay * 0.08, duration: 0.3 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative p-6 rounded-2xl
                border-2 transition-all duration-200
                text-left w-full
                ${selected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary-subtle)] shadow-lg'
                    : 'border-[var(--color-border)] bg-white hover:border-[var(--color-primary-light)] hover:shadow-md'
                }
            `}
        >
            {/* Selected indicator */}
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="
                        absolute top-3 right-3
                        w-6 h-6 rounded-full
                        bg-[var(--color-primary)]
                        flex items-center justify-center
                    "
                >
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>
            )}

            <div className="flex items-center gap-4">
                <div className={`
                    w-14 h-14 rounded-xl flex items-center justify-center
                    ${selected
                        ? 'bg-[var(--color-primary)] text-white'
                        : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]'
                    }
                    transition-colors duration-200
                `}>
                    {icon}
                </div>
                <div>
                    <h4 className={`
                        text-lg font-semibold
                        ${selected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'}
                    `}>
                        {label}
                    </h4>
                    {description && (
                        <p className="text-sm text-[var(--color-text-muted)] mt-0.5">
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </motion.button>
    );
};

// Multi-select chip for interests
interface InterestChipProps {
    icon: ReactNode;
    label: string;
    selected: boolean;
    onClick: () => void;
    delay?: number;
}

export const InterestChip: React.FC<InterestChipProps> = ({
    icon,
    label,
    selected,
    onClick,
    delay = 0
}) => {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + delay * 0.05, duration: 0.25 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
                inline-flex items-center gap-2.5
                px-5 py-3 rounded-full
                border-2 transition-all duration-200
                font-medium text-sm
                ${selected
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white shadow-md'
                    : 'border-[var(--color-border)] bg-white text-[var(--color-text-secondary)] hover:border-[var(--color-primary-light)]'
                }
            `}
        >
            <span className={selected ? 'text-white' : 'text-[var(--color-primary)]'}>
                {icon}
            </span>
            {label}
        </motion.button>
    );
};
