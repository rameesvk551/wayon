import { motion } from 'framer-motion';
import { Check, X, Sparkles } from 'lucide-react';

interface AISuggestionCardProps {
    title: string;
    description: string;
    type?: 'attraction' | 'restaurant' | 'hotel' | 'activity' | 'optimization';
    image?: string;
    onAccept?: () => void;
    onDismiss?: () => void;
}

const typeColors = {
    attraction: 'from-amber-500 to-orange-500',
    restaurant: 'from-rose-500 to-pink-500',
    hotel: 'from-blue-500 to-indigo-500',
    activity: 'from-green-500 to-emerald-500',
    optimization: 'from-purple-500 to-violet-500'
};

export const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
    title,
    description,
    type = 'attraction',
    image,
    onAccept,
    onDismiss
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="
                relative
                bg-white
                border border-[var(--color-primary)]
                rounded-xl
                overflow-hidden
                shadow-md
                ai-glow
            "
        >
            {/* AI Badge */}
            <div className="absolute top-3 left-3 z-10">
                <div className={`
                    inline-flex items-center gap-1.5
                    px-2.5 py-1
                    bg-gradient-to-r ${typeColors[type]}
                    text-white text-xs font-medium
                    rounded-full
                `}>
                    <Sparkles size={12} />
                    AI Suggestion
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-4 p-4">
                {/* Image */}
                {image && (
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Text */}
                <div className="flex-1 pt-6">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                        {title}
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] line-clamp-2">
                        {description}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 px-4 pb-4">
                <button
                    onClick={onAccept}
                    className="
                        flex-1 flex items-center justify-center gap-1.5
                        py-2 px-3
                        bg-[var(--color-primary)]
                        text-white text-sm font-medium
                        rounded-lg
                        hover:bg-[var(--color-primary-hover)]
                        transition-colors
                    "
                >
                    <Check size={14} />
                    Add to Trip
                </button>
                <button
                    onClick={onDismiss}
                    className="
                        flex items-center justify-center
                        w-10 h-10
                        bg-[var(--color-bg-tertiary)]
                        text-[var(--color-text-muted)]
                        rounded-lg
                        hover:bg-[var(--color-border)]
                        transition-colors
                    "
                >
                    <X size={16} />
                </button>
            </div>
        </motion.div>
    );
};
