import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, Circle, CheckCircle2, Clock } from 'lucide-react';
import type { TimelineBlock as TimelineBlockType, TimelineItem } from '../../types/ui-schema';

type TimelineBlockProps = Omit<TimelineBlockType, 'type'>;

const statusStyles = {
    completed: {
        icon: CheckCircle2,
        line: 'bg-[var(--color-success)]',
        dot: 'bg-[var(--color-success)] text-white',
        bg: 'bg-emerald-50'
    },
    current: {
        icon: Clock,
        line: 'bg-[var(--color-primary)]',
        dot: 'bg-[var(--color-primary)] text-white',
        bg: 'bg-[var(--color-primary-light)]'
    },
    upcoming: {
        icon: Circle,
        line: 'bg-[var(--color-border)]',
        dot: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)]',
        bg: 'bg-white'
    }
};

const TimelineItemCard: React.FC<{ item: TimelineItem; index: number; isLast: boolean }> = ({
    item,
    index,
    isLast
}) => {
    const [isExpanded, setIsExpanded] = useState(item.status === 'current');
    const status = item.status || 'upcoming';
    const styles = statusStyles[status];
    const StatusIcon = styles.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative flex gap-4"
        >
            {/* Timeline Line & Dot */}
            <div className="flex flex-col items-center">
                <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${styles.dot}
          shadow-sm
        `}>
                    <StatusIcon size={16} />
                </div>
                {!isLast && (
                    <div className={`w-0.5 flex-1 min-h-[20px] ${styles.line}`} />
                )}
            </div>

            {/* Content Card */}
            <div className={`
        flex-1 mb-4 rounded-xl border border-[var(--color-border)]
        ${styles.bg}
        overflow-hidden
      `}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 text-left"
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                                {item.title}
                            </h4>
                            {item.time && (
                                <span className="text-xs text-[var(--color-text-muted)]">
                                    {item.time}
                                </span>
                            )}
                        </div>
                        {item.subtitle && (
                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                                {item.subtitle}
                            </p>
                        )}
                    </div>
                    {item.description && (
                        <ChevronDown
                            size={16}
                            className={`
                text-[var(--color-text-muted)] transition-transform
                ${isExpanded ? 'rotate-180' : ''}
              `}
                        />
                    )}
                </button>

                <AnimatePresence>
                    {isExpanded && item.description && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 pb-4 pt-0">
                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Meta Items */}
                                {item.meta && item.meta.length > 0 && (
                                    <div className="flex flex-wrap gap-3 mt-3">
                                        {item.meta.map((meta, idx) => (
                                            <div key={idx} className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                                                <span className="font-medium">{meta.label}:</span>
                                                <span>{meta.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export const TimelineBlock: React.FC<TimelineBlockProps> = ({ title, items }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
        >
            {title && (
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                    {title}
                </h3>
            )}
            <div>
                {items.map((item, index) => (
                    <TimelineItemCard
                        key={item.id}
                        item={item}
                        index={index}
                        isLast={index === items.length - 1}
                    />
                ))}
            </div>
        </motion.div>
    );
};
