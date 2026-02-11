import { motion } from 'framer-motion';
import type { VisaStatus } from '../../data/visaData';
import { visaStatusConfig } from '../../data/visaData';

interface VisaStatusBadgeProps {
    status: VisaStatus;
    size?: 'sm' | 'md' | 'lg';
    showEmoji?: boolean;
}

const VisaStatusBadge: React.FC<VisaStatusBadgeProps> = ({
    status,
    size = 'md',
    showEmoji = true,
}) => {
    const config = visaStatusConfig[status];

    return (
        <motion.span
            className={`visa-status-badge visa-status-badge--${size}`}
            style={{
                color: config.color,
                background: config.bg,
                borderColor: config.border,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
            {showEmoji && <span className="visa-status-emoji">{config.emoji}</span>}
            <span>{config.label}</span>
        </motion.span>
    );
};

export default VisaStatusBadge;
