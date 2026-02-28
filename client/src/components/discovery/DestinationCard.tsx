import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { TrendingCity } from '../../types/attraction';

interface DestinationCardProps {
    city: TrendingCity;
    onClick: (cityId: string) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ city, onClick }) => {
    return (
        <motion.button
            className="dest-card"
            onClick={() => onClick(city.id)}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -4 }}
        >
            <img
                src={city.image}
                alt={city.name}
                className="dest-card__img"
                loading="lazy"
            />
            <div className="dest-card__overlay" />

            {/* Rating badge */}
            <div className="dest-card__rating">
                <Star size={10} fill="#FBBF24" stroke="#FBBF24" />
                <span>4.{5 + (city.attractionCount % 4)}</span>
            </div>

            <div className="dest-card__content">
                <h3 className="dest-card__name">{city.name}</h3>
                <p className="dest-card__meta">{city.country} · {city.attractionCount} places</p>
            </div>
        </motion.button>
    );
};

export default DestinationCard;
