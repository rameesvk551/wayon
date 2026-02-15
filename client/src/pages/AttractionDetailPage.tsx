import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Star,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Plus,
    Check,
} from 'lucide-react';
import { getAttractionById, mapPlaceToAttraction } from '../api/attractionApi';
import { useAttractionStore } from '../store/useAttractionStore';
import type { Attraction } from '../types/attraction';
import '../styles/attraction-detail.css';

const AttractionDetailPage: React.FC = () => {
    const { city, id } = useParams<{ city: string; id: string }>();
    const navigate = useNavigate();
    const { tripAttractions, addAttraction, removeAttraction } = useAttractionStore();
    const [attraction, setAttraction] = useState<Attraction | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    const isInTrip = tripAttractions.some((a) => a.id === id);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        setError(null);

        const fetchDetail = async () => {
            try {
                const place = await getAttractionById(id!);
                if (cancelled) return;
                if (!place) {
                    setError('Attraction not found');
                    return;
                }
                setAttraction(mapPlaceToAttraction(place, city || ''));
            } catch (err: any) {
                if (!cancelled) setError(err.message || 'Failed to load attraction');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchDetail();
        return () => { cancelled = true; };
    }, [id, city]);

    if (isLoading) {
        return (
            <div className="detail-page">
                <div className="detail-loading">
                    <div className="detail-loading__spinner" />
                    <p>Loading attraction...</p>
                </div>
            </div>
        );
    }

    if (error || !attraction) {
        return (
            <div className="detail-page">
                <div className="detail-error">
                    <span className="detail-error__icon">😕</span>
                    <p>{error || 'Attraction not found'}</p>
                    <button
                        className="detail-error__back"
                        onClick={() => navigate(-1)}
                        type="button"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const photos = attraction.photos && attraction.photos.length > 0
        ? attraction.photos
        : [attraction.image];

    const handlePrev = () => setActivePhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
    const handleNext = () => setActivePhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

    const handleToggleTrip = () => {
        if (isInTrip) {
            removeAttraction(attraction.id);
        } else {
            addAttraction(attraction);
        }
    };

    const priceLevelLabels = ['Free', 'Budget', 'Moderate', 'Expensive', 'Very Expensive'];

    return (
        <div className="detail-page">
            {/* ===== HERO GALLERY ===== */}
            <motion.section
                className="detail-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                <img
                    src={photos[activePhotoIndex]}
                    alt={attraction.name}
                    className="detail-hero__img"
                />
                <div className="detail-hero__gradient" />

                {/* Back button */}
                <button
                    className="detail-hero__back"
                    onClick={() => navigate(-1)}
                    type="button"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} />
                </button>

                {/* Gallery navigation */}
                {photos.length > 1 && (
                    <>
                        <button
                            className="detail-hero__nav detail-hero__nav--prev"
                            onClick={handlePrev}
                            type="button"
                            aria-label="Previous photo"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            className="detail-hero__nav detail-hero__nav--next"
                            onClick={handleNext}
                            type="button"
                            aria-label="Next photo"
                        >
                            <ChevronRight size={18} />
                        </button>

                        {/* Dots */}
                        <div className="detail-hero__dots">
                            {photos.map((_, i) => (
                                <button
                                    key={i}
                                    className={`detail-hero__dot ${i === activePhotoIndex ? 'detail-hero__dot--active' : ''}`}
                                    onClick={() => setActivePhotoIndex(i)}
                                    type="button"
                                    aria-label={`Photo ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </motion.section>

            {/* ===== INFO SECTION ===== */}
            <motion.div
                className="detail-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <h1 className="detail-info__name">{attraction.name}</h1>

                <div className="detail-info__meta">
                    {attraction.rating > 0 && (
                        <span className="detail-info__rating">
                            <Star size={16} fill="#fbbf24" />
                            {attraction.rating.toFixed(1)}
                        </span>
                    )}
                    {attraction.reviewCount > 0 && (
                        <span className="detail-info__reviews">
                            ({attraction.reviewCount.toLocaleString()} reviews)
                        </span>
                    )}
                    <span
                        className={`detail-info__status ${attraction.isOpenNow ? 'detail-info__status--open' : 'detail-info__status--closed'}`}
                    >
                        {attraction.isOpenNow ? '● Open Now' : '● Closed'}
                    </span>
                </div>

                {attraction.address && (
                    <div className="detail-info__address">
                        <MapPin size={16} />
                        <span>{attraction.address}</span>
                    </div>
                )}
            </motion.div>

            {/* ===== TAGS ===== */}
            {attraction.types && attraction.types.length > 0 && (
                <motion.div
                    className="detail-tags"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25 }}
                >
                    {attraction.types.slice(0, 6).map((type) => (
                        <span key={type} className="detail-tag">
                            {type.replace(/_/g, ' ')}
                        </span>
                    ))}
                </motion.div>
            )}

            {/* ===== QUICK INFO ===== */}
            <motion.div
                className="detail-quick-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="detail-quick-item">
                    <div className="detail-quick-item__icon">⏱️</div>
                    <div className="detail-quick-item__label">Duration</div>
                    <div className="detail-quick-item__value">{attraction.duration}</div>
                </div>
                <div className="detail-quick-item">
                    <div className="detail-quick-item__icon">💰</div>
                    <div className="detail-quick-item__label">Price Level</div>
                    <div className="detail-quick-item__value">
                        {attraction.isFree
                            ? 'Free'
                            : priceLevelLabels[attraction.price ? Math.min(Math.ceil(attraction.price / 500), 4) : 0]
                        }
                    </div>
                </div>
                <div className="detail-quick-item">
                    <div className="detail-quick-item__icon">⭐</div>
                    <div className="detail-quick-item__label">Rating</div>
                    <div className="detail-quick-item__value">{attraction.rating.toFixed(1)} / 5</div>
                </div>
                <div className="detail-quick-item">
                    <div className="detail-quick-item__icon">🏷️</div>
                    <div className="detail-quick-item__label">Category</div>
                    <div className="detail-quick-item__value" style={{ textTransform: 'capitalize' }}>
                        {attraction.category}
                    </div>
                </div>
            </motion.div>

            {/* ===== DESCRIPTION ===== */}
            {attraction.description && (
                <motion.div
                    className="detail-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <div className="detail-card__label">About</div>
                    <p className="detail-card__text">{attraction.description}</p>
                </motion.div>
            )}

            {/* ===== ADD TO TRIP BUTTON ===== */}
            <motion.button
                className={`detail-trip-btn ${isInTrip ? 'detail-trip-btn--added' : 'detail-trip-btn--add'}`}
                onClick={handleToggleTrip}
                type="button"
                whileTap={{ scale: 0.97 }}
            >
                {isInTrip ? (
                    <>
                        <Check size={20} />
                        Added to Trip
                    </>
                ) : (
                    <>
                        <Plus size={20} />
                        Add to Trip
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default AttractionDetailPage;
