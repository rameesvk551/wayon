import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { env } from '../config/env.js';
import type { Tool, ToolResult } from '../tools/types.js';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// Model configurations - using gemini-2.0-flash (free tier)
const FLASH_MODEL = 'gemini-2.0-flash'; // Fast - for intent classification
const PRO_MODEL = 'gemini-2.0-flash';   // Using same model (free tier)

/**
 * Classify user intent using cheap/fast model
 */
export async function classifyIntent(message: string): Promise<string> {
    const model = genAI.getGenerativeModel({ model: FLASH_MODEL });

    const prompt = `Classify the following travel-related message into ONE of these intents:
- itinerary_generation: User wants to plan a trip or create an itinerary
- travel_feasibility: User is checking if travel is possible (dates, logistics)
- visa_check: User is asking about visa requirements or entry rules
- hotel_search: User wants to find or compare hotels
- flight_search: User wants to find or compare flights
- attraction_discovery: User wants to find things to do or places to visit
- weather_check: User wants weather information
- transport_search: User wants local transportation info
- tour_search: User wants guided tours or experiences
- general_question: General travel question not fitting above categories

Message: "${message}"

Respond with ONLY the intent name, nothing else.`;

    const result = await model.generateContent(prompt);
    const intent = result.response.text().trim().toLowerCase();

    // Validate intent
    const validIntents = [
        'itinerary_generation',
        'travel_feasibility',
        'visa_check',
        'hotel_search',
        'flight_search',
        'attraction_discovery',
        'weather_check',
        'transport_search',
        'tour_search',
        'general_question',
    ];

    return validIntents.includes(intent) ? intent : 'general_question';
}

/**
 * Convert our tool definitions to Gemini function declarations
 */
function toolsToFunctionDeclarations(tools: Tool[]) {
    return tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: {
            type: SchemaType.OBJECT,
            properties: Object.fromEntries(
                Object.entries(tool.parameters).map(([key, value]) => [
                    key,
                    {
                        type: value.type === 'number' ? SchemaType.NUMBER : SchemaType.STRING,
                        description: value.description,
                        enum: value.enum,
                    },
                ])
            ),
            required: tool.required || [],
        },
    }));
}

/**
 * Generate response with tool calling support
 */
export async function generateWithTools(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    tools: Tool[]
): Promise<{
    text: string | null;
    toolCalls: Array<{ name: string; args: Record<string, unknown> }>;
}> {
    const model = genAI.getGenerativeModel({
        model: PRO_MODEL,
        tools: [
            {
                functionDeclarations: toolsToFunctionDeclarations(tools),
            },
        ],
        systemInstruction: systemPrompt,
    });

    // Build chat history
    const history = conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const response = result.response;

    // Extract tool calls
    const toolCalls: Array<{ name: string; args: Record<string, unknown> }> = [];

    for (const candidate of response.candidates || []) {
        for (const part of candidate.content?.parts || []) {
            if (part.functionCall) {
                toolCalls.push({
                    name: part.functionCall.name,
                    args: (part.functionCall.args as Record<string, unknown>) || {},
                });
            }
        }
    }

    return {
        text: response.text() || null,
        toolCalls,
    };
}

/**
 * Continue generation after tool execution
 */
export async function continueWithToolResults(
    systemPrompt: string,
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    tools: Tool[],
    toolResults: Array<{ name: string; result: ToolResult }>
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: PRO_MODEL,
        tools: [
            {
                functionDeclarations: toolsToFunctionDeclarations(tools),
            },
        ],
        systemInstruction: systemPrompt,
    });

    // Build chat history
    const history = conversationHistory.map((msg) => ({
        role: msg.role === 'assistant' ? ('model' as const) : ('user' as const),
        parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });

    // Send user message
    await chat.sendMessage(userMessage);

    // Send tool results as function responses
    const functionResponseParts = toolResults.map((tr) => ({
        functionResponse: {
            name: tr.name,
            response: tr.result as object,
        },
    }));

    const result = await chat.sendMessage(functionResponseParts);
    return result.response.text();
}

/**
 * Simple text generation without tools (for RAG grounding)
 */
export async function generateText(
    systemPrompt: string,
    userMessage: string,
    context?: string
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: PRO_MODEL,
        systemInstruction: systemPrompt,
    });

    const prompt = context
        ? `Context:\n${context}\n\nUser message: ${userMessage}`
        : userMessage;

    const result = await model.generateContent(prompt);
    return result.response.text();
}
