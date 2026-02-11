import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';
import { useTourStore } from '../../store/useTourStore';

interface RelatedToursProps {
    tourId: string;
}

export const RelatedTours: React.FC<RelatedToursProps> = ({ tourId }) => {
    const { getRelatedTours } = useTourStore();
    const navigate = useNavigate();
    const relatedTours = getRelatedTours(tourId);

    if (relatedTours.length === 0) return null;

    return (
        <div className="tour-related-section">
            <h3 className="tour-related-title">You Might Also Like</h3>
            <div className="tour-related-scroll">
                {relatedTours.map((tour) => (
                    <div
                        key={tour.id}
                        className="tour-related-card"
                        onClick={() => {
                            navigate(`/tours/${tour.id}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <div className="tour-related-image">
                            <img src={tour.images[0]} alt={tour.name} />
                            {tour.badges.length > 0 && (
                                <span className="tour-related-badge">{tour.badges[0]}</span>
                            )}
                        </div>
                        <div className="tour-related-info">
                            <h4 className="line-clamp-1">{tour.name}</h4>
                            <div className="tour-related-meta">
                                <MapPin size={11} />
                                <span>{tour.location}</span>
                            </div>
                            <div className="tour-related-bottom">
                                <span className="tour-related-rating">
                                    <Star size={12} fill="#F59E0B" className="text-amber-400" />
                                    {tour.rating}
                                </span>
                                <span className="tour-related-duration">
                                    <Clock size={12} />
                                    {tour.duration}
                                </span>
                                <span className="tour-related-price">{tour.currency}{tour.price}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedTours;
