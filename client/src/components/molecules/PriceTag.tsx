interface PriceTagProps {
    price: number;
    currency?: string;
    originalPrice?: number;
    suffix?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: { price: 'text-sm font-semibold', original: 'text-xs', suffix: 'text-xs' },
    md: { price: 'text-base font-bold', original: 'text-sm', suffix: 'text-sm' },
    lg: { price: 'text-xl font-bold', original: 'text-base', suffix: 'text-base' }
};

export const PriceTag: React.FC<PriceTagProps> = ({
    price,
    currency = '€',
    originalPrice,
    suffix = '',
    size = 'md'
}) => {
    const styles = sizeStyles[size];
    const hasDiscount = originalPrice && originalPrice > price;
    const discountPercent = hasDiscount
        ? Math.round((1 - price / originalPrice) * 100)
        : 0;

    return (
        <div className="flex items-baseline gap-2">
            {hasDiscount && (
                <span className={`${styles.original} text-[var(--color-text-muted)] line-through`}>
                    {currency}{originalPrice}
                </span>
            )}
            <span className={`${styles.price} text-[var(--color-text-primary)]`}>
                {currency}{price}
                {suffix && (
                    <span className={`${styles.suffix} text-[var(--color-text-muted)] font-normal ml-0.5`}>
                        {suffix}
                    </span>
                )}
            </span>
            {hasDiscount && (
                <span className="px-1.5 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded">
                    -{discountPercent}%
                </span>
            )}
        </div>
    );
};
