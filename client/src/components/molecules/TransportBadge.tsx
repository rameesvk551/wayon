import { Plane, Train, Ship, Car, Bus, Footprints } from 'lucide-react';
import type { TransportType } from '../../types';

interface TransportBadgeProps {
    type: TransportType;
    duration?: string;
    showLabel?: boolean;
    size?: 'sm' | 'md';
}

const transportConfig: Record<TransportType, { icon: React.ElementType; label: string; color: string }> = {
    flight: { icon: Plane, label: 'Flight', color: 'text-sky-500 bg-sky-50' },
    train: { icon: Train, label: 'Train', color: 'text-emerald-500 bg-emerald-50' },
    ferry: { icon: Ship, label: 'Ferry', color: 'text-blue-500 bg-blue-50' },
    car: { icon: Car, label: 'Car', color: 'text-violet-500 bg-violet-50' },
    bus: { icon: Bus, label: 'Bus', color: 'text-orange-500 bg-orange-50' },
    walk: { icon: Footprints, label: 'Walk', color: 'text-green-500 bg-green-50' }
};

const sizeStyles = {
    sm: { container: 'px-2 py-1 gap-1', icon: 12, text: 'text-xs' },
    md: { container: 'px-2.5 py-1.5 gap-1.5', icon: 14, text: 'text-sm' }
};

export const TransportBadge: React.FC<TransportBadgeProps> = ({
    type,
    duration,
    showLabel = true,
    size = 'md'
}) => {
    const config = transportConfig[type];
    const styles = sizeStyles[size];
    const Icon = config.icon;

    return (
        <div
            className={`
        inline-flex items-center
        ${styles.container}
        ${config.color}
        rounded-full
        font-medium
      `}
        >
            <Icon size={styles.icon} />
            {showLabel && (
                <span className={styles.text}>{config.label}</span>
            )}
            {duration && (
                <span className={`${styles.text} opacity-70`}>• {duration}</span>
            )}
        </div>
    );
};
