import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Minus, Plus, Zap } from 'lucide-react';
import type { TourListingItem } from '../../data/tourListingData';

interface TourBookingCardProps {
    tour: TourListingItem;
}

export const TourBookingCard: React.FC<TourBookingCardProps> = ({ tour }) => {
    const [selectedDate, setSelectedDate] = useState(tour.availableDates[0] || '');
    const [travelers, setTravelers] = useState(2);
    const [isExpanded, setIsExpanded] = useState(false);

    const totalPrice = tour.price * travelers;
    const hasDiscount = tour.originalPrice && tour.originalPrice > tour.price;
    const totalSaving = hasDiscount ? (tour.originalPrice! - tour.price) * travelers : 0;

    return (
        <>
            {/* Mobile Sticky Bottom Bar */}
            <div className="tour-booking-mobile">
                <div className="tour-booking-mobile-price">
                    <span className="tour-booking-mobile-amount">{tour.currency}{tour.price}</span>
                    <span className="tour-booking-mobile-label">/ person</span>
                </div>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="tour-booking-mobile-btn"
                    onClick={() => setIsExpanded(true)}
                >
                    <Zap size={16} />
                    Book Now
                </motion.button>
            </div>

            {/* Expanded Booking Modal (mobile) */}
            {isExpanded && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="tour-booking-backdrop"
                        onClick={() => setIsExpanded(false)}
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                        className="tour-booking-sheet"
                    >
                        <div className="fbs-handle-row">
                            <div className="fbs-handle" />
                        </div>

                        <h3 className="tour-booking-sheet-title">Book This Tour</h3>

                        {/* Date Selection */}
                        <div className="tour-booking-field">
                            <label className="tour-booking-label">
                                <Calendar size={16} />
                                Select Date
                            </label>
                            <select
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="tour-booking-select"
                            >
                                {tour.availableDates.map((date) => (
                                    <option key={date} value={date}>
                                        {new Date(date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Travelers */}
                        <div className="tour-booking-field">
                            <label className="tour-booking-label">
                                <Users size={16} />
                                Travelers
                            </label>
                            <div className="tour-booking-travelers">
                                <button
                                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                    className="tour-booking-stepper-btn"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="tour-booking-traveler-count">{travelers}</span>
                                <button
                                    onClick={() => setTravelers(Math.min(tour.maxGroupSize, travelers + 1))}
                                    className="tour-booking-stepper-btn"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="tour-booking-breakdown">
                            <div className="tour-booking-row">
                                <span>{tour.currency}{tour.price} × {travelers} travelers</span>
                                <span>{tour.currency}{totalPrice}</span>
                            </div>
                            {totalSaving > 0 && (
                                <div className="tour-booking-row saving">
                                    <span>You save</span>
                                    <span>-{tour.currency}{totalSaving}</span>
                                </div>
                            )}
                            <div className="tour-booking-row total">
                                <span>Total</span>
                                <span>{tour.currency}{totalPrice}</span>
                            </div>
                        </div>

                        {/* Book Button */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            className="tour-booking-confirm-btn"
                        >
                            <Zap size={18} />
                            Instant Book · {tour.currency}{totalPrice}
                        </motion.button>

                        <p className="tour-booking-notice">
                            Free cancellation up to 48 hours before the tour
                        </p>
                    </motion.div>
                </>
            )}
        </>
    );
};

export default TourBookingCard;
