import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface FlightItem {
    id: string;
    airline: string;
    airlineLogo?: string;
    flightNumber: string;
    departure: string;
    arrival: string;
    departureAirport: string;
    arrivalAirport: string;
    departureCity?: string;
    arrivalCity?: string;
    duration: string;
    price: string;
    stops: number;
    aircraft?: string;
    class?: string;
    gate?: string;
    seat?: string;
}

interface FlightCarouselBlockProps {
    title?: string;
    flights: FlightItem[];
    onFlightClick?: (flightId: string) => void;
    onBookClick?: (flightId: string) => void;
}

export const FlightCarouselBlock: React.FC<FlightCarouselBlockProps> = ({
    title,
    flights,
    onFlightClick,
    onBookClick
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            {title && (
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                        {title}
                    </h3>
                    <div className="flex items-center gap-1">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('left')}
                            className="p-1.5 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-sm transition-all"
                        >
                            <ChevronLeft size={18} />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => scroll('right')}
                            className="p-1.5 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:shadow-sm transition-all"
                        >
                            <ChevronRight size={18} />
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {flights.map((flight, index) => (
                    <motion.div
                        key={flight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="flex-shrink-0 cursor-pointer"
                        style={{ width: '300px' }}
                        onClick={() => onFlightClick?.(flight.id)}
                    >
                        <div
                            className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                            style={{
                                background: 'linear-gradient(145deg, #1a4a7a 0%, #0d2845 100%)'
                            }}
                        >
                            {/* Top Section - Flight Route */}
                            <div className="p-4">
                                {/* Time Row */}
                                <div className="flex justify-between items-center mb-4 text-white/60 text-xs">
                                    <span>🛫 {flight.departure}</span>
                                    <span>{flight.arrival} 🛬</span>
                                </div>

                                {/* Route Display */}
                                <div className="flex items-center justify-between mb-2">
                                    {/* Departure */}
                                    <div className="text-left">
                                        <p className="text-2xl font-bold text-white">
                                            {flight.departureAirport}
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {flight.departureCity || 'Departure'}
                                        </p>
                                    </div>

                                    {/* Flight Path */}
                                    <div className="flex-1 mx-4 relative">
                                        <div className="flex items-center justify-center">
                                            <svg viewBox="0 0 120 30" className="w-full h-8">
                                                {/* Path */}
                                                <path
                                                    d="M 10 20 Q 60 0 110 20"
                                                    fill="none"
                                                    stroke="rgba(255,255,255,0.3)"
                                                    strokeWidth="1.5"
                                                    strokeDasharray="4 2"
                                                />
                                                {/* Plane dot */}
                                                <circle cx="60" cy="8" r="3" fill="white" />
                                            </svg>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 flex justify-center">
                                            <span className="text-[10px] text-white/70 bg-white/10 px-2 py-0.5 rounded-full">
                                                {flight.duration}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Arrival */}
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-white">
                                            {flight.arrivalAirport}
                                        </p>
                                        <p className="text-xs text-white/50">
                                            {flight.arrivalCity || 'Arrival'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider with notches */}
                            <div className="relative h-4 flex items-center">
                                <div
                                    className="absolute left-0 w-3 h-3 rounded-full -translate-x-1/2"
                                    style={{ backgroundColor: 'var(--color-bg-primary, #f5f5f5)' }}
                                />
                                <div className="flex-1 mx-3 border-t border-dashed border-white/30" />
                                <div
                                    className="absolute right-0 w-3 h-3 rounded-full translate-x-1/2"
                                    style={{ backgroundColor: 'var(--color-bg-primary, #f5f5f5)' }}
                                />
                            </div>

                            {/* Bottom Section - Ticket Info */}
                            <div className="p-4 pt-2">
                                <div className="flex items-end justify-between">
                                    {/* Flight Number */}
                                    <div>
                                        <p className="text-sm font-bold text-white">
                                            {flight.flightNumber}
                                        </p>
                                        <p className="text-[9px] text-white/40 uppercase">
                                            Flight
                                        </p>
                                    </div>

                                    {/* Gate */}
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white">
                                            {flight.gate || '--'}
                                        </p>
                                        <p className="text-[9px] text-white/40 uppercase">
                                            Gate
                                        </p>
                                    </div>

                                    {/* Seat */}
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-white">
                                            {flight.seat || '--'}
                                        </p>
                                        <p className="text-[9px] text-white/40 uppercase">
                                            Seat
                                        </p>
                                    </div>

                                    {/* Price Button */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={(e) => { e.stopPropagation(); onBookClick?.(flight.id); }}
                                        className="px-3 py-1.5 text-xs font-bold text-[#0d2845] bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                                    >
                                        {flight.price}
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
