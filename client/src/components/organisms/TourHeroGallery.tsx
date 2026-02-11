import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTourStore } from '../../store/useTourStore';

interface TourHeroGalleryProps {
    images: string[];
    tourId: string;
    tourName: string;
}

export const TourHeroGallery: React.FC<TourHeroGalleryProps> = ({ images, tourId, tourName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { wishlist, toggleWishlist } = useTourStore();
    const isWishlisted = wishlist.has(tourId);
    const navigate = useNavigate();

    const goNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const goPrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({ title: tourName, url: window.location.href });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <div className="tour-hero-gallery">
            {/* Images */}
            <div className="tour-hero-image-container">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={currentIndex}
                        src={images[currentIndex]}
                        alt={`${tourName} ${currentIndex + 1}`}
                        className="tour-hero-image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>

                {/* Navigation arrows */}
                {images.length > 1 && (
                    <>
                        <button className="tour-hero-nav tour-hero-nav-prev" onClick={goPrev}>
                            <ChevronLeft size={20} />
                        </button>
                        <button className="tour-hero-nav tour-hero-nav-next" onClick={goNext}>
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Image counter */}
                <span className="tour-hero-counter">{currentIndex + 1} / {images.length}</span>

                {/* Dots */}
                <div className="tour-hero-dots">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`tour-hero-dot ${i === currentIndex ? 'active' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Top bar overlays */}
            <div className="tour-hero-top-bar">
                <button className="tour-hero-back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={20} />
                </button>
                <div className="tour-hero-top-actions">
                    <button className="tour-hero-action-btn" onClick={handleShare}>
                        <Share2 size={18} />
                    </button>
                    <button
                        className={`tour-hero-action-btn ${isWishlisted ? 'active' : ''}`}
                        onClick={() => toggleWishlist(tourId)}
                    >
                        <Heart size={18} fill={isWishlisted ? '#EF4444' : 'none'} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TourHeroGallery;
