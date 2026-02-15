import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Clock, Plus, Check } from 'lucide-react';
import { useAttractionStore } from '../../store/useAttractionStore';
import type { Attraction } from '../../types/attraction';

interface AttractionCardProps {
    attraction: Attraction;
    index?: number;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction, index = 0 }) => {
    const navigate = useNavigate();
    const { addAttraction, isInTrip } = useAttractionStore();
    const [imgLoaded, setImgLoaded] = useState(false);
    const added = isInTrip(attraction.id);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!added) addAttraction(attraction);
    };

    const handleCardClick = () => {
        const citySlug = (attraction.city || 'city').toLowerCase().replace(/\s+/g, '-');
        navigate(`/attractions/${citySlug}/${encodeURIComponent(attraction.id)}`);
    };

    return (
        <motion.div
            className="attr-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {/* Image */}
            <div className="attr-card__img-wrap">
                {!imgLoaded && <div className="attr-card__skeleton shimmer" />}
                <img
                    src={attraction.image}
                    alt={attraction.name}
                    className={`attr-card__img ${imgLoaded ? 'attr-card__img--loaded' : ''}`}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                />
                <span className="attr-card__cat-tag">{attraction.category}</span>
                {attraction.isFree && <span className="attr-card__free-tag">Free</span>}
            </div>

            {/* Body */}
            <div className="attr-card__body">
                <h3 className="attr-card__name">{attraction.name}</h3>

                <div className="attr-card__row">
                    <span className="attr-card__rating">
                        <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                        {attraction.rating}
                        <span className="attr-card__reviews">({attraction.reviewCount.toLocaleString()})</span>
                    </span>
                    <span className="attr-card__duration">
                        <Clock size={13} />
                        {attraction.duration}
                    </span>
                </div>

                <p className="attr-card__desc line-clamp-2">{attraction.description}</p>

                <motion.button
                    className={`attr-card__add-btn ${added ? 'attr-card__add-btn--added' : ''}`}
                    onClick={handleAdd}
                    whileTap={{ scale: 0.95 }}
                    layout
                >
                    {added ? (
                        <>
                            <Check size={16} /> Added
                        </>
                    ) : (
                        <>
                            <Plus size={16} /> Add to Trip
                        </>
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
};

export default AttractionCard;
