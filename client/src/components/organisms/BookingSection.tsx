import { motion } from 'framer-motion';
import { ExternalLink, CreditCard, Hotel, Plane, Ticket } from 'lucide-react';

interface BookingSectionProps {
    hotels?: Array<{
        id: string;
        name: string;
        nights: number;
        totalPrice: number;
        bookingUrl?: string;
    }>;
    transport?: Array<{
        id: string;
        type: string;
        from: string;
        to: string;
        price: number;
        bookingUrl?: string;
    }>;
    activities?: Array<{
        id: string;
        name: string;
        price: number;
        bookingUrl?: string;
    }>;
}

const defaultData = {
    hotels: [
        { id: '1', name: 'Hotel Grande Bretagne', nights: 2, totalPrice: 700 },
        { id: '2', name: 'Myconian Collection', nights: 2, totalPrice: 960 },
        { id: '3', name: 'Canaves Oia Suites', nights: 3, totalPrice: 1950 }
    ],
    transport: [
        { id: '1', type: 'ferry', from: 'Athens', to: 'Mykonos', price: 45 },
        { id: '2', type: 'ferry', from: 'Mykonos', to: 'Santorini', price: 55 }
    ],
    activities: [
        { id: '1', name: 'Acropolis Visit', price: 20 },
        { id: '2', name: 'Delos Island Day Trip', price: 55 },
        { id: '3', name: 'Sunset Sailing Cruise', price: 150 }
    ]
};

export const BookingSection: React.FC<BookingSectionProps> = ({
    hotels = defaultData.hotels,
    transport = defaultData.transport,
    activities = defaultData.activities
}) => {
    const totalHotels = hotels.reduce((sum, h) => sum + h.totalPrice, 0);
    const totalTransport = transport.reduce((sum, t) => sum + t.price, 0);
    const totalActivities = activities.reduce((sum, a) => sum + a.price, 0);
    const grandTotal = totalHotels + totalTransport + totalActivities;

    return (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                    Complete Your Bookings
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                    Reserve your accommodations and activities
                </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Hotels */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Hotel size={18} className="text-[var(--color-secondary)]" />
                        <h4 className="font-medium text-[var(--color-text-primary)]">
                            Accommodations
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {hotels.map((hotel, index) => (
                            <motion.div
                                key={hotel.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-lg"
                            >
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                        {hotel.name}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {hotel.nights} nights
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                        ${hotel.totalPrice}
                                    </span>
                                    <button className="
                                        flex items-center gap-1
                                        px-3 py-1.5
                                        text-xs font-medium
                                        text-white
                                        bg-[var(--color-secondary)]
                                        rounded-lg
                                        hover:bg-[var(--color-secondary-hover)]
                                        transition-colors
                                    ">
                                        Book
                                        <ExternalLink size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Transport */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Plane size={18} className="text-[var(--color-accent)]" />
                        <h4 className="font-medium text-[var(--color-text-primary)]">
                            Transport
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {transport.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-lg"
                            >
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                        {item.from} → {item.to}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)] capitalize">
                                        {item.type}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                        ${item.price}
                                    </span>
                                    <button className="
                                        flex items-center gap-1
                                        px-3 py-1.5
                                        text-xs font-medium
                                        text-[var(--color-accent)]
                                        bg-[var(--color-accent-light)]
                                        rounded-lg
                                        hover:bg-[var(--color-accent)] hover:text-white
                                        transition-colors
                                    ">
                                        Reserve
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Activities */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Ticket size={18} className="text-[var(--color-primary)]" />
                        <h4 className="font-medium text-[var(--color-text-primary)]">
                            Activities & Tours
                        </h4>
                    </div>
                    <div className="space-y-2">
                        {activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-lg"
                            >
                                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                    {activity.name}
                                </p>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                                        ${activity.price}
                                    </span>
                                    <button className="
                                        flex items-center gap-1
                                        px-3 py-1.5
                                        text-xs font-medium
                                        text-[var(--color-primary)]
                                        bg-[var(--color-primary-subtle)]
                                        rounded-lg
                                        hover:bg-[var(--color-primary)] hover:text-white
                                        transition-colors
                                    ">
                                        Book
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer - Total */}
            <div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-tertiary)]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--color-text-muted)]">Estimated Total</p>
                        <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                            ${grandTotal.toLocaleString()}
                        </p>
                    </div>
                    <button className="
                        flex items-center gap-2
                        px-6 py-3
                        text-sm font-semibold
                        text-white
                        bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]
                        rounded-xl
                        hover:shadow-lg
                        transition-all duration-200
                    ">
                        <CreditCard size={18} />
                        Book All
                    </button>
                </div>
            </div>
        </div>
    );
};
