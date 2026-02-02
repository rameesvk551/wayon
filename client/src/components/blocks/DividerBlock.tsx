import { motion } from 'framer-motion';
import type { DividerBlock as DividerBlockType } from '../../types/ui-schema';

type DividerBlockProps = Omit<DividerBlockType, 'type'>;

const spacingStyles = {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6'
};

export const DividerBlock: React.FC<DividerBlockProps> = ({ spacing = 'md' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.3 }}
            className={spacingStyles[spacing]}
        >
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
        </motion.div>
    );
};
