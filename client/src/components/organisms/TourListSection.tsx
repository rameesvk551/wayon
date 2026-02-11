import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Loader2 } from 'lucide-react';
import { useTourStore } from '../../store/useTourStore';
import { TourCard } from '../molecules/TourCard';

interface TourListSectionProps {
    onViewDetails: (id: string) => void;
}

const TourSkeleton: React.FC = () => (
    <div className="tour-skeleton-card">
        <div className="tour-skeleton-image shimmer" />
        <div className="tour-skeleton-content">
            <div className="tour-skeleton-line w-[75%] h-5 shimmer" />
            <div className="tour-skeleton-line w-[50%] h-3.5 shimmer mt-2" />
            <div className="flex gap-2 mt-3">
                <div className="tour-skeleton-line w-[80px] h-6 shimmer rounded-lg" />
                <div className="tour-skeleton-line w-[80px] h-6 shimmer rounded-lg" />
            </div>
            <div className="flex justify-between mt-3">
                <div className="tour-skeleton-line w-[70px] h-6 shimmer" />
                <div className="tour-skeleton-line w-[100px] h-9 shimmer rounded-xl" />
            </div>
        </div>
    </div>
);

export const TourListSection: React.FC<TourListSectionProps> = ({ onViewDetails }) => {
    const { viewMode, isLoading, hasMore, loadMore, getDisplayedTours, getFilteredTours } = useTourStore();
    const displayedTours = getDisplayedTours();
    const totalFiltered = getFilteredTours().length;

    // Initial loading state
    if (isLoading && displayedTours.length === 0) {
        return (
            <div className="tour-list-section">
                <div className="tour-list-header">
                    <span className="tour-list-count shimmer" style={{ width: 120, height: 20 }} />
                </div>
                <div className={`tour-list-grid ${viewMode}`}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <TourSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // Empty state
    if (displayedTours.length === 0) {
        return (
            <div className="tour-list-empty">
                <div className="tour-list-empty-icon">
                    <Compass size={48} strokeWidth={1} />
                </div>
                <h3>No tours found</h3>
                <p>Try adjusting your filters or search criteria</p>
            </div>
        );
    }

    return (
        <div className="tour-list-section">
            {/* Results count */}
            <div className="tour-list-header">
                <span className="tour-list-count">
                    Showing {displayedTours.length} of {totalFiltered} tours
                </span>
            </div>

            {/* Tour Cards */}
            <div className={`tour-list-grid ${viewMode}`}>
                {displayedTours.map((tour, index) => (
                    <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                    >
                        <TourCard
                            tour={tour}
                            variant={viewMode}
                            onViewDetails={onViewDetails}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="tour-list-load-more">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={loadMore}
                        disabled={isLoading}
                        className="tour-load-more-btn"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            `Load More (${totalFiltered - displayedTours.length} remaining)`
                        )}
                    </motion.button>
                </div>
            )}
        </div>
    );
};

export default TourListSection;
