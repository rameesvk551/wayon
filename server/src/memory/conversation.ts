import { v4 as uuidv4 } from 'uuid';

import { cacheGet, cacheSet, cacheDelete } from '../cache/redis.js';
import { CACHE_TTL } from '../config/env.js';
import { generateText } from '../ai/llm-client.js';

/**
 * Conversation message interface
 */
export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

/**
 * Conversation interface
 */
export interface Conversation {
    id: string;
    messages: Message[];
    summary?: string;
    createdAt: number;
    updatedAt: number;
}

/**
 * Get or create a conversation
 */
export async function getConversation(sessionId?: string): Promise<Conversation> {
    if (sessionId) {
        const cached = await cacheGet<Conversation>(`conversation:${sessionId}`);
        if (cached) {
            return cached;
        }
    }

    // Create new conversation
    const id = sessionId || uuidv4();
    const conversation: Conversation = {
        id,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };

    await saveConversation(conversation);
    return conversation;
}

/**
 * Save conversation to cache
 */
async function saveConversation(conversation: Conversation): Promise<void> {
    conversation.updatedAt = Date.now();
    await cacheSet(
        `conversation:${conversation.id}`,
        conversation,
        CACHE_TTL.conversation
    );
}

/**
 * Add message to conversation
 */
export async function addMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string
): Promise<Message> {
    const conversation = await getConversation(conversationId);

    const message: Message = {
        id: uuidv4(),
        role,
        content,
        timestamp: Date.now(),
    };

    conversation.messages.push(message);

    // Summarize if conversation is getting long
    if (conversation.messages.length > 10) {
        await summarizeConversation(conversation);
    }

    await saveConversation(conversation);
    return message;
}

/**
 * Get conversation history for LLM context
 */
export async function getHistory(
    conversationId: string,
    maxMessages: number = 10
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
    const conversation = await getConversation(conversationId);

    // Get recent messages
    const recentMessages = conversation.messages.slice(-maxMessages);

    // If we have a summary, prepend it
    if (conversation.summary && conversation.messages.length > maxMessages) {
        return [
            {
                role: 'assistant',
                content: `[Previous conversation summary: ${conversation.summary}]`,
            },
            ...recentMessages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
        ];
    }

    return recentMessages.map((m) => ({
        role: m.role,
        content: m.content,
    }));
}

/**
 * Summarize conversation to reduce token usage
 */
async function summarizeConversation(conversation: Conversation): Promise<void> {
    if (conversation.messages.length <= 10) {
        return;
    }

    // Get messages that will be summarized (all but last 5)
    const toSummarize = conversation.messages.slice(0, -5);

    try {
        const prompt = `Summarize this conversation between a user and a travel assistant in 2-3 sentences. Focus on key destinations, dates, and preferences mentioned.

Conversation:
${toSummarize.map((m) => `${m.role}: ${m.content}`).join('\n')}

Summary:`;

        const summary = await generateText(
            'You are a helpful assistant that summarizes conversations concisely.',
            prompt
        );

        conversation.summary = summary;

        // Keep only recent messages
        conversation.messages = conversation.messages.slice(-5);
    } catch (error) {
        console.error('Failed to summarize conversation:', error);
        // Continue without summarizing
    }
}

/**
 * Clear conversation
 */
export async function clearConversation(conversationId: string): Promise<void> {
    await cacheDelete(`conversation:${conversationId}`);
}

/**
 * Get recent user context (destinations, preferences)
 */
export async function getUserContext(
    conversationId: string
): Promise<{
    destinations: string[];
    travelDates: string[];
    preferences: string[];
}> {
    const conversation = await getConversation(conversationId);

    const destinations: Set<string> = new Set();
    const travelDates: Set<string> = new Set();
    const preferences: Set<string> = new Set();

    // Simple extraction from messages
    for (const msg of conversation.messages) {
        if (msg.role !== 'user') continue;

        const content = msg.content.toLowerCase();

        // Extract destinations (simple pattern)
        const destPatterns = /(?:to|in|visit|explore)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)/gi;
        const destMatches = msg.content.matchAll(destPatterns);
        for (const match of destMatches) {
            if (match[1]) destinations.add(match[1]);
        }

        // Extract preferences keywords
        const prefKeywords = ['budget', 'luxury', 'adventure', 'beach', 'culture', 'food', 'romantic', 'family'];
        for (const keyword of prefKeywords) {
            if (content.includes(keyword)) {
                preferences.add(keyword);
            }
        }
    }

    return {
        destinations: Array.from(destinations),
        travelDates: Array.from(travelDates),
        preferences: Array.from(preferences),
    };
}
