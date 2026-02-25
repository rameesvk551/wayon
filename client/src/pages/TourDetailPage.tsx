import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TourHeroGallery } from '../components/organisms/TourHeroGallery';
import { TourInfoSection } from '../components/organisms/TourInfoSection';
import { TourTabsSection } from '../components/organisms/TourTabsSection';
import { TourBookingCard } from '../components/organisms/TourBookingCard';
import { RelatedTours } from '../components/organisms/RelatedTours';
import { useTourStore } from '../store/useTourStore';
import type { TourListingItem } from '../data/tourListingData';

const TourDetailPage: React.FC = () => {
    const { tourId } = useParams<{ tourId: string }>();
    const navigate = useNavigate();
    const { getTourById, fetchTourById } = useTourStore();
    const [tour, setTour] = useState<TourListingItem | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!tourId) return;

        // Try local store first
        const localTour = getTourById(tourId);
        if (localTour) {
            setTour(localTour);
            setLoading(false);
            return;
        }

        // Fetch from API
        setLoading(true);
        fetchTourById(tourId).then((fetched) => {
            setTour(fetched);
            setLoading(false);
        });
    }, [tourId]);

    if (loading) {
        return (
            <div className="tour-detail-not-found" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '12px' }}>
                <Loader2 size={24} className="animate-spin" />
                <p>Loading tour details...</p>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="tour-detail-not-found">
                <p>Tour not found</p>
                <button onClick={() => navigate('/tours')} className="tour-back-link">
                    <ArrowLeft size={16} />
                    Back to Tours
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="tour-detail-page"
        >
            {/* Hero Gallery */}
            <TourHeroGallery
                images={tour.images}
                tourId={tour.id}
                tourName={tour.name}
            />

            {/* Main Content */}
            <div className="tour-detail-main">
                {/* Info Section */}
                <TourInfoSection tour={tour} />

                {/* Tabs Section */}
                <TourTabsSection tour={tour} />

                {/* Related Tours */}
                <RelatedTours tourId={tour.id} />
            </div>

            {/* Sticky Booking Card */}
            <TourBookingCard tour={tour} />
        </motion.div>
    );
};

export default TourDetailPage;
