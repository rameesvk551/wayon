import React, { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, RefreshCw, WifiOff } from 'lucide-react';
import { useHotelStore } from '../../store/useHotelStore';
import { HotelListingCard } from '../blocks/HotelListingCard';
import { SkeletonCard } from '../atoms/SkeletonCard';

export const HotelListSection: React.FC = () => {
    const {
        getDisplayedHotels, getFilteredHotels,
        isLoading, hasMore, error,
        loadMore, refresh,
        wishlist, toggleWishlist,
    } = useHotelStore();

    const hotels = getDisplayedHotels();
    const totalFiltered = getFilteredHotels().length;
    const observerRef = useRef<HTMLDivElement>(null);
    const pullRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const [isPulling, setIsPulling] = React.useState(false);

    // Infinite scroll observer
    const lastElementRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (isLoading) return;
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasMore) {
                        loadMore();
                    }
                },
                { threshold: 0.1 }
            );
            if (node) observer.observe(node);
            return () => observer.disconnect();
        },
        [isLoading, hasMore, loadMore]
    );

    // Pull-to-refresh
    const handleTouchStart = (e: React.TouchEvent) => {
        if (pullRef.current && pullRef.current.scrollTop === 0) {
            touchStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const diff = e.changedTouches[0].clientY - touchStartY.current;
        if (diff > 100 && pullRef.current && pullRef.current.scrollTop === 0) {
            setIsPulling(true);
            refresh();
            setTimeout(() => setIsPulling(false), 800);
        }
    };

    // Error state
    if (error) {
        return (
            <div className="hotel-empty-state">
                <WifiOff size={48} className="text-gray-300" />
                <h3 className="text-base font-bold text-gray-700 mt-3">Something went wrong</h3>
                <p className="text-sm text-gray-400 mt-1">{error}</p>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={refresh}
                    className="hotel-retry-btn mt-4"
                >
                    <RefreshCw size={14} /> Try Again
                </motion.button>
            </div>
        );
    }

    // Empty state
    if (!isLoading && hotels.length === 0) {
        return (
            <div className="hotel-empty-state">
                <Building2 size={56} className="text-gray-200" />
                <h3 className="text-base font-bold text-gray-700 mt-3">No hotels found</h3>
                <p className="text-sm text-gray-400 mt-1 text-center px-8">
                    Try adjusting your filters or searching for a different destination.
                </p>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => useHotelStore.getState().resetFilters()}
                    className="hotel-retry-btn mt-4"
                >
                    <RefreshCw size={14} /> Reset Filters
                </motion.button>
            </div>
        );
    }

    return (
        <div
            ref={pullRef}
            className="hotel-list-section"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull-to-refresh indicator */}
            <AnimatePresence>
                {isPulling && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 48, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="flex items-center justify-center"
                    >
                        <RefreshCw size={20} className="text-[var(--color-primary)] animate-spin" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results count */}
            <div className="px-1 mb-3">
                <span className="text-xs font-semibold text-gray-400">
                    {totalFiltered} hotel{totalFiltered !== 1 ? 's' : ''} found
                </span>
            </div>

            {/* Hotel cards */}
            <div className="space-y-4">
                {hotels.map((hotel, index) => (
                    <HotelListingCard
                        key={hotel.id}
                        hotel={hotel}
                        index={index}
                        isWishlisted={wishlist.has(hotel.id)}
                        onToggleWishlist={toggleWishlist}
                    />
                ))}
            </div>

            {/* Infinite scroll sentinel + loading skeletons */}
            {hasMore && (
                <div ref={observerRef}>
                    <div ref={lastElementRef} className="space-y-4 mt-4">
                        {isLoading && (
                            <>
                                <SkeletonCard />
                                <SkeletonCard />
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* End of list */}
            {!hasMore && hotels.length > 0 && (
                <p className="text-center text-xs text-gray-400 py-6">
                    You've seen all {totalFiltered} hotels ✓
                </p>
            )}
        </div>
    );
};

export default HotelListSection;
