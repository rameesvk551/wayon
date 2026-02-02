import { motion } from 'framer-motion';
import type { TextBlock as TextBlockType } from '../../types/ui-schema';

type TextBlockProps = Omit<TextBlockType, 'type'>;

export const TextBlock: React.FC<TextBlockProps> = ({ content, format = 'plain' }) => {
    // Simple markdown-like parsing for basic formatting
    const renderContent = () => {
        if (format === 'markdown') {
            // Parse basic markdown: **bold**, *italic*, `code`
            const parsed = content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 bg-[var(--color-bg-tertiary)] rounded text-sm font-mono">$1</code>')
                .replace(/\n/g, '<br />');

            return (
                <span
                    dangerouslySetInnerHTML={{ __html: parsed }}
                    className="text-[var(--color-text-secondary)] leading-relaxed"
                />
            );
        }

        return (
            <span className="text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                {content}
            </span>
        );
    };

    return (
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-sm"
        >
            {renderContent()}
        </motion.p>
    );
};
