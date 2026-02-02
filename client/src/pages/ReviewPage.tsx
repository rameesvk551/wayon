import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Clock, Star } from 'lucide-react';
import { greekItineraryDays, greekItinerary } from '../data/itinerary';
import { ExportOptions } from '../components/molecules/ExportOptions';
import { BookingSection } from '../components/organisms/BookingSection';
import { TransportBadge, PriceTag, RatingStars } from '../components/molecules';

const ReviewPage: React.FC = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(`/plan/${tripId || 'trip-1'}`);
    };

    const handleExportPDF = () => console.log('Export PDF');
    const handleCopyLink = () => console.log('Copy link');

    // Calculate totals
    const totalDays = greekItineraryDays.length;
    const totalActivities = greekItineraryDays.reduce(
        (sum, day) => sum + day.activities.length,
        0
    );
    const cities = [...new Set(greekItineraryDays.map(d => d.city))];

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Header */}
            <motion.header
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]"
            >
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleGoBack}
                                className="
                                    w-10 h-10 rounded-full
                                    flex items-center justify-center
                                    hover:bg-[var(--color-bg-tertiary)]
                                    transition-colors
                                "
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                                    {greekItinerary.name}
                                </h1>
                                <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        Mar 15 – Mar 22, 2026
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        2 travelers
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/plan/${tripId || 'trip-1'}`)}
                            className="
                                px-4 py-2
                                text-sm font-medium
                                text-[var(--color-primary)]
                                border border-[var(--color-primary)]
                                rounded-lg
                                hover:bg-[var(--color-primary-subtle)]
                                transition-colors
                            "
                        >
                            Edit Trip
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Hero Image */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative h-64 overflow-hidden"
            >
                <img
                    src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600&q=80"
                    alt="Trip cover"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-0 right-0 max-w-5xl mx-auto px-6">
                    <div className="flex items-end gap-6">
                        <div className="flex gap-2">
                            {cities.map(city => (
                                <span
                                    key={city}
                                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white"
                                >
                                    {city}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                {/* Summary Stats */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-4 gap-4"
                >
                    {[
                        { label: 'Days', value: totalDays, icon: Calendar },
                        { label: 'Cities', value: cities.length, icon: MapPin },
                        { label: 'Activities', value: totalActivities, icon: Star },
                        { label: 'Duration', value: '7 nights', icon: Clock }
                    ].map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-xl border border-[var(--color-border)] p-4 text-center"
                            >
                                <Icon size={20} className="mx-auto mb-2 text-[var(--color-primary)]" />
                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-[var(--color-text-muted)]">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

                {/* Export Options */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <ExportOptions
                        onExportPDF={handleExportPDF}
                        onCopyLink={handleCopyLink}
                    />
                </motion.div>

                {/* Full Itinerary */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-[var(--color-border)]">
                        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                            Full Itinerary
                        </h2>
                    </div>
                    <div className="divide-y divide-[var(--color-border)]">
                        {greekItineraryDays.map((day, index) => (
                            <motion.div
                                key={day.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                className="p-6"
                            >
                                {/* Day Header */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="
                                        w-12 h-12 rounded-xl
                                        bg-[var(--color-primary)]
                                        text-white
                                        flex flex-col items-center justify-center
                                    ">
                                        <span className="text-[10px] opacity-80">DAY</span>
                                        <span className="text-lg font-bold leading-none">{day.dayNumber}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--color-text-primary)]">
                                            {day.city}
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-muted)]">
                                            {new Date(day.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    {day.transport && (
                                        <div className="ml-auto">
                                            <TransportBadge
                                                type={day.transport.type}
                                                duration={day.transport.duration}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Activities */}
                                <div className="ml-16 space-y-3">
                                    {day.activities.map(activity => (
                                        <div
                                            key={activity.id}
                                            className="flex items-center gap-4 p-3 bg-[var(--color-bg-tertiary)] rounded-xl"
                                        >
                                            <img
                                                src={activity.image}
                                                alt={activity.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                                                    {activity.name}
                                                </h4>
                                                <p className="text-xs text-[var(--color-text-muted)]">
                                                    {activity.startTime} - {activity.endTime} • {activity.location}
                                                </p>
                                            </div>
                                            {activity.price && (
                                                <PriceTag price={activity.price} size="sm" />
                                            )}
                                        </div>
                                    ))}

                                    {/* Hotel */}
                                    {day.hotel && (
                                        <div className="flex items-center gap-4 p-3 bg-[var(--color-secondary-light)] rounded-xl">
                                            <img
                                                src={day.hotel.image}
                                                alt={day.hotel.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
                                                    {day.hotel.name}
                                                </h4>
                                                <div className="flex items-center gap-2">
                                                    <RatingStars rating={day.hotel.rating} size="sm" showValue={false} />
                                                    <span className="text-xs text-[var(--color-text-muted)]">
                                                        Check-in: {day.hotel.checkIn}
                                                    </span>
                                                </div>
                                            </div>
                                            <PriceTag
                                                price={day.hotel.pricePerNight}
                                                suffix="/night"
                                                size="sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Booking Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <BookingSection />
                </motion.div>
            </div>
        </div>
    );
};

export default ReviewPage;
