import type { Destination } from '../types';

export const destinations: Destination[] = [
    {
        id: 'dest-1',
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        rating: 4.9,
        reviewCount: 12453,
        description: 'Famous for its stunning sunsets, white-washed buildings, and crystal-clear waters.',
        tags: ['Islands', 'Romantic', 'Beach'],
        coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    {
        id: 'dest-2',
        name: 'Kyoto',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        rating: 4.8,
        reviewCount: 9876,
        description: 'Ancient temples, traditional tea houses, and beautiful cherry blossoms.',
        tags: ['Culture', 'Temples', 'Nature'],
        coordinates: { lat: 35.0116, lng: 135.7681 }
    },
    {
        id: 'dest-3',
        name: 'Amalfi Coast',
        country: 'Italy',
        image: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=800&q=80',
        rating: 4.9,
        reviewCount: 8234,
        description: 'Dramatic coastline with colorful villages perched on steep cliffs.',
        tags: ['Coastal', 'Scenic', 'Food'],
        coordinates: { lat: 40.6333, lng: 14.6029 }
    },
    {
        id: 'dest-4',
        name: 'Bali',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        rating: 4.7,
        reviewCount: 15632,
        description: 'Tropical paradise with rice terraces, temples, and vibrant culture.',
        tags: ['Tropical', 'Wellness', 'Adventure'],
        coordinates: { lat: -8.3405, lng: 115.0920 }
    },
    {
        id: 'dest-5',
        name: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        rating: 4.8,
        reviewCount: 22341,
        description: 'The City of Light, famous for art, fashion, and world-class cuisine.',
        tags: ['City', 'Culture', 'Romantic'],
        coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
        id: 'dest-6',
        name: 'Maldives',
        country: 'Maldives',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
        rating: 4.9,
        reviewCount: 7654,
        description: 'Crystal-clear waters, overwater villas, and pristine white sand beaches.',
        tags: ['Luxury', 'Beach', 'Diving'],
        coordinates: { lat: 3.2028, lng: 73.2207 }
    }
];

export const trendingDestinations = destinations.slice(0, 4);
export const popularDestinations = destinations;
