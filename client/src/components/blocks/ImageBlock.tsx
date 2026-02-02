import { motion } from 'framer-motion';
import type { ImageBlock as ImageBlockType } from '../../types/ui-schema';

type ImageBlockProps = Omit<ImageBlockType, 'type'>;

const layoutStyles = {
    full: 'w-full h-64 md:h-80',
    inline: 'w-full h-48',
    thumbnail: 'w-32 h-32'
};

export const ImageBlock: React.FC<ImageBlockProps> = ({
    src,
    alt = '',
    caption,
    layout = 'inline'
}) => {
    return (
        <motion.figure
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`
        ${layout === 'thumbnail' ? 'inline-block' : 'w-full'}
      `}
        >
            <div className={`
        relative overflow-hidden rounded-2xl
        ${layoutStyles[layout]}
        bg-[var(--color-bg-tertiary)]
      `}>
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>

            {caption && (
                <figcaption className="mt-2 text-xs text-center text-[var(--color-text-muted)] italic">
                    {caption}
                </figcaption>
            )}
        </motion.figure>
    );
};
