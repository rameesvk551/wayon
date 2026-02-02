import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, Sparkles, Bot } from 'lucide-react';
import { SuggestionChip } from '../molecules';
import { IconButton, Avatar } from '../atoms';
import { ChatRenderer } from '../renderer';
import { mockResponses } from '../../data/mockResponses';

import type { UIResponse } from '../../types/ui-schema';

// Extended message type that supports both plain text and schema responses
interface ExtendedMessage {
    id: string;
    type: 'user' | 'ai';
    content?: string;  // Plain text content
    blocks?: UIResponse;  // Schema-based response
    timestamp: string;
    suggestions?: string[];
}

interface ChatPanelProps {
    onTripCreated?: () => void;
}

const initialMessage: ExtendedMessage = {
    id: 'msg-0',
    type: 'ai',
    blocks: mockResponses.welcome,
    timestamp: new Date().toISOString()
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ onTripCreated }) => {
    const [messages, setMessages] = useState<ExtendedMessage[]>([initialMessage]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: ExtendedMessage = {
            id: `msg-${Date.now()}`,
            type: 'user',
            content: inputValue,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        const messageToSend = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            // Call the backend API
            const response = await fetch('http://localhost:4000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: messageToSend }),
            });

            const data = await response.json();

            const aiMessage: ExtendedMessage = {
                id: `msg-${Date.now() + 1}`,
                type: 'ai',
                blocks: data,  // data is already { blocks: [...] }
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Failed to get AI response:', error);
            // Fallback to local mock if API fails
            const aiMessage: ExtendedMessage = {
                id: `msg-${Date.now() + 1}`,
                type: 'ai',
                blocks: mockResponses.welcome,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleActionClick = (actionId: string) => {
        // Handle action clicks from schema blocks
        console.log('Action clicked:', actionId);

        // Simulate user clicking an action as a message
        if (actionId === 'greece' || actionId === 'plan') {
            setInputValue('Plan a Greece trip');
            setTimeout(() => handleSend(), 100);
        } else if (actionId === 'japan') {
            setInputValue('Explore Japan');
        }
    };



    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="
                flex-1
                flex flex-col
                h-full
                bg-[var(--color-bg-primary)]
                overflow-hidden
            "
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-white">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Trip Planner</h2>
                    <p className="text-sm text-[var(--color-text-muted)]">Plan your perfect journey with AI</p>
                </div>
                <div className="flex items-center gap-2">
                    <SuggestionChip variant="highlight" onClick={onTripCreated}>
                        <Sparkles size={14} />
                        View Itinerary
                    </SuggestionChip>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map(message => (
                    <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${message.type === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {message.type === 'ai' ? (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-md">
                                    <Bot size={18} />
                                </div>
                            ) : (
                                <Avatar name="You" size="sm" />
                            )}
                        </div>

                        {/* Content */}
                        <div className={`flex-1 max-w-[85%] ${message.type === 'ai' ? '' : 'flex flex-col items-end'}`}>
                            {/* Plain text message (user messages) */}
                            {message.content && (
                                <div
                                    className={`
                                        px-4 py-3
                                        rounded-2xl
                                        ${message.type === 'ai'
                                            ? 'bg-white border border-[var(--color-border)] rounded-tl-sm'
                                            : 'bg-[var(--color-primary)] text-white rounded-tr-sm'
                                        }
                                        shadow-sm
                                    `}
                                >
                                    <div className={`text-sm leading-relaxed ${message.type === 'ai' ? 'text-[var(--color-text-primary)]' : ''}`}>
                                        {message.content}
                                    </div>
                                </div>
                            )}

                            {/* Schema-based response (AI messages with blocks) */}
                            {message.blocks && (
                                <div className="bg-white border border-[var(--color-border)] rounded-2xl rounded-tl-sm p-4 shadow-sm">
                                    <ChatRenderer
                                        response={message.blocks}
                                        onAction={handleActionClick}
                                    />
                                </div>
                            )}

                            {/* Timestamp */}
                            <span className="text-[10px] text-[var(--color-text-muted)] mt-1.5 block">
                                {formatTime(message.timestamp)}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center">
                            <div className="flex gap-1">
                                <motion.span
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                                    className="w-1.5 h-1.5 bg-white rounded-full"
                                />
                                <motion.span
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                    className="w-1.5 h-1.5 bg-white rounded-full"
                                />
                                <motion.span
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                    className="w-1.5 h-1.5 bg-white rounded-full"
                                />
                            </div>
                        </div>
                        <span className="text-sm text-[var(--color-text-muted)]">AI is thinking...</span>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-[var(--color-border)]">
                <div className="
                    flex items-center gap-3
                    px-4 py-3
                    bg-[var(--color-bg-tertiary)]
                    rounded-2xl
                    border border-[var(--color-border)]
                    focus-within:border-[var(--color-primary)]
                    focus-within:ring-2 focus-within:ring-[var(--color-primary-light)]
                    transition-all duration-200
                ">
                    <IconButton
                        icon={<Paperclip size={18} />}
                        size="sm"
                        variant="ghost"
                        tooltip="Attach file"
                    />
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Try: 'Plan a Thailand trip' or 'Find flights to Bangkok'"
                        className="
                            flex-1
                            bg-transparent
                            text-sm
                            text-[var(--color-text-primary)]
                            placeholder:text-[var(--color-text-muted)]
                            outline-none
                        "
                    />
                    <IconButton
                        icon={<Mic size={18} />}
                        size="sm"
                        variant="ghost"
                        tooltip="Voice input"
                    />
                    <IconButton
                        icon={<Send size={18} />}
                        size="sm"
                        variant="primary"
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        tooltip="Send message"
                    />
                </div>
            </div>
        </motion.div>
    );
};
