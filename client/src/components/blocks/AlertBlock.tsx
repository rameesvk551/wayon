import { motion } from 'framer-motion';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { AlertBlock as AlertBlockType } from '../../types/ui-schema';

type AlertBlockProps = Omit<AlertBlockType, 'type'>;

const levelStyles = {
    info: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: Info,
        iconColor: 'text-blue-500',
        titleColor: 'text-blue-800',
        textColor: 'text-blue-700'
    },
    success: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: CheckCircle,
        iconColor: 'text-emerald-500',
        titleColor: 'text-emerald-800',
        textColor: 'text-emerald-700'
    },
    warning: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        titleColor: 'text-amber-800',
        textColor: 'text-amber-700'
    },
    error: {
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        icon: XCircle,
        iconColor: 'text-rose-500',
        titleColor: 'text-rose-800',
        textColor: 'text-rose-700'
    }
};

export const AlertBlock: React.FC<AlertBlockProps> = ({
    level,
    text,
    title,
    dismissible = false
}) => {
    const [isDismissed, setIsDismissed] = useState(false);
    const styles = levelStyles[level];
    const Icon = styles.icon;

    if (isDismissed) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`
        flex items-start gap-3
        p-4
        ${styles.bg}
        ${styles.border}
        border
        rounded-xl
      `}
            role="alert"
        >
            <Icon size={20} className={`flex-shrink-0 ${styles.iconColor}`} />

            <div className="flex-1 min-w-0">
                {title && (
                    <h4 className={`text-sm font-semibold ${styles.titleColor} mb-0.5`}>
                        {title}
                    </h4>
                )}
                <p className={`text-sm ${styles.textColor}`}>
                    {text}
                </p>
            </div>

            {dismissible && (
                <button
                    onClick={() => setIsDismissed(true)}
                    className={`
            flex-shrink-0 p-1 rounded-lg
            hover:bg-black/5
            transition-colors
            ${styles.iconColor}
          `}
                    aria-label="Dismiss"
                >
                    <X size={16} />
                </button>
            )}
        </motion.div>
    );
};
