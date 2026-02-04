import { Request, Response } from 'express';
import { z } from 'zod';
import { routeIntent, extractEntities } from '../ai/intent-router.js';
import { generateWithTools, continueWithToolResults, generateText } from '../ai/llm-client.js';
import { SYSTEM_PROMPT, RAG_CONTEXT_PROMPT } from '../ai/system-prompt.js';
import {
    validateUIResponse,
    parseJSONFromLLM,
    autoFixResponse,
    createErrorResponse,
} from '../ai/schema-enforcer.js';
import { composeResponse } from '../ai/response-composer.js';
import { toolRegistry } from '../tools/index.js';
import { getRegulationsContext } from '../rag/retriever.js';
import { getConversation, addMessage, getHistory } from '../memory/conversation.js';
import type { UIResponse } from '../schema/ui-schema.zod.js';
import type { ToolResult } from '../tools/types.js';

// ============================================
// DEMO MODE - Set to true to bypass AI calls
// ============================================
const DEMO_MODE = true;

// Mock responses for demo mode - using valid UI schema block types
const MOCK_RESPONSES: Record<string, UIResponse> = {
    default: {
        blocks: [
            {
                type: 'text',
                content: "👋 Hello! I'm your AI travel assistant. I can help you plan trips, find hotels, check visas, discover tours, and more!\n\n**Try asking me:**\n- Plan a trip to Paris\n- Find hotels in Tokyo\n- Show tours in Rome\n- What's the weather in Bali?\n- Do I need a visa for Thailand?",
                format: 'markdown',
            },
        ],
    },
    trip: {
        blocks: [
            {
                type: 'title',
                text: '🌍 Your Paris Trip Itinerary',
                level: 1,
            },
            {
                type: 'text',
                content: "I've put together an amazing 5-day itinerary for Paris based on your preferences.",
                format: 'markdown',
            },
            {
                type: 'timeline',
                title: 'Day 1: Arrival & Eiffel Tower',
                items: [
                    { id: '1', title: 'Arrive at Charles de Gaulle Airport', time: '09:00', icon: '✈️', status: 'upcoming' },
                    { id: '2', title: 'Check into Hotel Le Marais', time: '12:00', icon: '🏨', status: 'upcoming' },
                    { id: '3', title: 'Visit Eiffel Tower', time: '15:00', icon: '🗼', status: 'upcoming' },
                    { id: '4', title: 'Dinner at Café de Flore', time: '19:00', icon: '🍽️', status: 'upcoming' },
                ],
            },
            {
                type: 'timeline',
                title: 'Day 2: Louvre & Seine River',
                items: [
                    { id: '5', title: 'Breakfast at hotel', time: '09:00', icon: '☕', status: 'upcoming' },
                    { id: '6', title: 'Louvre Museum (3-4 hours)', time: '10:00', icon: '🎨', status: 'upcoming' },
                    { id: '7', title: 'Seine River Cruise', time: '15:00', icon: '🚢', status: 'upcoming' },
                    { id: '8', title: 'Explore Latin Quarter', time: '18:00', icon: '🚶', status: 'upcoming' },
                ],
            },
            {
                type: 'card',
                title: 'Hotel Le Marais',
                subtitle: 'Le Marais, Paris • ⭐ 4.5',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
                meta: [
                    { label: 'Price', value: '€180/night' },
                    { label: 'Amenities', value: 'WiFi, Breakfast, City View' },
                ],
                badge: 'Recommended',
                badgeVariant: 'primary',
            },
        ],
    },
    hotel: {
        blocks: [
            {
                type: 'title',
                text: '🏨 Hotels in Paris',
                level: 1,
            },
            {
                type: 'text',
                content: 'Found **3 great hotels** based on your preferences:',
                format: 'markdown',
            },
            {
                type: 'card',
                title: 'The Ritz Paris',
                subtitle: 'Place Vendôme • ⭐⭐⭐⭐⭐',
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400',
                meta: [
                    { label: 'Price', value: '€950/night' },
                    { label: 'Amenities', value: 'Spa, Pool, Fine Dining' },
                ],
                badge: 'Luxury',
                badgeVariant: 'primary',
                actions: [{ id: 'book-ritz', label: 'Book Now', variant: 'primary' }],
            },
            {
                type: 'card',
                title: 'Hotel Le Marais Boutique',
                subtitle: 'Le Marais District • ⭐⭐⭐⭐½',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
                meta: [
                    { label: 'Price', value: '€220/night' },
                    { label: 'Amenities', value: 'WiFi, Breakfast, Rooftop Bar' },
                ],
                badge: 'Best Value',
                badgeVariant: 'success',
                actions: [{ id: 'book-marais', label: 'Book Now', variant: 'primary' }],
            },
            {
                type: 'card',
                title: 'Ibis Styles Paris',
                subtitle: 'Near Gare du Nord • ⭐⭐⭐½',
                image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=400',
                meta: [
                    { label: 'Price', value: '€89/night' },
                    { label: 'Amenities', value: 'WiFi, Metro Access' },
                ],
                badge: 'Budget',
                badgeVariant: 'default',
                actions: [{ id: 'book-ibis', label: 'Book Now', variant: 'secondary' }],
            },
        ],
    },
    weather: {
        blocks: [
            {
                type: 'title',
                text: '☀️ Weather in Bali',
                level: 1,
            },
            {
                type: 'card',
                title: '28°C - Partly Cloudy',
                subtitle: 'Bali, Indonesia',
                meta: [
                    { label: 'Humidity', value: '75%', icon: '💧' },
                    { label: 'Wind', value: '12 km/h', icon: '💨' },
                    { label: 'UV Index', value: 'High', icon: '☀️' },
                ],
            },
            {
                type: 'text',
                content: '### 5-Day Forecast\n\n| Day | High | Low | Condition |\n|-----|------|-----|-----------|\n| Today | 30°C | 24°C | ☀️ Sunny |\n| Tomorrow | 29°C | 23°C | ⛅ Partly Cloudy |\n| Wed | 28°C | 24°C | 🌧️ Rain |\n| Thu | 31°C | 25°C | ☀️ Sunny |\n| Fri | 30°C | 24°C | ☀️ Sunny |',
                format: 'markdown',
            },
            {
                type: 'alert',
                level: 'info',
                title: 'Packing Tips',
                text: 'Pack light clothes, sunscreen, and a light rain jacket for occasional showers.',
            },
        ],
    },
    visa: {
        blocks: [
            {
                type: 'alert',
                level: 'success',
                title: 'Visa on Arrival Available!',
                text: 'Good news! Indian passport holders can get Visa on Arrival (VOA) for Thailand.',
            },
            {
                type: 'title',
                text: '🛂 Thailand Visa Requirements',
                level: 2,
            },
            {
                type: 'card',
                title: 'Visa on Arrival (VOA)',
                subtitle: 'Quick entry for tourism',
                meta: [
                    { label: 'Duration', value: '15 days' },
                    { label: 'Cost', value: '2,000 THB (~₹4,700)' },
                    { label: 'Processing', value: 'At airport' },
                ],
            },
            {
                type: 'list',
                ordered: false,
                items: [
                    { id: 'r1', text: 'Passport valid 6+ months', icon: '✓' },
                    { id: 'r2', text: 'Return ticket within 15 days', icon: '✓' },
                    { id: 'r3', text: 'Proof of accommodation', icon: '✓' },
                    { id: 'r4', text: '10,000 THB cash per person', icon: '✓' },
                ],
            },
            {
                type: 'alert',
                level: 'warning',
                title: 'Peak Season Alert',
                text: 'Wait times can be 1-2 hours during peak season. Consider applying for e-Visa in advance!',
            },
        ],
    },
    flight: {
        blocks: [
            {
                type: 'text',
                content: '✈️ Found **2 flights** from New Delhi to Paris:',
                format: 'markdown',
            },
            {
                type: 'flight_carousel',
                title: 'Flights: New Delhi → Paris',
                flights: [
                    {
                        id: 'flight-1',
                        airline: 'Air France',
                        flightNumber: 'AF 226',
                        departure: '11:45 PM',
                        arrival: '05:30 AM',
                        departureAirport: 'DEL',
                        arrivalAirport: 'CDG',
                        departureCity: 'New Delhi',
                        arrivalCity: 'Paris',
                        duration: '8h 45m',
                        price: '₹45,000',
                        stops: 0,
                        gate: 'A12',
                        seat: '24A',
                    },
                    {
                        id: 'flight-2',
                        airline: 'Emirates',
                        flightNumber: 'EK 511',
                        departure: '04:15 AM',
                        arrival: '02:20 PM',
                        departureAirport: 'DEL',
                        arrivalAirport: 'CDG',
                        departureCity: 'New Delhi',
                        arrivalCity: 'Paris',
                        duration: '12h 35m',
                        price: '₹38,000',
                        stops: 1,
                        gate: 'B7',
                        seat: '15C',
                    },
                ],
            },
            {
                type: 'alert',
                level: 'info',
                text: 'Prices shown are per person. Tap a card for details.',
                dismissible: true,
            },
        ],
    },
    attraction: {
        blocks: [
            {
                type: 'text',
                content: '🏛️ Found **6 attractions** in Delhi. Here are the top places to visit:',
                format: 'markdown',
            },
            {
                type: 'attraction_carousel',
                title: 'Top Attractions in Delhi',
                destination: 'Delhi',
                attractions: [
                    {
                        id: 'delhi-1',
                        name: 'India Gate',
                        category: 'Monument',
                        description: 'Iconic war memorial and popular gathering spot',
                        rating: 4.7,
                        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400',
                        duration: '1 hour',
                        price: 'Free',
                        lat: 28.6129,
                        lng: 77.2295,
                    },
                    {
                        id: 'delhi-2',
                        name: 'Red Fort',
                        category: 'UNESCO Heritage',
                        description: 'UNESCO World Heritage Site and symbol of Mughal power',
                        rating: 4.6,
                        image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400',
                        duration: '2-3 hours',
                        price: '₹35 / ₹500',
                        lat: 28.6562,
                        lng: 77.2410,
                    },
                    {
                        id: 'delhi-3',
                        name: 'Qutub Minar',
                        category: 'UNESCO Heritage',
                        description: 'Tallest brick minaret in the world',
                        rating: 4.7,
                        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400',
                        duration: '1-2 hours',
                        price: '₹30 / ₹500',
                        lat: 28.5244,
                        lng: 77.1855,
                    },
                    {
                        id: 'delhi-4',
                        name: "Humayun's Tomb",
                        category: 'Historical',
                        description: 'Stunning Mughal architecture',
                        rating: 4.8,
                        image: 'https://images.unsplash.com/photo-1623682242005-1dc8e1eb3e4e?w=400',
                        duration: '1-2 hours',
                        price: '₹30 / ₹500',
                        lat: 28.5933,
                        lng: 77.2507,
                    },
                    {
                        id: 'delhi-5',
                        name: 'Chandni Chowk',
                        category: 'Market',
                        description: 'Historic market with amazing street food',
                        rating: 4.5,
                        image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400',
                        duration: '3-4 hours',
                        price: 'Free',
                        lat: 28.6506,
                        lng: 77.2303,
                    },
                    {
                        id: 'delhi-6',
                        name: 'Lotus Temple',
                        category: 'Temple',
                        description: 'Architectural marvel shaped like a lotus',
                        rating: 4.6,
                        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400',
                        duration: '1 hour',
                        price: 'Free',
                        lat: 28.5535,
                        lng: 77.2588,
                    },
                ],
            },
            {
                type: 'alert',
                level: 'info',
                text: 'Click on any attraction to see its location on the map.',
                dismissible: true,
            },
        ],
        map: {
            action: 'zoom',
            location: {
                city: 'Delhi',
                lat: 28.6139,
                lng: 77.2090,
                zoom: 12,
            },
            markers: [
                { id: 'delhi-1', title: 'India Gate', lat: 28.6129, lng: 77.2295, category: 'Monument', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400' },
                { id: 'delhi-2', title: 'Red Fort', lat: 28.6562, lng: 77.2410, category: 'UNESCO Heritage', image: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?w=400' },
                { id: 'delhi-3', title: 'Qutub Minar', lat: 28.5244, lng: 77.1855, category: 'UNESCO Heritage', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400' },
                { id: 'delhi-4', title: "Humayun's Tomb", lat: 28.5933, lng: 77.2507, category: 'Historical', image: 'https://images.unsplash.com/photo-1623682242005-1dc8e1eb3e4e?w=400' },
                { id: 'delhi-5', title: 'Chandni Chowk', lat: 28.6506, lng: 77.2303, category: 'Market', image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=400' },
                { id: 'delhi-6', title: 'Lotus Temple', lat: 28.5535, lng: 77.2588, category: 'Temple', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400' },
            ],
        },
    } as UIResponse & { map: unknown },
    tours: {
        blocks: [
            {
                type: 'title',
                text: '🚶 Top Tours in Rome',
                level: 1,
            },
            {
                type: 'text',
                content: 'Found **3 tours** that match your interests:',
                format: 'markdown',
            },
            {
                type: 'card',
                title: 'Colosseum Skip-the-Line Tour',
                subtitle: 'Historical • 2.5 hours',
                image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=400',
                meta: [
                    { label: 'Price', value: '€49/person' },
                    { label: 'Rating', value: '4.8 ★' },
                ],
                badge: 'Popular',
                badgeVariant: 'primary',
                actions: [{ id: 'tour-colosseum', label: 'View Details', variant: 'primary' }],
            },
            {
                type: 'card',
                title: 'Vatican Museums & Sistine Chapel',
                subtitle: 'Art & Culture • 3 hours',
                image: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=400',
                meta: [
                    { label: 'Price', value: '€59/person' },
                    { label: 'Rating', value: '4.7 ★' },
                ],
                badge: 'Best Seller',
                badgeVariant: 'success',
                actions: [{ id: 'tour-vatican', label: 'View Details', variant: 'primary' }],
            },
            {
                type: 'card',
                title: 'Rome Food & Market Walk',
                subtitle: 'Food Tour • 3 hours',
                image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
                meta: [
                    { label: 'Price', value: '€45/person' },
                    { label: 'Rating', value: '4.9 ★' },
                ],
                badge: 'Top Rated',
                badgeVariant: 'default',
                actions: [{ id: 'tour-food', label: 'View Details', variant: 'primary' }],
            },
        ],
    },
};

function getMockResponse(message: string): UIResponse {
    const lowerMsg = message.toLowerCase();

    if (lowerMsg.includes('trip') || lowerMsg.includes('plan') || lowerMsg.includes('itinerary')) {
        return MOCK_RESPONSES.trip;
    }
    if (lowerMsg.includes('hotel') || lowerMsg.includes('stay') || lowerMsg.includes('accommodation')) {
        return MOCK_RESPONSES.hotel;
    }
    if (lowerMsg.includes('weather') || lowerMsg.includes('climate') || lowerMsg.includes('temperature')) {
        return MOCK_RESPONSES.weather;
    }
    if (lowerMsg.includes('visa') || lowerMsg.includes('passport') || lowerMsg.includes('entry')) {
        return MOCK_RESPONSES.visa;
    }
    if (lowerMsg.includes('flight') || lowerMsg.includes('fly') || lowerMsg.includes('airline')) {
        return MOCK_RESPONSES.flight;
    }
    if (lowerMsg.includes('attraction') || lowerMsg.includes('things to do') || lowerMsg.includes('places') || lowerMsg.includes('visit') || lowerMsg.includes('see in')) {
        return MOCK_RESPONSES.attraction;
    }
    if (lowerMsg.includes('tour') || lowerMsg.includes('experience')) {
        return MOCK_RESPONSES.tours;
    }

    return MOCK_RESPONSES.default;
}

// Request validation schema
const ChatRequestSchema = z.object({
    message: z.string().min(1, 'Message is required'),
    session_id: z.string().optional(),
    user_id: z.string().optional(),
});

/**
 * Main chat controller
 * POST /api/chat
 */
export async function chatHandler(req: Request, res: Response): Promise<void> {
    try {
        // Validate request
        const parseResult = ChatRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.status(400).json({
                error: 'Invalid request',
                details: parseResult.error.errors,
            });
            return;
        }

        const { message, session_id } = parseResult.data;

        console.log(`📨 Chat request: "${message.substring(0, 50)}..."`);

        // DEMO MODE: Return mock responses without AI calls
        if (DEMO_MODE) {
            console.log('🎭 DEMO MODE: Returning mock response');
            const mockResponse = getMockResponse(message);
            res.json({
                ...mockResponse,
                session_id: session_id || 'demo-session',
            });
            return;
        }

        // Get or create conversation
        const conversation = await getConversation(session_id);
        await addMessage(conversation.id, 'user', message);

        // Route intent
        const { intent, tools: recommendedTools, requiresRag } = await routeIntent(message);
        console.log(`🎯 Intent: ${intent}, Tools: ${recommendedTools.join(', ')}`);

        // Get conversation history
        const history = await getHistory(conversation.id);

        // Get user profile context (disabled for now)
        const profileContext = '';

        // Get RAG context if needed
        let ragContext = '';
        if (requiresRag) {
            const entities = extractEntities(message);
            const destination = entities.destinations[0];
            ragContext = await getRegulationsContext(message, destination);
            console.log(`📚 RAG context length: ${ragContext.length} chars`);
        }

        // Build system prompt with context
        let fullSystemPrompt = SYSTEM_PROMPT;
        if (profileContext) {
            fullSystemPrompt += `\n\n${profileContext}`;
        }
        if (ragContext) {
            fullSystemPrompt += `\n\n${ragContext}`;
        }

        // Get available tools based on intent
        const availableTools = toolRegistry.getByNames(recommendedTools);

        let response: UIResponse;

        if (availableTools.length > 0) {
            // Use tool calling flow
            response = await processWithTools(
                fullSystemPrompt,
                message,
                history,
                availableTools,
                intent
            );
        } else {
            // Simple text generation (no tools needed)
            const llmResponse = await generateText(
                ragContext ? RAG_CONTEXT_PROMPT : fullSystemPrompt,
                message,
                ragContext || undefined
            );

            const parsed = parseJSONFromLLM(llmResponse);
            if (parsed) {
                const validation = validateUIResponse(parsed);
                if (validation.valid && validation.data) {
                    response = validation.data;
                } else {
                    const fixed = autoFixResponse(parsed);
                    response = fixed || createErrorResponse('Failed to generate valid response');
                }
            } else {
                // Wrap plain text in text block
                response = {
                    blocks: [
                        {
                            type: 'text',
                            content: llmResponse,
                            format: 'markdown',
                        },
                    ],
                };
            }
        }

        // Save assistant response
        await addMessage(conversation.id, 'assistant', JSON.stringify(response));

        // Send response
        res.json({
            ...response,
            session_id: conversation.id,
        });

        console.log(`✅ Response sent with ${response.blocks.length} blocks`);
    } catch (error) {
        console.error('Chat handler error:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
        res.status(500).json(
            createErrorResponse(
                'An error occurred while processing your request. Please try again.'
            )
        );
    }
}

/**
 * Process message with tool calling
 */
async function processWithTools(
    systemPrompt: string,
    message: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    tools: ReturnType<typeof toolRegistry.getAll>,
    intent: string
): Promise<UIResponse> {
    try {
        // First LLM call - may request tool calls
        const firstResponse = await generateWithTools(systemPrompt, message, history, tools);

        if (firstResponse.toolCalls.length === 0) {
            // No tools needed - parse the text response
            if (firstResponse.text) {
                const parsed = parseJSONFromLLM(firstResponse.text);
                if (parsed) {
                    const validation = validateUIResponse(parsed);
                    if (validation.valid && validation.data) {
                        return validation.data;
                    }
                    const fixed = autoFixResponse(parsed);
                    if (fixed) return fixed;
                }
                // Wrap as text block
                return {
                    blocks: [{ type: 'text', content: firstResponse.text, format: 'markdown' }],
                };
            }
            return createErrorResponse('No response generated');
        }

        // Execute tool calls
        console.log(`🔧 Executing ${firstResponse.toolCalls.length} tool calls...`);
        const toolResults: Map<string, ToolResult> = new Map();
        const toolResultsForLLM: Array<{ name: string; result: ToolResult }> = [];

        for (const toolCall of firstResponse.toolCalls) {
            const tool = tools.find((t) => t.name === toolCall.name);
            if (!tool) {
                console.warn(`Tool not found: ${toolCall.name}`);
                continue;
            }

            console.log(`  → ${toolCall.name}(${JSON.stringify(toolCall.args)})`);
            const result = await tool.execute(toolCall.args);
            console.log(`  ← ${result.source}: ${result.success ? 'success' : 'failed'}`);

            toolResults.set(toolCall.name, result);
            toolResultsForLLM.push({ name: toolCall.name, result });
        }

        // If we have tool results, we can either:
        // 1. Compose response directly (faster, more predictable)
        // 2. Send back to LLM for natural language generation

        // Extract destination from tool args for map centering
        const attractionCall = firstResponse.toolCalls.find(tc => tc.name === 'discover_attractions');
        const destination = attractionCall?.args?.destination as string | undefined;

        // Option 1: Compose response from tool results
        const composedResponse = composeResponse(intent, toolResults, destination);
        if (composedResponse.blocks.length > 0) {
            return composedResponse;
        }

        // Option 2: Continue with LLM if composition didn't produce blocks
        const finalResponse = await continueWithToolResults(
            systemPrompt,
            message,
            history,
            tools,
            toolResultsForLLM
        );

        const parsed = parseJSONFromLLM(finalResponse);
        if (parsed) {
            const validation = validateUIResponse(parsed);
            if (validation.valid && validation.data) {
                return validation.data;
            }
            const fixed = autoFixResponse(parsed);
            if (fixed) return fixed;
        }

        // Fallback: wrap as text
        return {
            blocks: [{ type: 'text', content: finalResponse, format: 'markdown' }],
        };
    } catch (error) {
        console.error('Tool processing error:', error);
        return createErrorResponse('Failed to process your request with travel services');
    }
}

/**
 * SSE streaming chat handler
 * POST /api/chat/stream
 */
export async function streamChatHandler(req: Request, res: Response): Promise<void> {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const parseResult = ChatRequestSchema.safeParse(req.body);
        if (!parseResult.success) {
            res.write(`data: ${JSON.stringify({ error: 'Invalid request' })}\n\n`);
            res.end();
            return;
        }

        const { message, session_id } = parseResult.data;

        // Send processing status
        res.write(`data: ${JSON.stringify({ status: 'processing', message: 'Analyzing your request...' })}\n\n`);

        // Get conversation
        const conversation = await getConversation(session_id);
        await addMessage(conversation.id, 'user', message);

        // Route intent
        const { intent, tools: recommendedTools, requiresRag } = await routeIntent(message);
        res.write(`data: ${JSON.stringify({ status: 'intent', intent })}\n\n`);

        // Get history and context
        const history = await getHistory(conversation.id);
        let ragContext = '';
        if (requiresRag) {
            res.write(`data: ${JSON.stringify({ status: 'rag', message: 'Checking travel regulations...' })}\n\n`);
            const entities = extractEntities(message);
            ragContext = await getRegulationsContext(message, entities.destinations[0]);
        }

        const fullSystemPrompt = ragContext ? `${SYSTEM_PROMPT}\n\n${ragContext}` : SYSTEM_PROMPT;
        const availableTools = toolRegistry.getByNames(recommendedTools);

        // Execute tools and send progress
        if (availableTools.length > 0) {
            res.write(`data: ${JSON.stringify({ status: 'tools', message: 'Fetching travel data...' })}\n\n`);
        }

        // Generate response (simplified for streaming)
        let response: UIResponse;
        if (availableTools.length > 0) {
            response = await processWithTools(fullSystemPrompt, message, history, availableTools, intent);
        } else {
            const llmResponse = await generateText(fullSystemPrompt, message, ragContext || undefined);
            const parsed = parseJSONFromLLM(llmResponse);
            response = parsed
                ? (validateUIResponse(parsed).data || autoFixResponse(parsed) || createErrorResponse('Parse error'))
                : { blocks: [{ type: 'text', content: llmResponse, format: 'markdown' as const }] };
        }

        // Send blocks progressively
        for (let i = 0; i < response.blocks.length; i++) {
            const block = response.blocks[i];
            res.write(`data: ${JSON.stringify({ type: 'block', index: i, block })}\n\n`);
        }

        // Send completion
        res.write(`data: ${JSON.stringify({ type: 'done', session_id: conversation.id })}\n\n`);

        await addMessage(conversation.id, 'assistant', JSON.stringify(response));
    } catch (error) {
        console.error('Stream handler error:', error);
        res.write(`data: ${JSON.stringify({ type: 'error', message: 'An error occurred' })}\n\n`);
    } finally {
        res.end();
    }
}

/**
 * Health check handler
 */
export function healthHandler(_req: Request, res: Response): void {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
}
