import { motion } from 'framer-motion';
import { Compass, Bookmark, Sparkles, Plus, Settings, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { DestinationCard, TripCard } from '../molecules';
import { Button, Divider } from '../atoms';
import { destinations } from '../../data/destinations';
import { trips } from '../../data/trips';
import { useNavigate } from 'react-router-dom';

export const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const [expandedSection, setExpandedSection] = useState<'inspiration' | 'trips' | null>('inspiration');

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
        w-[300px]
        h-full
        bg-white
        border-r border-[var(--color-border)]
        flex flex-col
        overflow-hidden
      "
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-border)]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-md">
                    <Compass size={20} />
                </div>
                <div>
                    <h1 className="text-base font-bold text-[var(--color-text-primary)]">TripPlanner</h1>
                    <p className="text-xs text-[var(--color-text-muted)]">AI Travel Assistant</p>
                </div>
            </div>

            {/* New Trip Button */}
            <div className="px-4 py-4">
                <Button
                    size="md"
                    className="w-full"
                    leftIcon={<Plus size={16} />}
                >
                    New Trip
                </Button>
            </div>

            <Divider />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Inspiration Section */}
                <div className="p-4">
                    <button
                        onClick={() => setExpandedSection(expandedSection === 'inspiration' ? null : 'inspiration')}
                        className="flex items-center justify-between w-full mb-3"
                    >
                        <div className="flex items-center gap-2">
                            <Sparkles size={16} className="text-[var(--color-primary)]" />
                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">Inspiration</span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-[var(--color-text-muted)] transition-transform ${expandedSection === 'inspiration' ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {expandedSection === 'inspiration' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-2 gap-2"
                        >
                            {destinations.slice(0, 4).map(dest => (
                                <DestinationCard
                                    key={dest.id}
                                    destination={dest}
                                    size="sm"
                                />
                            ))}
                        </motion.div>
                    )}
                </div>

                <Divider />

                {/* Saved Trips Section */}
                <div className="p-4">
                    <button
                        onClick={() => setExpandedSection(expandedSection === 'trips' ? null : 'trips')}
                        className="flex items-center justify-between w-full mb-3"
                    >
                        <div className="flex items-center gap-2">
                            <Bookmark size={16} className="text-[var(--color-primary)]" />
                            <span className="text-sm font-semibold text-[var(--color-text-primary)]">My Trips</span>
                        </div>
                        <ChevronDown
                            size={16}
                            className={`text-[var(--color-text-muted)] transition-transform ${expandedSection === 'trips' ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {expandedSection === 'trips' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-2"
                        >
                            {trips.map(trip => (
                                <TripCard
                                    key={trip.id}
                                    trip={trip}
                                    onClick={() => navigate(`/itinerary/${trip.id}`)}
                                />
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--color-border)]">
                <button className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                    <Settings size={16} />
                    <span>Settings</span>
                </button>
            </div>
        </motion.aside>
    );
};
