import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface CityMarkerProps {
    name: string;
    isActive?: boolean;
    dayNumber?: number;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: {
        pin: 'w-6 h-6',
        icon: 12,
        label: 'text-xs px-1.5 py-0.5'
    },
    md: {
        pin: 'w-8 h-8',
        icon: 16,
        label: 'text-sm px-2 py-1'
    },
    lg: {
        pin: 'w-10 h-10',
        icon: 20,
        label: 'text-sm px-2.5 py-1'
    }
};

export const CityMarker: React.FC<CityMarkerProps> = ({
    name,
    isActive = false,
    dayNumber,
    onClick,
    size = 'md'
}) => {
    const styles = sizeStyles[size];

    return (
        <motion.div
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col items-center cursor-pointer group"
        >
            {/* Pin */}
            <motion.div
                animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                    y: isActive ? [0, -4, 0] : 0
                }}
                transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                    repeatDelay: 1.5
                }}
                className={`
          ${styles.pin}
          flex items-center justify-center
          rounded-full
          shadow-lg
          ${isActive
                        ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary-light)]'
                        : 'bg-white text-[var(--color-text-primary)] group-hover:bg-[var(--color-primary)] group-hover:text-white'
                    }
          transition-colors duration-200
        `}
            >
                {dayNumber !== undefined ? (
                    <span className="text-xs font-bold">{dayNumber}</span>
                ) : (
                    <MapPin size={styles.icon} />
                )}
            </motion.div>

            {/* Pin Stem */}
            <div
                className={`
          w-0.5 h-2
          ${isActive ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-text-muted)]'}
        `}
            />

            {/* Label */}
            <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
          ${styles.label}
          bg-white
          rounded-lg
          shadow-md
          font-medium
          text-[var(--color-text-primary)]
          whitespace-nowrap
          mt-1
        `}
            >
                {name}
            </motion.div>
        </motion.div>
    );
};
