import type { UIResponse } from '../types/ui-schema';

/**
 * Mock AI responses in schema format.
 * These demonstrate various block combinations for different scenarios.
 */

export const mockTripPlanResponse: UIResponse = {
    blocks: [
        {
            type: 'title',
            text: 'Your Thailand Adventure',
            level: 1
        },
        {
            type: 'text',
            content: "I've crafted a **7-day itinerary** exploring Thailand's best destinations - from the vibrant streets of Bangkok to the pristine beaches of Phuket.",
            format: 'markdown'
        },
        {
            type: 'alert',
            level: 'info',
            text: 'Best time to visit: November to February for pleasant weather.',
            title: 'Travel Tip'
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'card',
            title: 'Flight to Bangkok',
            subtitle: 'Direct flight from Delhi to Bangkok',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
            meta: [
                { label: 'Airline', value: 'Thai Airways' },
                { label: 'Duration', value: '4h 30m' },
                { label: 'Price', value: '₹21,000' }
            ],
            badge: 'Best Value',
            badgeVariant: 'success'
        },
        {
            type: 'card',
            title: 'Chatrium Hotel Riverside',
            subtitle: '5-star luxury on the Chao Phraya River',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
            meta: [
                { label: 'Location', value: 'Riverside, Bangkok' },
                { label: 'Rating', value: '4.8 ★' },
                { label: 'Price', value: '₹8,500/night' }
            ]
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'title',
            text: 'Daily Itinerary',
            level: 2
        },
        {
            type: 'timeline',
            items: [
                {
                    id: 'day-1',
                    title: 'Day 1: Arrive in Bangkok',
                    subtitle: 'Check-in & Evening Temple Tour',
                    time: 'Mar 15',
                    description: 'Arrive at Suvarnabhumi Airport, transfer to hotel, and explore Wat Arun at sunset.',
                    status: 'upcoming',
                    meta: [
                        { label: 'Highlights', value: 'Wat Arun, River Cruise' }
                    ]
                },
                {
                    id: 'day-2',
                    title: 'Day 2: Grand Palace & Markets',
                    subtitle: 'Cultural Immersion Day',
                    time: 'Mar 16',
                    description: 'Visit the Grand Palace, Wat Pho, and explore Chatuchak Weekend Market.',
                    status: 'upcoming'
                },
                {
                    id: 'day-3',
                    title: 'Day 3: Fly to Phuket',
                    subtitle: 'Beach Paradise Awaits',
                    time: 'Mar 17',
                    description: 'Morning flight to Phuket, afternoon at Patong Beach.',
                    status: 'upcoming',
                    meta: [
                        { label: 'Flight', value: '1h 20m' }
                    ]
                }
            ]
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'map',
            markers: [
                { id: 'bkk', label: 'Bangkok', lat: 13.7563, lng: 100.5018, type: 'start' },
                { id: 'phuket', label: 'Phuket', lat: 7.8804, lng: 98.3923, type: 'waypoint' },
                { id: 'krabi', label: 'Krabi', lat: 8.0863, lng: 98.9063, type: 'end' }
            ],
            routes: [
                { from: 'bkk', to: 'phuket', type: 'dashed' },
                { from: 'phuket', to: 'krabi', type: 'dashed' }
            ]
        },
        {
            type: 'alert',
            level: 'warning',
            text: 'Visa-on-arrival requires passport validity of 6+ months.',
            dismissible: true
        },
        {
            type: 'divider',
            spacing: 'lg'
        },
        {
            type: 'actions',
            items: [
                { id: 'book', label: 'Book This Trip', variant: 'primary' },
                { id: 'modify', label: 'Modify Itinerary', variant: 'secondary' },
                { id: 'share', label: 'Share', variant: 'ghost' }
            ],
            layout: 'horizontal'
        }
    ]
};

