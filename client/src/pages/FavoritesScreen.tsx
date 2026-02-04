import { motion } from 'framer-motion';
import { Star, MapPin, Heart } from 'lucide-react';

// Mock favorites data matching mobile app
const mockFavorites = [
    {
        id: '1',
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
        rating: 4.9,
        type: 'destination',
    },
    {
        id: '2',
        name: 'The Ritz Paris',
        country: 'Paris, France',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        rating: 4.8,
        type: 'hotel',
    },
    {
        id: '3',
        name: 'Venice Grand Canal',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=400',
        rating: 4.7,
        type: 'destination',
    },
    {
        id: '4',
        name: 'Mount Fuji Tour',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=400',
        rating: 4.9,
        type: 'activity',
    },
];

export const FavoritesScreen: React.FC = () => {
    return (
        <div className="mobile-screen">
            {/* Header */}
            <header className="mobile-simple-header">
                <h1>Favorites</h1>
                <p>{mockFavorites.length} saved items</p>
            </header>

            {/* Favorites Grid */}
            <div className="mobile-favorites-grid">
                {mockFavorites.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="mobile-favorite-card"
                    >
                        <img src={item.image} alt={item.name} className="mobile-favorite-image" />

                        <button className="mobile-favorite-heart">
                            <Heart size={20} fill="var(--color-error)" stroke="var(--color-error)" />
                        </button>

                        <div className="mobile-favorite-rating">
                            <Star size={12} fill="#FCD34D" stroke="#FCD34D" />
                            <span>{item.rating}</span>
                        </div>

                        <div className="mobile-favorite-info">
                            <h3>{item.name}</h3>
                            <div className="mobile-favorite-location">
                                <MapPin size={12} />
                                <span>{item.country}</span>
                            </div>
                            <span className="mobile-favorite-type">
                                {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom spacing */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default FavoritesScreen;
