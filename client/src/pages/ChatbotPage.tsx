import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles } from 'lucide-react';
import { ChatRenderer } from '../components/renderer/ChatRenderer';
import { TopNavBar } from '../components/organisms/TopNavBar';
import { InteractiveMap } from '../components/organisms/InteractiveMap';
import { TripWizard } from '../components/organisms/TripWizard';
import { QuickActionsChips } from '../components/molecules/QuickActionsChips';
import { MapProvider, useMapContext } from '../store/MapContext';
import type { UIResponse, MapInstruction } from '../types/ui-schema';

interface Message {
    id: string;
    type: 'ai' | 'user';
    content?: string;
    blocks?: UIResponse;
    timestamp: Date;
}

// Welcome message with rich blocks
const welcomeBlocks: UIResponse = {
    blocks: [
        {
            type: 'text',
            content: "Hey there! ✨ I'm your AI travel companion. Tell me about your dream destination, and I'll help you plan the perfect trip!",
            format: 'plain'
        },
        {
            type: 'divider',
            spacing: 'sm'
        },
        {
            type: 'text',
            content: "Try asking me to **find hotels in Paris**, **check weather in Bali**, or **plan a 5-day Japan trip**.",
            format: 'markdown'
        }
    ]
};

const ChatbotPageContent: React.FC<{ initialMessage?: string }> = ({ initialMessage }) => {
    const [messages, setMessages] = useState<Message[]>(() => {
        const initial: Message[] = [
            {
                id: '1',
                type: 'ai',
                blocks: welcomeBlocks,
                timestamp: new Date()
            }
        ];
        // If there's an initial message from wizard, add it as user message
        if (initialMessage) {
            initial.push({
                id: '2',
                type: 'user',
                content: initialMessage,
                timestamp: new Date()
            });
        }
        return initial;
    });
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [tripInfo, setTripInfo] = useState<{ destination: string; duration: string; guests: string } | undefined>();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setMapInstruction } = useMapContext();

    // Auto-send initial message from wizard
    useEffect(() => {
        if (initialMessage) {
            handleSendMessage(initialMessage);
        }
    }, []);

    const handleSendMessage = async (messageText: string) => {
        setIsTyping(true);
        try {
            const response = await fetch('http://localhost:4000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    session_id: sessionStorage.getItem('chat_session_id') || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            if (data.session_id) {
                sessionStorage.setItem('chat_session_id', data.session_id);
            }

            if (data.destination) {
                setTripInfo({
                    destination: data.destination,
                    duration: data.duration || '5 days',
                    guests: data.guests || '2 guests'
                });
            }

            if (data.map) {
                console.log('🗺️ Received map instruction:', data.map);
                setMapInstruction(data.map as MapInstruction);
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                blocks: { blocks: data.blocks, map: data.map },
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('API Error:', error);
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                blocks: {
                    blocks: [
                        {
                            type: 'alert',
                            level: 'error',
                            title: 'Connection Error',
                            text: "Couldn't connect to the server. Please make sure the backend is running on http://localhost:4000"
                        }
                    ]
                },
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        const messageToSend = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:4000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageToSend,
                    session_id: sessionStorage.getItem('chat_session_id') || undefined,
                }),
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();

            if (data.session_id) {
                sessionStorage.setItem('chat_session_id', data.session_id);
            }

            if (data.destination) {
                setTripInfo({
                    destination: data.destination,
                    duration: data.duration || '5 days',
                    guests: data.guests || '2 guests'
                });
            }

            // Handle map instructions from backend
            if (data.map) {
                console.log('🗺️ Received map instruction:', data.map);
                setMapInstruction(data.map as MapInstruction);
            }

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                blocks: { blocks: data.blocks, map: data.map },
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error('API Error:', error);
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                type: 'ai',
                blocks: {
                    blocks: [
                        {
                            type: 'alert',
                            level: 'error',
                            title: 'Connection Error',
                            text: "Couldn't connect to the server. Please make sure the backend is running on http://localhost:4000"
                        }
                    ]
                },
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleQuickAction = (actionId: string) => {
        const actionMessages: Record<string, string> = {
            'plan': 'Plan a trip for me',
            'hotels': 'Find hotels in Paris',
            'weather': 'What\'s the weather like in Bali?',
            'visa': 'What are the visa requirements for Japan?',
            'itinerary': 'Build a 5-day itinerary for Tokyo',
            'ai-suggest': 'Suggest some destinations for a beach vacation'
        };

        const message = actionMessages[actionId];
        if (message) {
            setInputValue(message);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-[var(--color-bg-primary)]">
            {/* Top Navigation */}
            <TopNavBar tripInfo={tripInfo} />

            {/* Main Content - Two Section Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Section - Chat (45%) */}
                <div className="w-[45%] flex flex-col bg-white border-r border-[var(--color-border)]">
                    {/* Messages Area with generous padding */}
                    <div className="flex-1 overflow-y-auto" style={{ padding: '32px' }}>
                        <div className="space-y-8">
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Avatar */}
                                        {message.type === 'ai' && (
                                            <div className="flex-shrink-0">
                                                <div className="
                                                    w-10 h-10 
                                                    rounded-xl
                                                    bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]
                                                    flex items-center justify-center
                                                    shadow-md
                                                ">
                                                    <Bot size={20} className="text-white" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Message Content */}
                                        <div className={`flex-1 ${message.type === 'user' ? 'flex flex-col items-end' : ''}`}>
                                            {/* User message bubble */}
                                            {message.type === 'user' && message.content && (
                                                <div className="
                                                    px-5 py-3
                                                    bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)]
                                                    text-white
                                                    rounded-2xl rounded-tr-md
                                                    shadow-sm
                                                    max-w-[90%]
                                                ">
                                                    <p className="text-[15px] leading-relaxed">{message.content}</p>
                                                </div>
                                            )}

                                            {/* AI message with blocks */}
                                            {message.type === 'ai' && (
                                                <div className="
                                                    bg-[var(--color-bg-tertiary)]
                                                    border border-[var(--color-border-light)]
                                                    rounded-2xl rounded-tl-md
                                                    p-5
                                                ">
                                                    {message.content && (
                                                        <p className="text-[15px] leading-relaxed text-[var(--color-text-primary)] mb-3">
                                                            {message.content}
                                                        </p>
                                                    )}
                                                    {message.blocks && (
                                                        <ChatRenderer
                                                            response={message.blocks}
                                                            onAction={(actionId) => console.log('Action:', actionId)}
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            {/* Timestamp */}
                                            <span className="text-[11px] text-[var(--color-text-muted)] mt-2 px-1">
                                                {formatTime(message.timestamp)}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Typing Indicator */}
                            <AnimatePresence>
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="
                                            w-10 h-10 
                                            rounded-xl
                                            bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]
                                            flex items-center justify-center
                                            shadow-md
                                        ">
                                            <Sparkles size={18} className="text-white animate-pulse" />
                                        </div>
                                        <div className="
                                            bg-[var(--color-bg-tertiary)] border border-[var(--color-border-light)]
                                            rounded-2xl rounded-tl-md
                                            px-5 py-4
                                        ">
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-1.5">
                                                    {[0, 1, 2].map((i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="w-2.5 h-2.5 bg-[var(--color-primary)] rounded-full"
                                                            animate={{ y: [0, -6, 0] }}
                                                            transition={{
                                                                duration: 0.6,
                                                                repeat: Infinity,
                                                                delay: i * 0.15,
                                                                ease: "easeInOut"
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-[var(--color-text-muted)]">
                                                    Planning your trip...
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Bottom Input Section - with clear padding */}
                    <div style={{ padding: '24px 32px', backgroundColor: 'white', borderTop: '1px solid #e5e7eb' }}>
                        {/* Quick Actions with margin */}
                        <div style={{ marginBottom: '20px' }}>
                            <QuickActionsChips onActionClick={handleQuickAction} />
                        </div>

                        {/* Large Chat Input - More prominent */}
                        <div
                            className="
                                flex items-center gap-4
                                rounded-2xl
                                focus-within:border-[var(--color-primary)]
                                focus-within:ring-4 focus-within:ring-[var(--color-primary-light)]
                                focus-within:shadow-lg
                                transition-all duration-200
                            "
                            style={{
                                padding: '20px 24px',
                                backgroundColor: '#f8f9fa',
                                border: '2px solid #e5e7eb',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about flights, hotels, visas, weather…"
                                className="
                                    flex-1
                                    bg-transparent
                                    text-base
                                    text-[var(--color-text-primary)]
                                    placeholder:text-[var(--color-text-muted)]
                                    outline-none
                                "
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSend}
                                disabled={!inputValue.trim()}
                                className={`
                                    px-6 py-3
                                    rounded-xl
                                    text-base font-semibold
                                    transition-all duration-200
                                    ${inputValue.trim()
                                        ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-md hover:shadow-lg'
                                        : 'bg-[var(--color-border)] text-[var(--color-text-light)] cursor-not-allowed'
                                    }
                                `}
                            >
                                Send
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Right Section - Interactive Map (55%) */}
                <div className="w-[55%] relative overflow-hidden">
                    <InteractiveMap />
                </div>
            </div>
        </div>
    );
};

// Main ChatbotPage with Wizard Flow
const ChatbotPage: React.FC = () => {
    const [wizardComplete, setWizardComplete] = useState(false);
    const [wizardSummary, setWizardSummary] = useState<string | undefined>();

    const handleWizardComplete = (summary: string) => {
        setWizardSummary(summary);
        setWizardComplete(true);
    };

    // Show wizard first, then chat
    if (!wizardComplete) {
        return <TripWizard onComplete={handleWizardComplete} />;
    }

    return (
        <MapProvider>
            <ChatbotPageContent initialMessage={wizardSummary} />
        </MapProvider>
    );
};

export default ChatbotPage;