export const mockFlightSearchResponse: UIResponse = {
    blocks: [
        {
            type: 'title',
            text: 'Available Flights',
            level: 1
        },
        {
            type: 'text',
            content: 'Found **12 flights** from Delhi to Bangkok on March 15, 2026.',
            format: 'markdown'
        },
        {
            type: 'card',
            title: 'Thai Airways TG316',
            subtitle: 'Non-stop · Boeing 787 Dreamliner',
            image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400',
            meta: [
                { label: 'Departure', value: '10:30 AM' },
                { label: 'Arrival', value: '4:00 PM' },
                { label: 'Duration', value: '4h 30m' }
            ],
            badge: '₹18,500',
            badgeVariant: 'primary',
            actions: [
                { id: 'select-1', label: 'Select', variant: 'primary' }
            ]
        },
        {
            type: 'card',
            title: 'IndiGo 6E-1234',
            subtitle: 'Non-stop · Airbus A320neo',
            meta: [
                { label: 'Departure', value: '6:15 AM' },
                { label: 'Arrival', value: '11:45 AM' },
                { label: 'Duration', value: '4h 30m' }
            ],
            badge: '₹12,200',
            badgeVariant: 'success',
            actions: [
                { id: 'select-2', label: 'Select', variant: 'primary' }
            ]
        },
        {
            type: 'card',
            title: 'Air India AI332',
            subtitle: '1 Stop via Mumbai · Boeing 777',
            meta: [
                { label: 'Departure', value: '2:45 PM' },
                { label: 'Arrival', value: '10:30 PM' },
                { label: 'Duration', value: '6h 45m' }
            ],
            badge: '₹14,800',
            badgeVariant: 'default',
            actions: [
                { id: 'select-3', label: 'Select', variant: 'secondary' }
            ]
        },
        {
            type: 'actions',
            items: [
                { id: 'filter', label: 'Filter Results', variant: 'secondary' },
                { id: 'sort', label: 'Sort by Price', variant: 'ghost' }
            ],
            layout: 'horizontal'
        }
    ]
};

export const mockDestinationGuideResponse: UIResponse = {
    blocks: [
        {
            type: 'image',
            src: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
            alt: 'Santorini, Greece',
            caption: 'Oia village at sunset, Santorini',
            layout: 'full'
        },
        {
            type: 'title',
            text: 'Santorini Travel Guide',
            level: 1
        },
        {
            type: 'text',
            content: 'Santorini is a **volcanic island** in the Cyclades group of the Greek islands. Famous for its dramatic views, stunning sunsets, and unique architecture with whitewashed buildings and blue domes.',
            format: 'markdown'
        },
        {
            type: 'alert',
            level: 'success',
            text: 'Peak season: June to September. Best for couples and photographers!',
            title: 'Best Time to Visit'
        },
        {
            type: 'title',
            text: 'Top Attractions',
            level: 2
        },
        {
            type: 'list',
            items: [
                { id: '1', text: 'Oia Village - Famous for sunset views and blue domes' },
                { id: '2', text: 'Fira Town - Capital with museums and nightlife' },
                { id: '3', text: 'Red Beach - Unique volcanic red sand beach' },
                { id: '4', text: 'Akrotiri - Ancient Minoan ruins preserved by volcanic ash' },
                { id: '5', text: 'Wine Tasting - Sample Assyrtiko wines from volcanic vineyards' }
            ],
            ordered: true
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'title',
            text: 'Estimated Budget',
            level: 2
        },
        {
            type: 'list',
            items: [
                {
                    id: 'budget-1',
                    text: 'Accommodation: €150-400/night',
                    subItems: [
                        { id: 'sub-1', text: 'Cave hotels in Oia: €300+' },
                        { id: 'sub-2', text: 'Budget stays in Fira: €80-150' }
                    ]
                },
                { id: 'budget-2', text: 'Food: €40-80/day' },
                { id: 'budget-3', text: 'Activities: €50-100/day' },
                { id: 'budget-4', text: 'Ferry from Athens: €40-60' }
            ],
            ordered: false
        },
        {
            type: 'actions',
            items: [
                { id: 'plan', label: 'Plan a Trip Here', variant: 'highlight' },
                { id: 'save', label: 'Save to Wishlist', variant: 'secondary' }
            ],
            layout: 'horizontal'
        }
    ]
};

export const mockWelcomeResponse: UIResponse = {
    blocks: [
        {
            type: 'title',
            text: 'Welcome to AI Trip Planner',
            level: 1
        },
        {
            type: 'text',
            content: "I'm your intelligent travel assistant. Tell me about your dream destination, travel dates, or simply ask for inspiration!",
            format: 'plain'
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'title',
            text: 'What can I help you with?',
            level: 3
        },
        {
            type: 'list',
            items: [
                { id: '1', text: 'Plan a complete trip itinerary' },
                { id: '2', text: 'Find flights and hotels' },
                { id: '3', text: 'Get destination recommendations' },
                { id: '4', text: 'Check visa requirements' },
                { id: '5', text: 'Discover local experiences' }
            ],
            ordered: false
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'actions',
            items: [
                { id: 'greece', label: 'Plan a Greece trip', variant: 'secondary' },
                { id: 'japan', label: 'Explore Japan', variant: 'secondary' },
                { id: 'beach', label: 'Beach vacation ideas', variant: 'secondary' },
                { id: 'europe', label: 'City break in Europe', variant: 'secondary' }
            ],
            layout: 'wrap'
        }
    ]
};

