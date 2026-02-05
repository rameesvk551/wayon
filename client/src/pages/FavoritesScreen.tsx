import { motion } from 'framer-motion';
import { Star, MapPin, Heart } from 'lucide-react';

const favorites: Array<{
    id: string;
    name: string;
    country: string;
    image: string;
    rating: number;
    type: string;
}> = [];

export const FavoritesScreen: React.FC = () => {
    return (
        <div className="mobile-screen">
            {/* Header */}
            <header className="mobile-simple-header">
                <h1>Favorites</h1>
                <p>{favorites.length} saved items</p>
            </header>

            {/* Favorites Grid */}
            {favorites.length === 0 ? (
                <div className="mobile-empty-state">
                    <Heart size={48} className="text-[var(--color-text-light)]" />
                    <h3>No favorites yet</h3>
                    <p>Save destinations, hotels, or activities to see them here.</p>
                </div>
            ) : (
                <div className="mobile-favorites-grid">
                    {favorites.map((item, index) => (
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
            )}

            {/* Bottom spacing */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default FavoritesScreen;
