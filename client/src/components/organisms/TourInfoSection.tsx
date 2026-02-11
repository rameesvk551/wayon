import React from 'react';
import { MapPin, Star, Clock, Users, Shield } from 'lucide-react';
import type { TourListingItem } from '../../data/tourListingData';

interface TourInfoSectionProps {
    tour: TourListingItem;
}

export const TourInfoSection: React.FC<TourInfoSectionProps> = ({ tour }) => {
    const hasDiscount = tour.originalPrice && tour.originalPrice > tour.price;
    const discountPercent = hasDiscount
        ? Math.round(((tour.originalPrice! - tour.price) / tour.originalPrice!) * 100)
        : 0;

    return (
        <div className="tour-info-section">
            {/* Breadcrumb */}
            <nav className="tour-breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <a href="/">Tours</a>
                <span>/</span>
                <span className="current">{tour.name}</span>
            </nav>

            {/* Title & Location */}
            <h1 className="tour-detail-title">{tour.name}</h1>
            <div className="tour-detail-location">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                <span>{tour.location}, {tour.country}</span>
            </div>

            {/* Stats Row */}
            <div className="tour-detail-stats">
                <span className="tour-detail-stat">
                    <Star size={16} fill="#F59E0B" className="text-amber-400" />
                    <strong>{tour.rating}</strong>
                    <span className="text-gray-400">({tour.reviewCount} reviews)</span>
                </span>
                <span className="tour-detail-stat-divider" />
                <span className="tour-detail-stat">
                    <Clock size={16} className="text-[var(--color-primary)]" />
                    {tour.duration}
                </span>
                <span className="tour-detail-stat-divider" />
                <span className="tour-detail-stat">
                    <Users size={16} className="text-[var(--color-primary)]" />
                    Max {tour.maxGroupSize} people
                </span>
                <span className="tour-detail-stat-divider" />
                <span className="tour-detail-stat">
                    <Shield size={16} className="text-[var(--color-primary)]" />
                    {tour.difficultyLevel}
                </span>
            </div>

            {/* Price */}
            <div className="tour-detail-price-bar">
                <div className="tour-detail-price-info">
                    {hasDiscount && (
                        <div className="tour-detail-discount-row">
                            <span className="tour-detail-original-price">{tour.currency}{tour.originalPrice}</span>
                            <span className="tour-detail-discount-badge">{discountPercent}% OFF</span>
                        </div>
                    )}
                    <div className="tour-detail-current-price">
                        <span className="tour-detail-price-value">{tour.currency}{tour.price}</span>
                        <span className="tour-detail-price-label">/ person</span>
                    </div>
                </div>

                {/* Badges */}
                {tour.badges.length > 0 && (
                    <div className="tour-detail-badges">
                        {tour.badges.map((badge) => (
                            <span key={badge} className="tour-detail-badge">{badge}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Languages */}
            <div className="tour-detail-languages">
                <span className="tour-detail-lang-label">Available in:</span>
                {tour.language.map((lang) => (
                    <span key={lang} className="tour-detail-lang-tag">{lang}</span>
                ))}
            </div>
        </div>
    );
};

export default TourInfoSection;