// Collection of all mock responses for easy access
export const mockResponses = {
    welcome: mockWelcomeResponse,
    tripPlan: mockTripPlanResponse,
    flightSearch: mockFlightSearchResponse,
    destinationGuide: mockDestinationGuideResponse
};

// New premium mock responses demonstrating new blocks
export const mockHotelResponse: UIResponse = {
    blocks: [
        {
            type: 'text',
            content: "✨ I found some amazing hotels in Paris based on your preferences! Here are my top picks:",
            format: 'markdown'
        },
        {
            type: 'hotel_carousel',
            title: 'Recommended Hotels in Paris',
            hotels: [
                {
                    id: 'hotel-1',
                    name: 'Le Meurice',
                    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
                    rating: 4.9,
                    reviewCount: 2847,
                    price: '€450',
                    originalPrice: '€520',
                    location: 'Jardin des Tuileries, Paris',
                    amenities: ['WiFi', 'Breakfast', 'Spa'],
                    badge: 'Luxury Pick',
                    badgeType: 'luxury'
                },
                {
                    id: 'hotel-2',
                    name: 'Hôtel Plaza Athénée',
                    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
                    rating: 4.8,
                    reviewCount: 1923,
                    price: '€380',
                    location: 'Avenue Montaigne, Paris',
                    amenities: ['WiFi', 'Pool', 'Restaurant'],
                    badge: 'Best Value',
                    badgeType: 'best_value'
                },
                {
                    id: 'hotel-3',
                    name: 'Hôtel de Crillon',
                    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600',
                    rating: 4.7,
                    reviewCount: 1456,
                    price: '€290',
                    location: 'Place de la Concorde, Paris',
                    amenities: ['WiFi', 'Gym', 'Bar'],
                    badge: 'Popular',
                    badgeType: 'popular'
                }
            ]
        },
        {
            type: 'alert',
            level: 'info',
            text: 'Prices shown are per night. Book early for the best rates!',
            dismissible: true
        }
    ]
};

export const mockWeatherResponse: UIResponse = {
    blocks: [
        {
            type: 'text',
            content: "Here's the current weather for your destination! 🌤️",
            format: 'markdown'
        },
        {
            type: 'weather',
            location: 'Bali, Indonesia',
            temperature: 28,
            condition: 'partly_cloudy',
            humidity: 75,
            wind: '12 km/h',
            uvIndex: 'High',
            feelsLike: 32
        },
        {
            type: 'alert',
            level: 'warning',
            title: 'Pack accordingly!',
            text: 'Expect some tropical showers in the afternoon. Bring a light rain jacket.',
            dismissible: true
        }
    ]
};

export const mockFullTripResponse: UIResponse = {
    blocks: [
        {
            type: 'title',
            text: '🌸 Your 5-Day Tokyo Adventure',
            level: 1
        },
        {
            type: 'text',
            content: "I've crafted the perfect itinerary for your Japan trip! Here's everything you need to know.",
            format: 'plain'
        },
        {
            type: 'weather',
            location: 'Tokyo, Japan',
            temperature: 18,
            condition: 'sunny',
            humidity: 55,
            wind: '8 km/h',
            uvIndex: 'Medium',
            feelsLike: 20
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'hotel_carousel',
            title: 'Where to Stay',
            hotels: [
                {
                    id: 'tokyo-1',
                    name: 'Park Hyatt Tokyo',
                    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
                    rating: 4.9,
                    reviewCount: 3241,
                    price: '¥45,000',
                    location: 'Shinjuku, Tokyo',
                    amenities: ['WiFi', 'Pool', 'Spa'],
                    badge: 'Top Choice',
                    badgeType: 'luxury'
                },
                {
                    id: 'tokyo-2',
                    name: 'Aman Tokyo',
                    image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600',
                    rating: 4.8,
                    reviewCount: 1876,
                    price: '¥38,000',
                    location: 'Otemachi, Tokyo',
                    amenities: ['WiFi', 'Restaurant', 'Concierge'],
                    badge: 'Great Views',
                    badgeType: 'popular'
                }
            ]
        },
        {
            type: 'divider',
            spacing: 'md'
        },
        {
            type: 'timeline',
            title: 'Daily Itinerary',
            items: [
                {
                    id: 'day-1',
                    title: 'Day 1: Arrival & Shibuya',
                    subtitle: 'Welcome to Tokyo!',
                    time: 'Day 1',
                    description: 'Arrive at Narita Airport, take the Narita Express to Shinjuku. Explore Shibuya Crossing and Harajuku in the evening.',
                    status: 'upcoming' as const,
                    meta: [
                        { label: 'Transport', value: 'Narita Express' },
                        { label: 'Duration', value: '90 min to city' }
                    ]
                },
                {
                    id: 'day-2',
                    title: 'Day 2: Traditional Tokyo',
                    subtitle: 'Temples & Gardens',
                    time: 'Day 2',
                    description: 'Visit Senso-ji Temple in Asakusa, explore Ueno Park, and enjoy a traditional tea ceremony.',
                    status: 'upcoming' as const
                },
                {
                    id: 'day-3',
                    title: 'Day 3: Day Trip to Mt. Fuji',
                    subtitle: 'Iconic views await',
                    time: 'Day 3',
                    description: 'Take the Shinkansen to Kawaguchiko for stunning views of Mt. Fuji and the Five Lakes region.',
                    status: 'upcoming' as const
                }
            ]
        },
        {
            type: 'actions',
            items: [
                { id: 'book', label: 'Book This Trip', variant: 'primary' },
                { id: 'modify', label: 'Customize', variant: 'secondary' },
                { id: 'share', label: 'Share', variant: 'ghost' }
            ],
            layout: 'horizontal'
        }
    ]
};

