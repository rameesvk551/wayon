import { motion } from 'framer-motion';
import type { ActionsBlock as ActionsBlockType } from '../../types/ui-schema';

type ActionsBlockProps = Omit<ActionsBlockType, 'type'> & {
    onAction?: (actionId: string) => void;
};

const layoutStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
    wrap: 'flex-row flex-wrap'
};

const variantStyles = {
    primary: `
    bg-[var(--color-primary)]
    text-white
    hover:bg-[var(--color-primary-dark)]
    shadow-sm
  `,
    secondary: `
    bg-[var(--color-bg-secondary)]
    text-[var(--color-text-primary)]
    border border-[var(--color-border)]
    hover:bg-[var(--color-bg-tertiary)]
  `,
    ghost: `
    bg-transparent
    text-[var(--color-text-secondary)]
    hover:bg-[var(--color-bg-tertiary)]
  `,
    highlight: `
    bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]
    text-white
    shadow-md
    hover:shadow-lg
  `
};

export const ActionsBlock: React.FC<ActionsBlockProps> = ({
    items,
    layout = 'horizontal',
    onAction
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-2 ${layoutStyles[layout]}`}
        >
            {items.map((action, index) => (
                <motion.button
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAction?.(action.id)}
                    className={`
            px-4 py-2
            text-sm font-medium
            rounded-xl
            transition-all duration-200
            ${variantStyles[action.variant || 'secondary']}
          `}
                >
                    {action.label}
                </motion.button>
            ))}
        </motion.div>
    );
};
