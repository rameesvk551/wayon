import React from 'react';

interface SkeletonCardProps {
    variant?: 'full' | 'compact';
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = 'full' }) => {
    if (variant === 'compact') {
        return (
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="h-32 bg-gray-200" />
                <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                    <div className="h-5 bg-gray-200 rounded-full w-1/3" />
                </div>
            </div>
        );
    }

    return (
        <div className="hotel-skeleton-card">
            {/* Image skeleton */}
            <div className="hotel-skeleton-image shimmer" />
            {/* Content skeleton */}
            <div className="hotel-skeleton-content">
                <div className="hotel-skeleton-row">
                    <div className="hotel-skeleton-line w-[70%] h-5 shimmer" />
                    <div className="hotel-skeleton-line w-[50px] h-5 shimmer rounded-full" />
                </div>
                <div className="hotel-skeleton-line w-[55%] h-3.5 shimmer mt-2" />
                <div className="hotel-skeleton-row mt-3">
                    <div className="flex gap-1.5">
                        <div className="hotel-skeleton-line w-[60px] h-6 shimmer rounded-lg" />
                        <div className="hotel-skeleton-line w-[60px] h-6 shimmer rounded-lg" />
                        <div className="hotel-skeleton-line w-[60px] h-6 shimmer rounded-lg" />
                    </div>
                </div>
                <div className="hotel-skeleton-row mt-3">
                    <div className="hotel-skeleton-line w-[90px] h-6 shimmer" />
                    <div className="hotel-skeleton-line w-[100px] h-9 shimmer rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
