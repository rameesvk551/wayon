import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Filter } from 'lucide-react';

const featuredTours = [
    {
        id: 't1',
        name: 'Bali Adventure',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=80',
        rating: 4.9,
        duration: '5 Days',
        price: '$899',
        location: 'Indonesia',
    },
    {
        id: 't2',
        name: 'Swiss Alps Trek',
        image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&q=80',
        rating: 4.8,
        duration: '7 Days',
        price: '$1,299',
        location: 'Switzerland',
    },
    {
        id: 't3',
        name: 'Tokyo Culture Tour',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
        rating: 4.7,
        duration: '4 Days',
        price: '$750',
        location: 'Japan',
    },
    {
        id: 't4',
        name: 'Santorini Escape',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
        rating: 4.9,
        duration: '6 Days',
        price: '$1,100',
        location: 'Greece',
    },
];

const categories = ['All', 'Adventure', 'Cultural', 'Beach', 'Mountain', 'City'];

const ToursScreen: React.FC = () => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    return (
        <div className="tours-screen" style={{ padding: '20px 16px', paddingBottom: '100px' }}>
            {/* Search */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#F0ECE3', borderRadius: 16, padding: '12px 16px', marginBottom: 16
            }}>
                <Search size={18} color="#999" />
                <input
                    type="text"
                    placeholder="Search tours..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                        flex: 1, border: 'none', background: 'transparent', outline: 'none',
                        fontSize: 15, color: '#1a1a1a'
                    }}
                />
            </div>

            {/* Categories */}
            <div style={{
                display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 20,
                paddingBottom: 4, scrollbarWidth: 'none'
            }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                            padding: '10px 18px', borderRadius: 24, border: 'none',
                            background: activeCategory === cat ? '#F97316' : '#F0ECE3',
                            color: activeCategory === cat ? '#fff' : '#666',
                            fontSize: 14, fontWeight: 600, cursor: 'pointer',
                            whiteSpace: 'nowrap', flexShrink: 0,
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Tour Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {featuredTours.map((tour) => (
                    <div key={tour.id} style={{
                        background: '#fff', borderRadius: 20, overflow: 'hidden',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
                    }}>
                        <img
                            src={tour.image}
                            alt={tour.name}
                            style={{ width: '100%', height: 180, objectFit: 'cover' }}
                        />
                        <div style={{ padding: 16 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                                {tour.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                                <MapPin size={14} color="#999" />
                                <span style={{ fontSize: 13, color: '#999' }}>{tour.location}</span>
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                marginTop: 12
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Star size={14} color="#F59E0B" fill="#F59E0B" />
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{tour.rating}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Clock size={14} color="#999" />
                                    <span style={{ fontSize: 13, color: '#999' }}>{tour.duration}</span>
                                </div>
                                <span style={{ fontSize: 16, fontWeight: 800, color: '#F97316' }}>
                                    {tour.price}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToursScreen;
