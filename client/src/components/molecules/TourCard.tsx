import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Heart, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTourStore } from '../../store/useTourStore';
import type { TourListingItem } from '../../data/tourListingData';

interface TourCardProps {
    tour: TourListingItem;
    variant?: 'grid' | 'list';
    onViewDetails: (id: string) => void;
}

export const TourCard: React.FC<TourCardProps> = ({ tour, variant = 'grid', onViewDetails }) => {
    const { wishlist, toggleWishlist } = useTourStore();
    const isWishlisted = wishlist.has(tour.id);
    const [currentImage, setCurrentImage] = useState(0);
    const hasDiscount = tour.originalPrice && tour.originalPrice > tour.price;
    const discountPercent = hasDiscount
        ? Math.round(((tour.originalPrice! - tour.price) / tour.originalPrice!) * 100)
        : 0;

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev + 1) % tour.images.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImage((prev) => (prev - 1 + tour.images.length) % tour.images.length);
    };

    if (variant === 'list') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="tour-card-list"
                onClick={() => onViewDetails(tour.id)}
            >
                {/* Image */}
                <div className="tour-card-list-image">
                    <img src={tour.images[0]} alt={tour.name} />
                    {hasDiscount && (
                        <span className="tour-card-discount-badge">-{discountPercent}%</span>
                    )}
                    <button
                        className={`tour-card-wishlist ${isWishlisted ? 'active' : ''}`}
                        onClick={(e) => { e.stopPropagation(); toggleWishlist(tour.id); }}
                    >
                        <Heart size={14} fill={isWishlisted ? '#EF4444' : 'none'} />
                    </button>
                </div>

                {/* Content */}
                <div className="tour-card-list-content">
                    <h3 className="tour-card-title line-clamp-1">{tour.name}</h3>
                    <div className="tour-card-meta">
                        <MapPin size={12} />
                        <span>{tour.location}</span>
                    </div>
                    <div className="tour-card-stats">
                        <span className="tour-card-rating">
                            <Star size={12} fill="#F59E0B" className="text-amber-400" />
                            {tour.rating}
                        </span>
                        <span className="tour-card-duration">
                            <Clock size={12} />
                            {tour.duration}
                        </span>
                    </div>
                    <div className="tour-card-price-row">
                        {hasDiscount && (
                            <span className="tour-card-original-price">{tour.currency}{tour.originalPrice}</span>
                        )}
                        <span className="tour-card-price">{tour.currency}{tour.price}</span>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid variant
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="tour-card-grid"
        >
            {/* Image Carousel */}
            <div className="tour-card-image-container">
                <img
                    src={tour.images[currentImage]}
                    alt={tour.name}
                    className="tour-card-image"
                />

                {/* Navigation arrows */}
                {tour.images.length > 1 && (
                    <>
                        <button className="tour-card-img-nav tour-card-img-prev" onClick={prevImage}>
                            <ChevronLeft size={16} />
                        </button>
                        <button className="tour-card-img-nav tour-card-img-next" onClick={nextImage}>
                            <ChevronRight size={16} />
                        </button>
                    </>
                )}

                {/* Dots */}
                {tour.images.length > 1 && (
                    <div className="tour-card-dots">
                        {tour.images.map((_, i) => (
                            <span key={i} className={`tour-card-dot ${i === currentImage ? 'active' : ''}`} />
                        ))}
                    </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                    <span className="tour-card-discount-badge">-{discountPercent}%</span>
                )}

                {/* Badges */}
                {tour.badges.length > 0 && (
                    <div className="tour-card-badges">
                        {tour.badges.map((badge) => (
                            <span key={badge} className="tour-card-badge">{badge}</span>
                        ))}
                    </div>
                )}

                {/* Wishlist */}
                <button
                    className={`tour-card-wishlist ${isWishlisted ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(tour.id); }}
                >
                    <Heart size={16} fill={isWishlisted ? '#EF4444' : 'none'} />
                </button>
            </div>

            {/* Content */}
            <div className="tour-card-content">
                <div className="tour-card-header">
                    <h3 className="tour-card-title">{tour.name}</h3>
                    <span className="tour-card-category">{tour.category}</span>
                </div>

                <p className="tour-card-description line-clamp-2">{tour.shortDescription}</p>

                <div className="tour-card-info-row">
                    <span className="tour-card-meta">
                        <MapPin size={13} />
                        {tour.location}
                    </span>
                    <span className="tour-card-duration">
                        <Clock size={13} />
                        {tour.duration}
                    </span>
                </div>

                <div className="tour-card-info-row">
                    <span className="tour-card-rating">
                        <Star size={13} fill="#F59E0B" className="text-amber-400" />
                        {tour.rating}
                        <span className="tour-card-review-count">({tour.reviewCount})</span>
                    </span>
                    <span className="tour-card-group">
                        <Users size={13} />
                        {tour.groupSize} people
                    </span>
                </div>

                <div className="tour-card-footer">
                    <div className="tour-card-price-section">
                        {hasDiscount && (
                            <span className="tour-card-original-price">{tour.currency}{tour.originalPrice}</span>
                        )}
                        <span className="tour-card-price">{tour.currency}{tour.price}</span>
                        <span className="tour-card-price-label">/ person</span>
                    </div>
                    <div className="tour-card-actions">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="tour-card-details-btn"
                            onClick={() => onViewDetails(tour.id)}
                        >
                            View Details
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="tour-card-book-btn"
                            onClick={() => onViewDetails(tour.id)}
                        >
                            Book Now
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TourCard;
