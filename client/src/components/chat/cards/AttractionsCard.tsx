import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, CheckCircle2, Sparkles } from 'lucide-react';
import { AttractionModal } from './AttractionModal';
import type { Attraction } from '../types';

interface AttractionsCardProps {
    destination: string;
    attractions?: Attraction[];
    onContinue: (selectedAttractions: Attraction[]) => void;
}

export const AttractionsCard = ({ destination, attractions = [], onContinue }: AttractionsCardProps) => {
    const [selectedAttractionIds, setSelectedAttractionIds] = useState<string[]>([]);
    const [modalAttraction, setModalAttraction] = useState<Attraction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleSelection = (id: string) => {
        setSelectedAttractionIds((prev) =>
            prev.includes(id)
                ? prev.filter((a) => a !== id)
                : [...prev, id]
        );
    };

    const openModal = (attraction: Attraction) => {
        setModalAttraction(attraction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalAttraction(null);
    };

    const getSelectedAttractions = (): Attraction[] => attractions.filter((a) => selectedAttractionIds.includes(a.id));

    return (
        <div className="interactive-card attractions">
            <div className="attractions-header">
                <div className="interactive-card-header">
                    <Star size={20} className="text-[var(--color-primary)]" />
                    <h3>
                        Top Attractions in {destination ? destination.split(',')[0] : 'your destination'}
                    </h3>
                </div>
                <p className="interactive-card-subtitle">
                    Select the places you'd like to visit ({selectedAttractionIds.length} selected)
                </p>
            </div>

            <div className="attractions-scroll-container">
                {attractions.length === 0 ? (
                    <div className="text-center text-sm text-[var(--color-text-muted)] py-6">
                        No attractions available yet.
                    </div>
                ) : (
                    <div className="attractions-grid">
                        {attractions.map((attraction) => {
                            const isSelected = selectedAttractionIds.includes(attraction.id);
                            return (
                                <motion.div
                                    key={attraction.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`attraction-card ${isSelected ? 'selected' : ''}`}
                                >
                                    <button
                                        className={`attraction-select-btn ${isSelected ? 'selected' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleSelection(attraction.id);
                                        }}
                                    >
                                        {isSelected ? <CheckCircle2 size={20} /> : <div className="attraction-select-circle" />}
                                    </button>

                                    <div className="attraction-card-clickable" onClick={() => openModal(attraction)}>
                                        <div className="attraction-image">
                                            <img src={attraction.image} alt={attraction.name} />
                                            <span className="attraction-category">{attraction.category}</span>
                                        </div>
                                        <div className="attraction-content">
                                            <h4>{attraction.name}</h4>
                                            <p className="attraction-desc">{attraction.description}</p>
                                            <div className="attraction-meta">
                                                <span className="attraction-rating">
                                                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                                    {attraction.rating}
                                                </span>
                                                <span className="attraction-duration">
                                                    <Clock size={14} />
                                                    {attraction.duration}
                                                </span>
                                                <span className="attraction-price">{attraction.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="attractions-sticky-footer">
                <button
                    onClick={() => onContinue(getSelectedAttractions())}
                    className="generate-itinerary-btn"
                    disabled={attractions.length > 0 && selectedAttractionIds.length === 0}
                >
                    <Sparkles size={20} />
                    {attractions.length > 0
                        ? selectedAttractionIds.length > 0
                            ? `Generate Itinerary (${selectedAttractionIds.length} selected)`
                            : 'Select attractions to generate itinerary'
                        : 'Continue to generate itinerary'}
                </button>
            </div>

            <AttractionModal
                attraction={modalAttraction}
                isOpen={isModalOpen}
                onClose={closeModal}
                isSelected={modalAttraction ? selectedAttractionIds.includes(modalAttraction.id) : false}
                onToggleSelect={() => modalAttraction && toggleSelection(modalAttraction.id)}
            />
        </div>
    );
};
