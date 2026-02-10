import React, { useState } from 'react';
import { Search, MapPin, Star, Wifi, Waves, Dumbbell, UtensilsCrossed, SlidersHorizontal } from 'lucide-react';

const featuredHotels = [
    {
        id: 'h1',
        name: 'The Grand Palace',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
        rating: 4.9,
        location: 'Paris, France',
        price: '$320',
        priceUnit: '/night',
        amenities: ['WiFi', 'Pool', 'Spa'],
    },
    {
        id: 'h2',
        name: 'Ocean Breeze Resort',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
        rating: 4.8,
        location: 'Maldives',
        price: '$480',
        priceUnit: '/night',
        amenities: ['Beach', 'Pool', 'Dining'],
    },
    {
        id: 'h3',
        name: 'Mountain Lodge',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
        rating: 4.7,
        location: 'Swiss Alps',
        price: '$250',
        priceUnit: '/night',
        amenities: ['WiFi', 'Skiing', 'Spa'],
    },
    {
        id: 'h4',
        name: 'Urban Boutique Hotel',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80',
        rating: 4.6,
        location: 'Tokyo, Japan',
        price: '$180',
        priceUnit: '/night',
        amenities: ['WiFi', 'Gym', 'Bar'],
    },
];

const filters = ['All', 'Luxury', 'Resort', 'Boutique', 'Budget'];

const HotelsScreen: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

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
                    placeholder="Search hotels..."
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

            {/* Hotel Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {featuredHotels.map((hotel) => (
                    <div key={hotel.id} style={{
                        background: '#fff', borderRadius: 20, overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                    }}>
                        <img
                            src={hotel.image}
                            alt={hotel.name}
                            style={{ width: '100%', height: 180, objectFit: 'cover' }}
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
                                        {hotel.rating}
                                    </span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                                <MapPin size={14} color="#999" />
                                <span style={{ fontSize: 13, color: '#999' }}>{hotel.location}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                {hotel.amenities.map((a) => (
                                    <span key={a} style={{
                                        background: '#F0ECE3', padding: '5px 10px', borderRadius: 10,
                                        fontSize: 11, fontWeight: 600, color: '#666'
                                    }}>
                                        {a}
                                    </span>
                                ))}
                            </div>
                            <div style={{ marginTop: 12 }}>
                                <span style={{ fontSize: 20, fontWeight: 800, color: '#F97316' }}>
                                    {hotel.price}
                                </span>
                                <span style={{ fontSize: 13, color: '#999', marginLeft: 2 }}>
                                    {hotel.priceUnit}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelsScreen;
