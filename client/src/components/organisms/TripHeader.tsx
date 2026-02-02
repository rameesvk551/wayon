import { motion } from 'framer-motion';
import { Calendar, Users, Share2, Edit3, MoreHorizontal, ArrowLeft, Download } from 'lucide-react';
import type { Trip } from '../../types';
import { Button, IconButton, Badge } from '../atoms';
import { useNavigate } from 'react-router-dom';

interface TripHeaderProps {
    trip: Trip;
    onEdit?: () => void;
    onShare?: () => void;
}

export const TripHeader: React.FC<TripHeaderProps> = ({
    trip,
    onEdit,
    onShare
}) => {
    const navigate = useNavigate();

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
        flex items-center justify-between
        px-6 py-4
        bg-white
        border-b border-[var(--color-border)]
      "
        >
            {/* Left: Back & Title */}
            <div className="flex items-center gap-4">
                <IconButton
                    icon={<ArrowLeft size={18} />}
                    onClick={() => navigate('/')}
                    variant="ghost"
                    tooltip="Back to home"
                />

                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                            {trip.name}
                        </h1>
                        <Badge
                            variant={trip.status === 'planned' ? 'primary' : 'default'}
                            size="sm"
                        >
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-text-muted)]">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            <span>
                                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Users size={14} />
                            <span>{trip.travelers} travelers</span>
                        </div>
                        <div className="text-[var(--color-text-muted)]">
                            {trip.totalDays} days
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 size={14} />}
                    onClick={onEdit}
                >
                    Edit
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Share2 size={14} />}
                    onClick={onShare}
                >
                    Share
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download size={14} />}
                >
                    Export PDF
                </Button>
                <IconButton
                    icon={<MoreHorizontal size={18} />}
                    variant="ghost"
                    tooltip="More options"
                />
            </div>
        </motion.div>
    );
};
