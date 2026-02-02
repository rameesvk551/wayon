import { motion } from 'framer-motion';
import type { TitleBlock as TitleBlockType } from '../../types/ui-schema';

type TitleBlockProps = Omit<TitleBlockType, 'type'>;

const levelStyles = {
    1: 'text-2xl font-bold',
    2: 'text-xl font-semibold',
    3: 'text-lg font-medium'
};

export const TitleBlock: React.FC<TitleBlockProps> = ({ text, level = 1 }) => {
    const Tag = `h${level}` as keyof JSX.IntrinsicElements;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Tag className={`${levelStyles[level]} text-[var(--color-text-primary)]`}>
                {text}
            </Tag>
        </motion.div>
    );
};
