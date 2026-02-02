import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from '../components/organisms/HeroSection';
import { CategoryCarousel } from '../components/organisms/CategoryCarousel';
import { InspirationCard } from '../components/molecules/InspirationCard';
import { destinations } from '../data/destinations';
import { AIChip } from '../components/atoms/AIChip';
import { Sparkles, TrendingUp, MapPin, Globe } from 'lucide-react';

const DiscoverPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSearch = (query: string) => {
        // Navigate to plan mode with search query
        console.log('Search:', query);
        navigate('/plan/new');
    };

    const handleDestinationClick = (destinationId: string) => {
        navigate(`/plan/${destinationId}`);
    };

    const handleCategoryClick = (categoryId: string) => {
        console.log('Category clicked:', categoryId);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Hero Section */}
            <HeroSection onSearch={handleSearch} />

            {/* Category Carousel */}
            <CategoryCarousel onCategoryClick={handleCategoryClick} />

            {/* Trending Destinations */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={20} className="text-[var(--color-accent)]" />
                                <span className="text-sm font-medium text-[var(--color-accent)]">
                                    Trending Now
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                Popular Destinations
                            </h2>
                        </div>
                        <AIChip variant="subtle">
                            <Sparkles size={14} />
                            Get AI Recommendations
                        </AIChip>
                    </div>

                    {/* Destinations Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {destinations.slice(0, 6).map((destination, index) => (
                            <motion.div
                                key={destination.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <InspirationCard
                                    destination={destination}
                                    size={index === 0 ? 'lg' : 'md'}
                                    onClick={() => handleDestinationClick(destination.id)}
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Features Banner */}
            <section className="py-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm mb-6">
                            <Sparkles size={16} />
                            Powered by AI
                        </div>
                        <h2 className="text-display-sm text-white mb-4">
                            Plan smarter, travel better
                        </h2>
                        <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                            Our AI analyzes thousands of trips to create personalized itineraries
                            that match your style, budget, and preferences.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Globe size={24} className="text-white" />
                                <div className="text-left">
                                    <div className="text-xl font-bold text-white">500+</div>
                                    <div className="text-sm text-white/70">Destinations</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <MapPin size={24} className="text-white" />
                                <div className="text-left">
                                    <div className="text-xl font-bold text-white">10K+</div>
                                    <div className="text-sm text-white/70">Activities</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 px-5 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                <Sparkles size={24} className="text-white" />
                                <div className="text-left">
                                    <div className="text-xl font-bold text-white">50K+</div>
                                    <div className="text-sm text-white/70">Trips Planned</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-16 bg-[var(--color-bg-primary)]">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                        Ready to start planning?
                    </h2>
                    <p className="text-[var(--color-text-muted)] mb-6">
                        Tell us about your dream trip and we'll handle the rest.
                    </p>
                    <button
                        onClick={() => navigate('/plan/new')}
                        className="
                            inline-flex items-center gap-2
                            px-8 py-4
                            bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
                            text-white font-semibold
                            rounded-xl
                            shadow-lg hover:shadow-xl
                            transition-all duration-200
                            hover:scale-105
                        "
                    >
                        <Sparkles size={20} />
                        Start Planning with AI
                    </button>
                </div>
            </section>
        </div>
    );
};

export default DiscoverPage;
