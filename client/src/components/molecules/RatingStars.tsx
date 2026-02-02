import { Star, StarHalf } from 'lucide-react';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    showValue?: boolean;
    showCount?: boolean;
    count?: number;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: { icon: 12, text: 'text-xs', gap: 'gap-0.5' },
    md: { icon: 16, text: 'text-sm', gap: 'gap-1' },
    lg: { icon: 20, text: 'text-base', gap: 'gap-1' }
};

export const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    maxRating = 5,
    showValue = true,
    showCount = false,
    count,
    size = 'md'
}) => {
    const styles = sizeStyles[size];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className={`flex items-center ${styles.gap}`}>
            {/* Full Stars */}
            {Array.from({ length: fullStars }).map((_, i) => (
                <Star
                    key={`full-${i}`}
                    size={styles.icon}
                    className="text-amber-400"
                    fill="currentColor"
                />
            ))}

            {/* Half Star */}
            {hasHalfStar && (
                <div className="relative">
                    <Star size={styles.icon} className="text-[var(--color-border)]" fill="currentColor" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star size={styles.icon} className="text-amber-400" fill="currentColor" />
                    </div>
                </div>
            )}

            {/* Empty Stars */}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <Star
                    key={`empty-${i}`}
                    size={styles.icon}
                    className="text-[var(--color-border)]"
                    fill="currentColor"
                />
            ))}

            {/* Rating Value */}
            {showValue && (
                <span className={`${styles.text} font-semibold text-[var(--color-text-primary)] ml-1`}>
                    {rating.toFixed(1)}
                </span>
            )}

            {/* Review Count */}
            {showCount && count !== undefined && (
                <span className={`${styles.text} text-[var(--color-text-muted)]`}>
                    ({count.toLocaleString()})
                </span>
            )}
        </div>
    );
};
