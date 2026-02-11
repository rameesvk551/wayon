import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X as XIcon, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import type { TourListingItem } from '../../data/tourListingData';

interface TourTabsSectionProps {
    tour: TourListingItem;
}

const tabs = ['Overview', 'Itinerary', 'Included', 'Reviews', 'FAQ'] as const;
type TabKey = typeof tabs[number];

export const TourTabsSection: React.FC<TourTabsSectionProps> = ({ tour }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('Overview');
    const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setExpandedFAQ(expandedFAQ === index ? null : index);
    };

    const renderOverview = () => (
        <div className="tour-tab-overview">
            <p className="tour-tab-description">{tour.description}</p>

            <h4 className="tour-tab-subtitle">Highlights</h4>
            <ul className="tour-tab-highlights">
                {tour.highlights.map((h, i) => (
                    <li key={i}>
                        <Check size={16} className="text-[var(--color-success)]" />
                        <span>{h}</span>
                    </li>
                ))}
            </ul>

            <h4 className="tour-tab-subtitle">Meeting Point</h4>
            <div className="tour-tab-meeting-point">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                <span>{tour.meetingPoint}</span>
            </div>
        </div>
    );

    const renderItinerary = () => (
        <div className="tour-tab-itinerary">
            {tour.itinerary.map((day, i) => (
                <div key={i} className="tour-itinerary-day">
                    <div className="tour-itinerary-marker">
                        <div className="tour-itinerary-dot" />
                        {i < tour.itinerary.length - 1 && <div className="tour-itinerary-line" />}
                    </div>
                    <div className="tour-itinerary-content">
                        <div className="tour-itinerary-day-badge">Day {day.day}</div>
                        <h4 className="tour-itinerary-title">{day.title}</h4>
                        <p className="tour-itinerary-desc">{day.description}</p>
                        <div className="tour-itinerary-activities">
                            {day.activities.map((activity, j) => (
                                <span key={j} className="tour-itinerary-activity">{activity}</span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderIncluded = () => (
        <div className="tour-tab-included">
            <div className="tour-included-section">
                <h4 className="tour-tab-subtitle included">
                    <Check size={18} /> What's Included
                </h4>
                <ul className="tour-included-list">
                    {tour.included.map((item, i) => (
                        <li key={i}>
                            <Check size={14} className="text-[var(--color-success)]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="tour-included-section">
                <h4 className="tour-tab-subtitle excluded">
                    <XIcon size={18} /> What's Excluded
                </h4>
                <ul className="tour-excluded-list">
                    {tour.excluded.map((item, i) => (
                        <li key={i}>
                            <XIcon size={14} className="text-[var(--color-error)]" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const renderReviews = () => (
        <div className="tour-tab-reviews">
            <div className="tour-reviews-summary">
                <div className="tour-reviews-score">
                    <span className="tour-reviews-score-value">{tour.rating}</span>
                    <div className="tour-reviews-score-stars">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                                key={s}
                                size={16}
                                fill={s <= Math.round(tour.rating) ? '#F59E0B' : '#E5E7EB'}
                                className={s <= Math.round(tour.rating) ? 'text-amber-400' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="tour-reviews-score-count">{tour.reviewCount} reviews</span>
                </div>
            </div>

            <div className="tour-reviews-list">
                {tour.reviews.map((review) => (
                    <div key={review.id} className="tour-review-card">
                        <div className="tour-review-header">
                            <span className="tour-review-avatar">{review.avatar}</span>
                            <div className="tour-review-user">
                                <span className="tour-review-name">{review.userName}</span>
                                <span className="tour-review-date">{review.date}</span>
                            </div>
                            <div className="tour-review-rating">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star
                                        key={s}
                                        size={12}
                                        fill={s <= review.rating ? '#F59E0B' : '#E5E7EB'}
                                        className={s <= review.rating ? 'text-amber-400' : 'text-gray-300'}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="tour-review-comment">{review.comment}</p>
                        <button className="tour-review-helpful">
                            <ThumbsUp size={12} />
                            Helpful ({review.helpful})
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderFAQ = () => (
        <div className="tour-tab-faq">
            {tour.faq.map((item, i) => (
                <div key={i} className={`tour-faq-item ${expandedFAQ === i ? 'expanded' : ''}`}>
                    <button className="tour-faq-question" onClick={() => toggleFAQ(i)}>
                        <span>{item.question}</span>
                        {expandedFAQ === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <AnimatePresence>
                        {expandedFAQ === i && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="tour-faq-answer"
                            >
                                <p>{item.answer}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'Overview': return renderOverview();
            case 'Itinerary': return renderItinerary();
            case 'Included': return renderIncluded();
            case 'Reviews': return renderReviews();
            case 'FAQ': return renderFAQ();
            default: return null;
        }
    };

    return (
        <div className="tour-tabs-section">
            {/* Tab Bar */}
            <div className="tour-tabs-bar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`tour-tab-btn ${activeTab === tab ? 'active' : ''}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="tour-tab-indicator"
                                className="tour-tab-indicator"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="tour-tab-content"
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TourTabsSection;
