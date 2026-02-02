import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, MapPin, Sparkles } from 'lucide-react';
import { Sidebar } from '../components/organisms';
import { DestinationCard } from '../components/molecules';
import { Button, IconButton, Chip } from '../components/atoms';
import { destinations } from '../data/destinations';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Beach', 'City', 'Culture', 'Adventure', 'Romantic', 'Nature'];

const TripBuilderPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDestinations = destinations.filter(dest => {
        const matchesCategory = selectedCategory === 'All' ||
            dest.tags.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
        const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.country.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-[var(--color-border)]">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                                Discover Destinations
                            </h1>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Find your next adventure from our curated collection
                            </p>
                        </div>
                        <Button leftIcon={<Sparkles size={16} />}>
                            AI Suggestions
                        </Button>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search destinations..."
                                className="
                  w-full
                  pl-11 pr-4 py-2.5
                  bg-[var(--color-bg-tertiary)]
                  border border-[var(--color-border)]
                  rounded-xl
                  text-sm
                  placeholder:text-[var(--color-text-muted)]
                  focus:outline-none focus:border-[var(--color-primary)]
                  focus:ring-2 focus:ring-[var(--color-primary-light)]
                  transition-all
                "
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-lg p-1">
                            <IconButton
                                icon={<Grid size={16} />}
                                size="sm"
                                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                onClick={() => setViewMode('grid')}
                            />
                            <IconButton
                                icon={<List size={16} />}
                                size="sm"
                                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                onClick={() => setViewMode('list')}
                            />
                        </div>

                        {/* Filter Button */}
                        <Button variant="outline" leftIcon={<Filter size={16} />}>
                            Filters
                        </Button>
                    </div>

                    {/* Category Chips */}
                    <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
                        {categories.map(category => (
                            <Chip
                                key={category}
                                selected={selectedCategory === category}
                                onSelect={() => setSelectedCategory(category)}
                            >
                                {category}
                            </Chip>
                        ))}
                    </div>
                </div>

                {/* Destinations Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <motion.div
                        layout
                        className={`
              ${viewMode === 'grid'
                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                                : 'flex flex-col gap-3'
                            }
            `}
                    >
                        {filteredDestinations.map((destination, index) => (
                            <motion.div
                                key={destination.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <DestinationCard
                                    destination={destination}
                                    size={viewMode === 'grid' ? 'lg' : 'md'}
                                    onClick={() => navigate('/itinerary/trip-1')}
                                />
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Empty State */}
                    {filteredDestinations.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <MapPin size={48} className="text-[var(--color-text-muted)] mb-4" />
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                No destinations found
                            </h3>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Try adjusting your search or filters
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TripBuilderPage;
