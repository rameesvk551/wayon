import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import type { CardBlock as CardBlockType } from '../../types/ui-schema';
import { Badge } from '../atoms';

type CardBlockProps = Omit<CardBlockType, 'type'> & {
    onClick?: () => void;
};

const badgeVariants = {
    default: 'default' as const,
    primary: 'primary' as const,
    success: 'success' as const,
    warning: 'warning' as const,
    error: 'error' as const
};

export const CardBlock: React.FC<CardBlockProps> = ({
    title,
    subtitle,
    image,
    meta,
    actions,
    badge,
    badgeVariant = 'default',
    onClick
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.01, y: -2 }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={`
                flex items-start gap-4
                p-4
                bg-white
                border border-[var(--color-border-light)]
                rounded-2xl
                ${onClick ? 'cursor-pointer' : ''}
                hover:border-[var(--color-primary)]/30
                hover:shadow-[var(--shadow-card-hover)]
                transition-all duration-300
                group
            `}
        >
            {/* Image */}
            {image && (
                <div className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden shadow-sm">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {/* Badge on image */}
                    {badge && (
                        <div className="absolute top-2 left-2">
                            <Badge variant={badgeVariants[badgeVariant]} size="sm">
                                {badge}
                            </Badge>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Title Row */}
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                        {title}
                    </h4>
                    {badge && (
                        <Badge variant={badgeVariants[badgeVariant]} size="sm">
                            {badge}
                        </Badge>
                    )}
                </div>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-xs text-[var(--color-text-muted)] mb-2 line-clamp-2">
                        {subtitle}
                    </p>
                )}

                {/* Meta Info */}
                {meta && meta.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-muted)]">
                        {meta.map((item, index) => (
                            <div key={index} className="flex items-center gap-1">
                                <span className="font-medium text-[var(--color-text-secondary)]">{item.label}:</span>
                                <span>{item.value}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions */}
                {actions && actions.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                        {actions.map((action) => (
                            <button
                                key={action.id}
                                className={`
                  px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                  ${action.variant === 'primary'
                                        ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]'
                                        : action.variant === 'highlight'
                                            ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white'
                                            : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]'
                                    }
                `}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Arrow Indicator */}
            {onClick && (
                <ChevronRight
                    size={18}
                    className="
            flex-shrink-0 
            text-[var(--color-text-muted)]
            group-hover:text-[var(--color-primary)]
            transition-colors
          "
                />
            )}
        </motion.div>
    );
};
