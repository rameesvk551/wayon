import { AnimatePresence, motion } from 'framer-motion';
import { X, Star, Clock, Ticket, MapPin, Info, Check, CheckCircle2 } from 'lucide-react';
import type { Attraction } from '../types';

interface AttractionModalProps {
    attraction: Attraction | null;
    isOpen: boolean;
    onClose: () => void;
    isSelected: boolean;
    onToggleSelect: () => void;
}

export const AttractionModal = ({ attraction, isOpen, onClose, isSelected, onToggleSelect }: AttractionModalProps) => {
    if (!isOpen || !attraction) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="attraction-modal-overlay"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="attraction-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="attraction-modal-image">
                        <img src={attraction.image} alt={attraction.name} />
                        <div className="attraction-modal-image-overlay" />
                        <button className="attraction-modal-close" onClick={onClose}>
                            <X size={20} />
                        </button>
                        <span className="attraction-modal-category">{attraction.category}</span>
                    </div>

                    <div className="attraction-modal-content">
                        <div className="attraction-modal-header">
                            <h2>{attraction.name}</h2>
                            <div className="attraction-modal-rating">
                                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                                <span>{attraction.rating}</span>
                            </div>
                        </div>

                        <p className="attraction-modal-desc">{attraction.description}</p>

                        <div className="attraction-modal-info-grid">
                            <div className="attraction-modal-info-item">
                                <Clock size={18} />
                                <div>
                                    <span className="label">Duration</span>
                                    <span className="value">{attraction.duration}</span>
                                </div>
                            </div>
                            <div className="attraction-modal-info-item">
                                <Ticket size={18} />
                                <div>
                                    <span className="label">Entry Fee</span>
                                    <span className="value">{attraction.price}</span>
                                </div>
                            </div>
                            <div className="attraction-modal-info-item">
                                <MapPin size={18} />
                                <div>
                                    <span className="label">Location</span>
                                    <span className="value">{attraction.address || 'City Center'}</span>
                                </div>
                            </div>
                            <div className="attraction-modal-info-item">
                                <Info size={18} />
                                <div>
                                    <span className="label">Hours</span>
                                    <span className="value">{attraction.openingHours || '9AM - 6PM'}</span>
                                </div>
                            </div>
                        </div>

                        {attraction.highlights && attraction.highlights.length > 0 && (
                            <div className="attraction-modal-highlights">
                                <h4>Highlights</h4>
                                <ul>
                                    {attraction.highlights.map((highlight, index) => (
                                        <li key={index}>
                                            <Check size={14} />
                                            {highlight}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="attraction-modal-actions">
                            <button
                                className={`attraction-modal-select-btn ${isSelected ? 'selected' : ''}`}
                                onClick={onToggleSelect}
                            >
                                {isSelected ? (
                                    <>
                                        <CheckCircle2 size={20} />
                                        Added to Trip
                                    </>
                                ) : (
                                    <>
                                        <Check size={20} />
                                        Add to Trip
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
