import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, SlidersHorizontal, Loader2 } from 'lucide-react';
import { useHotelStore } from '../store/useHotelStore';

const filters = ['All', 'Luxury', 'Resort', 'Boutique', 'Budget'];

const HotelsScreen: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const {
        hotels,
        isLoading,
        error,
        fetchHotels,
        destination,
    } = useHotelStore();

    // Fetch hotels on mount
    useEffect(() => {
        if (hotels.length === 0) {
            fetchHotels();
        }
    }, []);

    // Filter hotels client-side by category and search
    const filteredHotels = hotels.filter((hotel) => {
        // Search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            if (
                !hotel.name.toLowerCase().includes(q) &&
                !hotel.location.toLowerCase().includes(q)
            ) {
                return false;
            }
        }

        // Category filter
        if (activeFilter !== 'All') {
            switch (activeFilter) {
                case 'Luxury':
                    return hotel.price >= 300 || hotel.rating >= 4.8;
                case 'Resort':
                    return hotel.amenities.some((a) =>
                        ['Pool', 'Spa', 'Beach', 'Beach Access'].includes(a)
                    );
                case 'Boutique':
                    return hotel.price >= 100 && hotel.price < 300;
                case 'Budget':
                    return hotel.price < 100;
                default:
                    return true;
            }
        }

        return true;
    });

    return (
        <div className="hotels-screen" style={{ padding: '20px 16px', paddingBottom: '100px' }}>
            {/* Search */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#F0ECE3', borderRadius: 16, padding: '12px 16px', marginBottom: 16
            }}>
                <Search size={18} color="#999" />
                <input
                    type="text"
                    placeholder={`Search hotels in ${destination}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, border: 'none', background: 'transparent', outline: 'none',
                        fontSize: 15, color: '#1a1a1a'
                    }}
                />
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <SlidersHorizontal size={18} color="#1a1a1a" />
                </button>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 20,
                paddingBottom: 4, scrollbarWidth: 'none'
            }}>
                {filters.map((f) => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        style={{
                            padding: '10px 18px', borderRadius: 24, border: 'none',
                            background: activeFilter === f ? '#F97316' : '#F0ECE3',
                            color: activeFilter === f ? '#fff' : '#666',
                            fontSize: 14, fontWeight: 600, cursor: 'pointer',
                            whiteSpace: 'nowrap', flexShrink: 0,
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Loading State */}
            {isLoading && hotels.length === 0 && (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', padding: '60px 20px', gap: 16,
                }}>
                    <Loader2 size={36} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: '#999', fontSize: 14, fontWeight: 500 }}>
                        Searching hotels in {destination}...
                    </p>
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    background: '#FFF5F5', borderRadius: 16, marginBottom: 16,
                }}>
                    <p style={{ color: '#E53E3E', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                        Failed to load hotels
                    </p>
                    <p style={{ color: '#999', fontSize: 13, marginBottom: 16 }}>{error}</p>
                    <button
                        onClick={() => fetchHotels()}
                        style={{
                            padding: '10px 24px', borderRadius: 12, border: 'none',
                            background: '#F97316', color: '#fff', fontSize: 14,
                            fontWeight: 600, cursor: 'pointer',
                        }}
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredHotels.length === 0 && (
                <div style={{
                    textAlign: 'center', padding: '60px 20px',
                }}>
                    <p style={{ color: '#999', fontSize: 15, fontWeight: 500 }}>
                        No hotels found
                    </p>
                    <p style={{ color: '#bbb', fontSize: 13, marginTop: 4 }}>
                        Try a different search or filter
                    </p>
                </div>
            )}

            {/* Hotel Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {filteredHotels.map((hotel) => (
                    <div key={hotel.id} style={{
                        background: '#fff', borderRadius: 20, overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                    }}>
                        <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            style={{ width: '100%', height: 180, objectFit: 'cover' }}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80';
                            }}
                        />
                        <div style={{ padding: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', margin: 0, flex: 1 }}>
                                    {hotel.name}
                                </h3>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    background: '#F97316', padding: '4px 8px', borderRadius: 12
                                }}>
                                    <Star size={12} color="#fff" fill="#fff" />
                                    <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>
                                        {hotel.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                                <MapPin size={14} color="#999" />
                                <span style={{ fontSize: 13, color: '#999' }}>{hotel.location}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                                {hotel.amenities.slice(0, 4).map((a) => (
                                    <span key={a} style={{
                                        background: '#F0ECE3', padding: '5px 10px', borderRadius: 10,
                                        fontSize: 11, fontWeight: 600, color: '#666'
                                    }}>
                                        {a}
                                    </span>
                                ))}
                            </div>
                            <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                {hotel.originalPrice && hotel.originalPrice > hotel.price && (
                                    <span style={{
                                        fontSize: 14, color: '#bbb',
                                        textDecoration: 'line-through', marginRight: 4
                                    }}>
                                        {hotel.currency}{hotel.originalPrice}
                                    </span>
                                )}
                                <span style={{ fontSize: 20, fontWeight: 800, color: '#F97316' }}>
                                    {hotel.currency}{hotel.price > 0 ? hotel.price : '—'}
                                </span>
                                <span style={{ fontSize: 13, color: '#999' }}>
                                    /night
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Loading more indicator */}
            {isLoading && hotels.length > 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Loader2 size={24} color="#F97316" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            )}
        </div>
    );
};

export default HotelsScreen;
