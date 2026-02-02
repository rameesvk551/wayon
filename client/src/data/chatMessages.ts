import type { ChatMessage } from '../types';

export const chatMessages: ChatMessage[] = [
    {
        id: 'msg-1',
        type: 'ai',
        content: "Hello! I'm your AI travel assistant. Where would you like to go on your next adventure?",
        timestamp: '2026-03-10T10:00:00Z',
        suggestions: ['Greek Islands', 'Japan in Spring', 'Italian Coast', 'Tropical Bali']
    },
    {
        id: 'msg-2',
        type: 'user',
        content: "I'm thinking about visiting the Greek Islands. What do you recommend?",
        timestamp: '2026-03-10T10:01:00Z'
    },
    {
        id: 'msg-3',
        type: 'ai',
        content: "Greece is amazing! 🇬🇷 For a memorable Greek island experience, I'd suggest a route that combines history, beaches, and stunning sunsets:\n\n**Athens → Mykonos → Santorini**\n\nThis classic route gives you:\n• 2 days in Athens for ancient history\n• 2 days in Mykonos for vibrant beaches\n• 3 days in Santorini for romantic sunsets",
        timestamp: '2026-03-10T10:01:30Z',
        suggestions: ['Show me the itinerary', 'Add more islands', 'What about costs?', 'Best time to visit?']
    },
    {
        id: 'msg-4',
        type: 'user',
        content: "Show me the itinerary",
        timestamp: '2026-03-10T10:02:00Z'
    },
    {
        id: 'msg-5',
        type: 'ai',
        content: "I've created a 7-day Greek Island Hopping itinerary for you! The route takes you from Athens through Mykonos to Santorini, with carefully selected activities, hotels, and ferry connections.\n\nTotal estimated cost: **€2,450 per person**\n\nYou can see the full day-by-day breakdown on the right panel. Would you like me to adjust anything?",
        timestamp: '2026-03-10T10:02:30Z',
        suggestions: ['Looks perfect!', 'Find cheaper hotels', 'Add a beach day', 'Change dates']
    }
];

export const initialChatMessage: ChatMessage = {
    id: 'msg-0',
    type: 'ai',
    content: "✨ Welcome to your AI Trip Planner! I can help you create the perfect travel itinerary. Tell me about your dream destination, travel dates, or simply ask for inspiration!",
    timestamp: new Date().toISOString(),
    suggestions: ['Plan a Greece trip', 'Explore Japan', 'Beach vacation ideas', 'City break in Europe']
};
