import { classifyIntent } from './llm-client.js';

/**
 * Intent types for routing user messages
 */
export type Intent =
    | 'itinerary_generation'
    | 'travel_feasibility'
    | 'visa_check'
    | 'hotel_search'
    | 'flight_search'
    | 'attraction_discovery'
    | 'weather_check'
    | 'transport_search'
    | 'tour_search'
    | 'general_question';

/**
 * Tool mapping for each intent
 */
export const INTENT_TOOL_MAP: Record<Intent, string[]> = {
    itinerary_generation: [
        'search_flights',
        'search_hotels',
        'discover_attractions',
        'get_weather_forecast',
        'check_visa_requirements',
    ],
    travel_feasibility: [
        'check_visa_requirements',
        'search_flights',
        'get_weather_forecast',
    ],
    visa_check: ['check_visa_requirements'],
    hotel_search: ['search_hotels'],
    flight_search: ['search_flights'],
    attraction_discovery: ['discover_attractions', 'search_tours'],
    weather_check: ['get_weather_forecast'],
    transport_search: ['find_local_transport'],
    tour_search: ['search_tours'],
    general_question: [],
};

/**
 * Whether intent requires RAG for regulations
 */
export const INTENT_REQUIRES_RAG: Record<Intent, boolean> = {
    itinerary_generation: true,
    travel_feasibility: true,
    visa_check: true,
    hotel_search: false,
    flight_search: false,
    attraction_discovery: false,
    weather_check: false,
    transport_search: false,
    tour_search: false,
    general_question: false,
};

/**
 * Route user message to appropriate intent
 */
export async function routeIntent(message: string): Promise<{
    intent: Intent;
    tools: string[];
    requiresRag: boolean;
}> {
    const intent = (await classifyIntent(message)) as Intent;

    return {
        intent,
        tools: INTENT_TOOL_MAP[intent] || [],
        requiresRag: INTENT_REQUIRES_RAG[intent] || false,
    };
}

/**
 * Extract entities from user message for tool parameters
 * Uses simple pattern matching for common travel entities
 */
export function extractEntities(message: string): {
    destinations: string[];
    dates: string[];
    travelers: number | null;
    budget: string | null;
} {
    const lowercaseMsg = message.toLowerCase();

    // Extract destinations (simple pattern - countries/cities after "to" or "in")
    const destinationPatterns = [
        /(?:to|in|visit|explore)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/gi,
    ];
    const destinations: string[] = [];
    for (const pattern of destinationPatterns) {
        const matches = message.matchAll(pattern);
        for (const match of matches) {
            if (match[1]) destinations.push(match[1].trim());
        }
    }

    // Extract dates (simple patterns)
    const datePatterns = [
        /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/g,
        /(tomorrow|next week|next month|this weekend)/gi,
        /(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{0,2}/gi,
    ];
    const dates: string[] = [];
    for (const pattern of datePatterns) {
        const matches = message.matchAll(pattern);
        for (const match of matches) {
            dates.push(match[0].trim());
        }
    }

    // Extract number of travelers
    const travelerMatch = lowercaseMsg.match(/(\d+)\s*(?:people|person|travelers?|guests?|adults?)/);
    const travelers = travelerMatch ? parseInt(travelerMatch[1], 10) : null;

    // Extract budget
    const budgetMatch = lowercaseMsg.match(/(?:budget|spend|cost).*?(\$[\d,]+|\d+k?)/i);
    const budget = budgetMatch ? budgetMatch[1] : null;

    return { destinations, dates, travelers, budget };
}