export const mockFlightCarouselResponse: UIResponse = {
    blocks: [
        {
            type: 'text',
            content: "✈️ I found great flight options for your trip! Here are the best deals:",
            format: 'markdown'
        },
        {
            type: 'flight_carousel',
            title: 'Flights: Delhi → Bangkok',
            flights: [
                {
                    id: 'flight-1',
                    airline: 'Emirates',
                    flightNumber: 'EK-512',
                    departure: '10:30 AM',
                    arrival: '4:00 PM',
                    departureAirport: 'DEL',
                    arrivalAirport: 'BKK',
                    departureCity: 'Delhi',
                    arrivalCity: 'Bangkok',
                    duration: '5h 30m',
                    price: '$450',
                    stops: 0,
                    gate: 'A12',
                    seat: '24A'
                },
                {
                    id: 'flight-2',
                    airline: 'Qatar Airways',
                    flightNumber: 'QR-556',
                    departure: '2:15 PM',
                    arrival: '8:45 PM',
                    departureAirport: 'DEL',
                    arrivalAirport: 'BKK',
                    departureCity: 'Delhi',
                    arrivalCity: 'Bangkok',
                    duration: '6h 30m',
                    price: '$380',
                    stops: 1,
                    gate: 'B7',
                    seat: '15C'
                },
                {
                    id: 'flight-3',
                    airline: 'Singapore Airlines',
                    flightNumber: 'SQ-421',
                    departure: '11:45 PM',
                    arrival: '7:15 AM',
                    departureAirport: 'DEL',
                    arrivalAirport: 'BKK',
                    departureCity: 'Delhi',
                    arrivalCity: 'Bangkok',
                    duration: '7h 30m',
                    price: '$520',
                    stops: 0,
                    gate: 'C3',
                    seat: '8F'
                },
                {
                    id: 'flight-4',
                    airline: 'Air India',
                    flightNumber: 'AI-302',
                    departure: '6:00 AM',
                    arrival: '2:30 PM',
                    departureAirport: 'DEL',
                    arrivalAirport: 'BKK',
                    departureCity: 'Delhi',
                    arrivalCity: 'Bangkok',
                    duration: '8h 30m',
                    price: '$280',
                    stops: 2,
                    gate: 'D9',
                    seat: '32B'
                },
                {
                    id: 'flight-5',
                    airline: 'IndiGo',
                    flightNumber: '6E-1234',
                    departure: '8:15 AM',
                    arrival: '12:45 PM',
                    departureAirport: 'DEL',
                    arrivalAirport: 'BKK',
                    departureCity: 'Delhi',
                    arrivalCity: 'Bangkok',
                    duration: '4h 30m',
                    price: '$220',
                    stops: 0,
                    gate: 'E5',
                    seat: '19D'
                }
            ]
        },
        {
            type: 'alert',
            level: 'info',
            text: 'Prices shown are per person. Baggage fees may apply.',
            dismissible: true
        },
        {
            type: 'actions',
            items: [
                { id: 'filter', label: 'Filter Results', variant: 'secondary' },
                { id: 'sort-price', label: 'Sort by Price', variant: 'ghost' },
                { id: 'sort-duration', label: 'Sort by Duration', variant: 'ghost' }
            ],
            layout: 'horizontal'
        }
    ]
};
