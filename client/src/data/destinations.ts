import type { Destination } from '../types';

export const destinations: Destination[] = [
    {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        rating: 4.8,
        reviewCount: 12543,
        description: 'The City of Light enchants with its iconic Eiffel Tower, world-class museums, and romantic boulevards.',
        tags: ['Romantic', 'Culture', 'Art', 'Food'],
        coordinates: { lat: 48.8566, lng: 2.3522 }
    },
    {
        id: 'tokyo',
        name: 'Tokyo',
        country: 'Japan',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        rating: 4.9,
        reviewCount: 15782,
        description: 'A mesmerizing blend of ultramodern and traditional, from neon-lit skyscrapers to historic temples.',
        tags: ['Culture', 'Food', 'Shopping', 'Technology'],
        coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    {
        id: 'bali',
        name: 'Bali',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        rating: 4.7,
        reviewCount: 9876,
        description: 'Tropical paradise with stunning beaches, lush rice terraces, and ancient Hindu temples.',
        tags: ['Beach', 'Relaxation', 'Spiritual', 'Nature'],
        coordinates: { lat: -8.3405, lng: 115.092 }
    },
    {
        id: 'new-york',
        name: 'New York City',
        country: 'United States',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
        rating: 4.6,
        reviewCount: 18934,
        description: 'The city that never sleeps offers iconic landmarks, Broadway shows, and endless entertainment.',
        tags: ['City', 'Shopping', 'Entertainment', 'Art'],
        coordinates: { lat: 40.7128, lng: -74.006 }
    },
    {
        id: 'santorini',
        name: 'Santorini',
        country: 'Greece',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80',
        rating: 4.9,
        reviewCount: 7654,
        description: 'Stunning white-washed villages perched on volcanic cliffs with breathtaking Aegean views.',
        tags: ['Romantic', 'Beach', 'Photography', 'Sunset'],
        coordinates: { lat: 36.3932, lng: 25.4615 }
    },
    {
        id: 'dubai',
        name: 'Dubai',
        country: 'United Arab Emirates',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
        rating: 4.5,
        reviewCount: 11234,
        description: 'Futuristic skyline meets traditional souks in this opulent desert metropolis.',
        tags: ['Luxury', 'Shopping', 'Architecture', 'Beach'],
        coordinates: { lat: 25.2048, lng: 55.2708 }
    },
    {
        id: 'maldives',
        name: 'Maldives',
        country: 'Maldives',
        image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
        rating: 4.9,
        reviewCount: 5432,
        description: 'Crystal-clear waters and overwater bungalows create the ultimate tropical escape.',
        tags: ['Beach', 'Luxury', 'Honeymoon', 'Diving'],
        coordinates: { lat: 3.2028, lng: 73.2207 }
    },
    {
        id: 'barcelona',
        name: 'Barcelona',
        country: 'Spain',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
        rating: 4.7,
        reviewCount: 10876,
        description: 'Gaudí\'s masterpieces, vibrant nightlife, and Mediterranean beaches await.',
        tags: ['Architecture', 'Beach', 'Nightlife', 'Food'],
        coordinates: { lat: 41.3851, lng: 2.1734 }
    }
];

export const trendingDestinations: Destination[] = destinations.slice(0, 4);
export const popularDestinations: Destination[] = destinations.slice(4, 8);
