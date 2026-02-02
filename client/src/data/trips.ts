import type { Trip } from '../types';

export const trips: Trip[] = [
    {
        id: 'trip-1',
        name: 'Greek Island Hopping',
        destinations: ['Athens', 'Mykonos', 'Santorini'],
        startDate: '2026-03-15',
        endDate: '2026-03-25',
        coverImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        status: 'planned',
        totalDays: 10,
        travelers: 2
    },
    {
        id: 'trip-2',
        name: 'Japan Cherry Blossom',
        destinations: ['Tokyo', 'Kyoto', 'Osaka'],
        startDate: '2026-04-01',
        endDate: '2026-04-12',
        coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        status: 'draft',
        totalDays: 11,
        travelers: 4
    },
    {
        id: 'trip-3',
        name: 'Italian Romance',
        destinations: ['Rome', 'Florence', 'Venice', 'Amalfi'],
        startDate: '2026-05-20',
        endDate: '2026-06-02',
        coverImage: 'https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=800&q=80',
        status: 'planned',
        totalDays: 13,
        travelers: 2
    }
];

export const savedTrips = trips.filter(t => t.status !== 'completed');
export const completedTrips = trips.filter(t => t.status === 'completed');
