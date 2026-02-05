import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessage } from '../components/chat/ChatMessage';
import { InlineAIInput } from '../components/molecules/InlineAIInput';
import type { TripPreferences, Message, Attraction } from '../types/chat';
import { TRANSPORT_LABELS } from '../types/chat';
import type { UIResponse } from '../types/ui-schema';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4333';

interface ChatScreenProps {
    onNavigate?: (tab: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate }) => {
    const [messages, setMessages] = useState<Message[]>(() => ([
        {
            id: '1',
            type: 'ai',
            content: "Hey there! ✨ I'm your AI travel companion. Let's plan your perfect trip together!",
            timestamp: new Date()
        },
        {
            id: '2',
            type: 'interactive',
            interactiveType: 'destination',
            timestamp: new Date()
        }
    ]));
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [preferences, setPreferences] = useState<TripPreferences>({
        destination: null,
        companions: null,
        budget: null,
        dates: null,
        currentLocation: null,
        transportMode: null,
        interests: [],
    });
    const messageIdRef = useRef(0);
    const createMessageId = () => {
        messageIdRef.current += 1;
        return `${Date.now()}-${messageIdRef.current}`;
    };
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleDestinationSelect = (destination: string) => {
        setPreferences(prev => ({ ...prev, destination }));
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: `I want to go to ${destination}`, timestamp: new Date() },
            { id: createMessageId(), type: 'ai', content: `Great choice! ${destination} is amazing! 🌟 Who are you traveling with?`, timestamp: new Date() },
            { id: createMessageId(), type: 'interactive', interactiveType: 'companions', timestamp: new Date() }
        ]);
    };

    const handleCompanionsSelect = (companions: string) => {
        setPreferences(prev => ({ ...prev, companions }));
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: `I'm traveling ${companions}`, timestamp: new Date() },
            { id: createMessageId(), type: 'ai', content: `Sounds fun! Now let's talk budget 💰`, timestamp: new Date() },
            { id: createMessageId(), type: 'interactive', interactiveType: 'budget', timestamp: new Date() }
        ]);
    };

    const handleBudgetSelect = (budget: string) => {
        setPreferences(prev => ({ ...prev, budget }));
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: `My budget is ${budget}`, timestamp: new Date() },
            { id: createMessageId(), type: 'ai', content: `Perfect! When are you planning to travel? 📅`, timestamp: new Date() },
            { id: createMessageId(), type: 'interactive', interactiveType: 'dates', timestamp: new Date() }
        ]);
    };

    const handleDatesSelect = (dates: string) => {
        setPreferences(prev => ({ ...prev, dates }));
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: `I'm planning for ${dates}`, timestamp: new Date() },
            { id: createMessageId(), type: 'ai', content: `Great! Now, where are you from? 📍 This helps us plan the best travel route for you.`, timestamp: new Date() },
            { id: createMessageId(), type: 'interactive', interactiveType: 'location', timestamp: new Date() }
        ]);
    };

    const handleLocationSelect = (location: string) => {
        setPreferences(prev => ({ ...prev, currentLocation: location }));
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: `I'm from ${location}`, timestamp: new Date() },
            { id: createMessageId(), type: 'ai', content: `Perfect! How would you like to travel from ${location}? 🚀`, timestamp: new Date() },
            { id: createMessageId(), type: 'interactive', interactiveType: 'transport', timestamp: new Date() }
        ]);
    };

    const handleTransportSelect = (transport: string) => {
        setPreferences(prev => ({ ...prev, transportMode: transport }));
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: `I'll travel by ${TRANSPORT_LABELS[transport]}`, timestamp: new Date() },
            { id: createMessageId(), type: 'ai', content: `Great choice! Now tell me about your interests 🎯`, timestamp: new Date() },
            { id: createMessageId(), type: 'interactive', interactiveType: 'interests', timestamp: new Date() }
        ]);
    };

    const handleInterestsSelect = (interests: string[]) => {
        const updatedPrefs = { ...preferences, interests };
        setPreferences(updatedPrefs);
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: `I'm interested in ${interests.join(', ')}`, timestamp: new Date() },
            { id: createMessageId(), type: 'ai', content: `Excellent! 🎉 Here are the top attractions at your destination that you must visit!`, timestamp: new Date() },
            { id: createMessageId(), type: 'interactive', interactiveType: 'attractions', timestamp: new Date() }
        ]);
    };

    const buildBlocksFromStructured = (structured: {
        summary?: string;
        recommendations?: unknown[];
        next_questions?: string[];
    }) => {
        if (!structured) return undefined;
        const blocks: UIResponse['blocks'] = [];

        if (structured.summary) {
            blocks.push({ type: 'text', content: structured.summary, format: 'plain' });
        }

        if (Array.isArray(structured.recommendations) && structured.recommendations.length > 0) {
            blocks.push({ type: 'title', text: 'Recommendations', level: 3 });
            blocks.push({
                type: 'list',
                ordered: false,
                items: structured.recommendations.map((rec, index) => ({
                    id: `rec-${index}`,
                    text: typeof rec === 'string' ? rec : JSON.stringify(rec)
                }))
            });
        }

        if (Array.isArray(structured.next_questions) && structured.next_questions.length > 0) {
            blocks.push({ type: 'title', text: 'Next Questions', level: 3 });
            blocks.push({
                type: 'list',
                ordered: true,
                items: structured.next_questions.map((question, index) => ({
                    id: `question-${index}`,
                    text: question
                }))
            });
        }

        if (blocks.length === 0) return undefined;
        return { blocks };
    };

    const mergeBlocks = (primary?: UIResponse, secondary?: UIResponse) => {
        if (!primary && !secondary) return undefined;
        if (!primary) return secondary;
        if (!secondary) return primary;
        return { blocks: [...primary.blocks, ...secondary.blocks] };
    };

    const streamChat = async (prompt: string) => {
        const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: prompt,
                sessionId: sessionId || undefined,
            }),
        });

        if (!response.ok || !response.body) {
            throw new Error('Failed to start streaming');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let finalPayload: unknown = null;
        let streamError: unknown = null;

        const processChunk = (chunk: string) => {
            const lines = chunk.split('\n');
            let event = 'message';
            const dataLines: string[] = [];

            for (const line of lines) {
                if (line.startsWith('event:')) {
                    event = line.replace('event:', '').trim();
                    continue;
                }
                if (line.startsWith('data:')) {
                    dataLines.push(line.replace('data:', '').trim());
                }
            }

            if (dataLines.length === 0) return;
            const raw = dataLines.join('\n');
            let payload: unknown = raw;
            try {
                payload = JSON.parse(raw);
            } catch {
                payload = raw;
            }

            if (event === 'meta' && typeof payload === 'object' && payload !== null && 'sessionId' in payload) {
                const metaSessionId = (payload as { sessionId?: string }).sessionId;
                if (metaSessionId && metaSessionId !== sessionId) {
                    setSessionId(metaSessionId);
                }
            }
            if (event === 'final') {
                finalPayload = payload;
                if (typeof payload === 'object' && payload !== null && 'sessionId' in payload) {
                    const finalSessionId = (payload as { sessionId?: string }).sessionId;
                    if (finalSessionId && finalSessionId !== sessionId) {
                        setSessionId(finalSessionId);
                    }
                }
            }
            if (event === 'error') {
                streamError = payload;
            }
        };

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const parts = buffer.split('\n\n');
            buffer = parts.pop() || '';
            for (const part of parts) {
                if (!part.trim()) continue;
                processChunk(part);
            }
        }

        if (buffer.trim()) {
            processChunk(buffer);
        }

        if (!finalPayload) {
            const message =
                typeof streamError === 'object' && streamError !== null && 'message' in streamError
                    ? (streamError as { message?: string }).message || 'Streaming failed'
                    : 'Streaming failed';
            throw new Error(message);
        }

        return finalPayload as {
            structured?: {
                reply?: string;
                itinerary?: unknown;
            };
            itinerary?: unknown;
            fallback?: { itinerary?: unknown };
            message?: string;
            uiBlocks?: UIResponse;
        };
    };

    const handleAttractionsContinue = async (selectedAttractions: Attraction[]) => {
        const attractionCount = selectedAttractions.length;

        const buildPrompt = () => {
            const lines = [
                'Create a personalized travel itinerary and planning summary.',
                `Destination: ${preferences.destination || 'Unknown'}`,
                `Dates: ${preferences.dates || 'Flexible'}`,
                `Companions: ${preferences.companions || 'Unknown'}`,
                `Budget: ${preferences.budget || 'Unknown'}`,
                `Origin: ${preferences.currentLocation || 'Unknown'}`,
                `Transport: ${preferences.transportMode ? TRANSPORT_LABELS[preferences.transportMode] : 'Unknown'}`,
                `Interests: ${preferences.interests.length ? preferences.interests.join(', ') : 'None listed'}`,
                `Selected attractions: ${selectedAttractions.length ? selectedAttractions.map(a => a.name).join(', ') : 'None selected'}`,
                '',
                'If you can, include an itinerary field in your JSON response that matches:',
                '{ destination, totalDays, dailyPlan: [{ day, type?, description?, region?, activities?, totalDurationHours? }], warnings? }'
            ];

            return lines.join('\n');
        };
        
        // Add user message and loading state
        const loadingMsgId = createMessageId();
        setMessages(prev => [
            ...prev,
            { 
                id: createMessageId(), 
                type: 'user', 
                content: attractionCount > 0 
                    ? `I've selected ${attractionCount} attraction${attractionCount > 1 ? 's' : ''}: ${selectedAttractions.map(a => a.name).join(', ')}` 
                    : 'Continuing without selecting attractions', 
                timestamp: new Date() 
            },
            { 
                id: createMessageId(), 
                type: 'ai', 
                content: attractionCount > 0 
                    ? `✨ Great choices! Let me generate a personalized itinerary for you...`
                    : `✨ Let me generate your trip itinerary...`, 
                timestamp: new Date() 
            },
            { 
                id: loadingMsgId, 
                type: 'interactive', 
                interactiveType: 'itinerary', 
                timestamp: new Date(),
                isLoading: true 
            }
        ]);

        try {
            const data = await streamChat(buildPrompt());
            const structured = data.structured || null;
            const itinerary = structured?.itinerary || data.itinerary || data?.fallback?.itinerary;
            const structuredBlocks = structured ? buildBlocksFromStructured(structured) : undefined;
            const blocks = mergeBlocks(structuredBlocks, data.uiBlocks);
            const responseText = structured?.reply || data.message || 'I have your trip updates ready.';

            setMessages(prev => prev.map(msg => {
                if (msg.id !== loadingMsgId) return msg;

                if (itinerary && Array.isArray(itinerary.dailyPlan) && itinerary.dailyPlan.length > 0) {
                    return {
                        ...msg,
                        isLoading: false,
                        itineraryData: itinerary
                    };
                }

                return {
                    ...msg,
                    type: 'ai' as const,
                    interactiveType: undefined,
                    isLoading: false,
                    content: responseText,
                    blocks
                };
            }));
        } catch (error) {
            console.error('Itinerary generation error:', error);
            // Update the loading message to show error/fallback
            setMessages(prev => prev.map(msg => 
                msg.id === loadingMsgId 
                    ? { 
                        ...msg, 
                        type: 'ai' as const,
                        interactiveType: undefined,
                        isLoading: false,
                        content: `❌ Sorry, I couldn't generate the itinerary right now. Please make sure the server is running and try again.`
                      }
                    : msg
            ));
        }
    };

    const handleFreeformSubmit = async (message: string) => {
        const loadingMsgId = createMessageId();
        setMessages(prev => [
            ...prev,
            { id: createMessageId(), type: 'user', content: message, timestamp: new Date() },
            {
                id: createMessageId(),
                type: 'ai',
                content: 'Let me check that for you...',
                timestamp: new Date()
            },
            {
                id: loadingMsgId,
                type: 'interactive',
                interactiveType: 'itinerary',
                timestamp: new Date(),
                isLoading: true
            }
        ]);

        try {
            const data = await streamChat(message);
            const structured = data.structured || null;
            const itinerary = structured?.itinerary || data.itinerary || data?.fallback?.itinerary;
            const structuredBlocks = structured ? buildBlocksFromStructured(structured) : undefined;
            const blocks = mergeBlocks(structuredBlocks, data.uiBlocks);
            const responseText = structured?.reply || data.message || 'I have your trip updates ready.';

            setMessages(prev => prev.map(msg => {
                if (msg.id !== loadingMsgId) return msg;

                if (itinerary && Array.isArray(itinerary.dailyPlan) && itinerary.dailyPlan.length > 0) {
                    return {
                        ...msg,
                        isLoading: false,
                        itineraryData: itinerary
                    };
                }

                return {
                    ...msg,
                    type: 'ai' as const,
                    interactiveType: undefined,
                    isLoading: false,
                    content: responseText,
                    blocks
                };
            }));
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => prev.map(msg =>
                msg.id === loadingMsgId
                    ? {
                        ...msg,
                        type: 'ai' as const,
                        interactiveType: undefined,
                        isLoading: false,
                        content: '❌ Sorry, I could not process that message. Please try again.'
                    }
                    : msg
            ));
        }
    };

    return (
        <div className="mobile-chat-screen">
            {/* Chat Header */}
            <ChatHeader onNavigate={onNavigate} />

            {/* Messages Area */}
            <div className="mobile-chat-messages">
                <AnimatePresence>
                    {messages.map((message) => (
                        <ChatMessage
                            key={message.id}
                            message={message}
                            preferences={preferences}
                            onDestinationSelect={handleDestinationSelect}
                            onCompanionsSelect={handleCompanionsSelect}
                            onBudgetSelect={handleBudgetSelect}
                            onDatesSelect={handleDatesSelect}
                            onLocationSelect={handleLocationSelect}
                            onTransportSelect={handleTransportSelect}
                            onInterestsSelect={handleInterestsSelect}
                            onAttractionsContinue={handleAttractionsContinue}
                        />
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <InlineAIInput
                onSubmit={handleFreeformSubmit}
                placeholder="Ask anything about your trip..."
            />
        </div>
    );
};

export default ChatScreen;

