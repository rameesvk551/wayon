import type { DayItinerary, Itinerary } from '../types';

export const greekItineraryDays: DayItinerary[] = [
    {
        id: 'day-1',
        dayNumber: 1,
        date: '2026-03-15',
        city: 'Athens',
        cityImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
        activities: [
            {
                id: 'act-1-1',
                name: 'Acropolis Visit',
                description: 'Explore the ancient citadel and the Parthenon temple',
                image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=400&q=80',
                duration: '3 hours',
                price: 20,
                startTime: '09:00',
                endTime: '12:00',
                location: 'Acropolis Hill',
                category: 'sightseeing'
            },
            {
                id: 'act-1-2',
                name: 'Plaka District Walk',
                description: 'Wander through the charming old neighborhood',
                image: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=400&q=80',
                duration: '2 hours',
                startTime: '14:00',
                endTime: '16:00',
                location: 'Plaka',
                category: 'culture'
            },
            {
                id: 'act-1-3',
                name: 'Greek Dinner Experience',
                description: 'Traditional Greek cuisine with live music',
                image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
                duration: '2 hours',
                price: 45,
                startTime: '19:00',
                endTime: '21:00',
                location: 'Monastiraki',
                category: 'food'
            }
        ],
        hotel: {
            id: 'hotel-1',
            name: 'Hotel Grande Bretagne',
            city: 'Athens',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
            rating: 5,
            pricePerNight: 350,
            amenities: ['Pool', 'Spa', 'Restaurant', 'Rooftop Bar'],
            checkIn: '15:00',
            checkOut: '11:00'
        }
    },
    {
        id: 'day-2',
        dayNumber: 2,
        date: '2026-03-16',
        city: 'Athens',
        cityImage: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
        activities: [
            {
                id: 'act-2-1',
                name: 'National Archaeological Museum',
                description: 'Discover ancient Greek artifacts and treasures',
                image: 'https://images.unsplash.com/photo-1560472354-1f0a4b5b9d00?w=400&q=80',
                duration: '3 hours',
                price: 15,
                startTime: '10:00',
                endTime: '13:00',
                location: 'Exarcheia',
                category: 'culture'
            },
            {
                id: 'act-2-2',
                name: 'Temple of Poseidon Sunset',
                description: 'Watch the sunset at Cape Sounion',
                image: 'https://images.unsplash.com/photo-1530841377377-3ff06c0ca713?w=400&q=80',
                duration: '4 hours',
                price: 30,
                startTime: '16:00',
                endTime: '20:00',
                location: 'Cape Sounion',
                category: 'sightseeing'
            }
        ],
        hotel: {
            id: 'hotel-1',
            name: 'Hotel Grande Bretagne',
            city: 'Athens',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
            rating: 5,
            pricePerNight: 350,
            amenities: ['Pool', 'Spa', 'Restaurant', 'Rooftop Bar'],
            checkIn: '15:00',
            checkOut: '11:00'
        }
    },
    {
        id: 'day-3',
        dayNumber: 3,
        date: '2026-03-17',
        city: 'Mykonos',
        cityImage: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&q=80',
        activities: [
            {
                id: 'act-3-1',
                name: 'Little Venice',
                description: 'Explore the iconic waterfront neighborhood',
                image: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=400&q=80',
                duration: '2 hours',
                startTime: '11:00',
                endTime: '13:00',
                location: 'Little Venice',
                category: 'sightseeing'
            },
            {
                id: 'act-3-2',
                name: 'Beach Day at Paradise Beach',
                description: 'Relax at one of the most famous beaches',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
                duration: '4 hours',
                startTime: '14:00',
                endTime: '18:00',
                location: 'Paradise Beach',
                category: 'relaxation'
            }
        ],
        transport: {
            id: 'trans-1',
            type: 'ferry',
            from: 'Athens (Piraeus)',
            to: 'Mykonos',
            departureTime: '07:30',
            arrivalTime: '10:30',
            duration: '3h',
            price: 45,
            carrier: 'Blue Star Ferries'
        },
        hotel: {
            id: 'hotel-2',
            name: 'Myconian Collection',
            city: 'Mykonos',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
            rating: 5,
            pricePerNight: 480,
            amenities: ['Infinity Pool', 'Spa', 'Private Beach', 'Restaurant'],
            checkIn: '14:00',
            checkOut: '12:00'
        }
    },
    {
        id: 'day-4',
        dayNumber: 4,
        date: '2026-03-18',
        city: 'Mykonos',
        cityImage: 'https://images.unsplash.com/photo-1601581875039-e899893d520c?w=800&q=80',
        activities: [
            {
                id: 'act-4-1',
                name: 'Delos Island Day Trip',
                description: 'Visit the sacred archaeological island',
                image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?w=400&q=80',
                duration: '6 hours',
                price: 55,
                startTime: '09:00',
                endTime: '15:00',
                location: 'Delos Island',
                category: 'culture'
            },
            {
                id: 'act-4-2',
                name: 'Windmills Sunset',
                description: 'Watch sunset from the famous windmills',
                image: 'https://images.unsplash.com/photo-1602679536100-cd7c9f4b1ac6?w=400&q=80',
                duration: '1.5 hours',
                startTime: '18:30',
                endTime: '20:00',
                location: 'Mykonos Windmills',
                category: 'sightseeing'
            }
        ],
        hotel: {
            id: 'hotel-2',
            name: 'Myconian Collection',
            city: 'Mykonos',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
            rating: 5,
            pricePerNight: 480,
            amenities: ['Infinity Pool', 'Spa', 'Private Beach', 'Restaurant'],
            checkIn: '14:00',
            checkOut: '12:00'
        }
    },
    {
        id: 'day-5',
        dayNumber: 5,
        date: '2026-03-19',
        city: 'Santorini',
        cityImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        activities: [
            {
                id: 'act-5-1',
                name: 'Oia Village Exploration',
                description: 'Wander through the iconic blue-domed village',
                image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
                duration: '3 hours',
                startTime: '12:00',
                endTime: '15:00',
                location: 'Oia',
                category: 'sightseeing'
            },
            {
                id: 'act-5-2',
                name: 'Wine Tasting Experience',
                description: 'Sample local Santorini wines',
                image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
                duration: '2 hours',
                price: 65,
                startTime: '16:00',
                endTime: '18:00',
                location: 'Santo Wines',
                category: 'food'
            }
        ],
        transport: {
            id: 'trans-2',
            type: 'ferry',
            from: 'Mykonos',
            to: 'Santorini',
            departureTime: '08:00',
            arrivalTime: '10:30',
            duration: '2h 30m',
            price: 55,
            carrier: 'SeaJets'
        },
        hotel: {
            id: 'hotel-3',
            name: 'Canaves Oia Suites',
            city: 'Santorini',
            image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400&q=80',
            rating: 5,
            pricePerNight: 650,
            amenities: ['Private Pool', 'Caldera View', 'Spa', 'Fine Dining'],
            checkIn: '15:00',
            checkOut: '11:00'
        }
    },
    {
        id: 'day-6',
        dayNumber: 6,
        date: '2026-03-20',
        city: 'Santorini',
        cityImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        activities: [
            {
                id: 'act-6-1',
                name: 'Volcano & Hot Springs Tour',
                description: 'Boat trip to the active volcano caldera',
                image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&q=80',
                duration: '5 hours',
                price: 45,
                startTime: '10:00',
                endTime: '15:00',
                location: 'Nea Kameni',
                category: 'adventure'
            },
            {
                id: 'act-6-2',
                name: 'Fira to Oia Hike',
                description: 'Scenic clifftop walk between villages',
                image: 'https://images.unsplash.com/photo-1604999565976-8913ad2dfa76?w=400&q=80',
                duration: '3 hours',
                startTime: '16:00',
                endTime: '19:00',
                location: 'Fira - Oia Trail',
                category: 'adventure'
            }
        ],
        hotel: {
            id: 'hotel-3',
            name: 'Canaves Oia Suites',
            city: 'Santorini',
            image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400&q=80',
            rating: 5,
            pricePerNight: 650,
            amenities: ['Private Pool', 'Caldera View', 'Spa', 'Fine Dining'],
            checkIn: '15:00',
            checkOut: '11:00'
        }
    },
    {
        id: 'day-7',
        dayNumber: 7,
        date: '2026-03-21',
        city: 'Santorini',
        cityImage: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        activities: [
            {
                id: 'act-7-1',
                name: 'Red Beach Visit',
                description: 'Unique volcanic red sand beach',
                image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400&q=80',
                duration: '3 hours',
                startTime: '10:00',
                endTime: '13:00',
                location: 'Red Beach',
                category: 'relaxation'
            },
            {
                id: 'act-7-2',
                name: 'Ancient Akrotiri',
                description: 'Explore the Pompeii of the Aegean',
                image: 'https://images.unsplash.com/photo-1564594736624-def7a10ab047?w=400&q=80',
                duration: '2 hours',
                price: 12,
                startTime: '14:30',
                endTime: '16:30',
                location: 'Akrotiri',
                category: 'culture'
            },
            {
                id: 'act-7-3',
                name: 'Sunset Sailing Cruise',
                description: 'Catamaran cruise around the caldera',
                image: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?w=400&q=80',
                duration: '5 hours',
                price: 150,
                startTime: '17:00',
                endTime: '22:00',
                location: 'Ammoudi Bay',
                category: 'adventure'
            }
        ],
        hotel: {
            id: 'hotel-3',
            name: 'Canaves Oia Suites',
            city: 'Santorini',
            image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=400&q=80',
            rating: 5,
            pricePerNight: 650,
            amenities: ['Private Pool', 'Caldera View', 'Spa', 'Fine Dining'],
            checkIn: '15:00',
            checkOut: '11:00'
        }
    }
];

export const greekItinerary: Itinerary = {
    id: 'itin-1',
    tripId: 'trip-1',
    name: 'Greek Island Hopping Adventure',
    days: greekItineraryDays
};

export const allItineraries: Itinerary[] = [greekItinerary];
