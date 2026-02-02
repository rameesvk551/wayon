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
