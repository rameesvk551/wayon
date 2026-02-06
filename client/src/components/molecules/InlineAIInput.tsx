import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Send, Mic, Paperclip, Smile, Sparkles } from 'lucide-react';

interface InlineAIInputProps {
    onSubmit?: (message: string) => void;
    onActionClick?: (action: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

const suggestions = [
    "Plan my trip to Paris",
    "Find hotels near beach",
    "Best restaurants nearby",
    "Optimize my itinerary"
];

export const InlineAIInput: React.FC<InlineAIInputProps> = ({
    onSubmit,
    onActionClick,
    placeholder = "Ask anything about your trip...",
    isLoading = false
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim() && !isLoading) {
            onSubmit?.(inputValue);
            setInputValue('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        inputRef.current?.focus();
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="chat-input-v2"
        >
            {/* Suggestions - only show when focused and empty */}
            <AnimatePresence>
                {isFocused && !inputValue && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="chat-suggestions"
                    >
                        {suggestions.map((suggestion, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="chat-suggestion-chip"
                            >
                                <Sparkles size={12} />
                                {suggestion}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Input Area */}
            <form onSubmit={handleSubmit} className="chat-input-form">
                <div className={`chat-input-container ${isFocused ? 'focused' : ''}`}>
                    {/* Attachment Button */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onActionClick?.('attach')}
                        className="chat-input-action"
                    >
                        <Paperclip size={20} />
                    </motion.button>

                    {/* Input Field */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="chat-input-field"
                    />

                    {/* Emoji Button */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onActionClick?.('emoji')}
                        className="chat-input-action"
                    >
                        <Smile size={20} />
                    </motion.button>

                    {/* Send/Mic Button */}
                    <motion.button
                        type={inputValue.trim() ? "submit" : "button"}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={!inputValue.trim() ? () => onActionClick?.('voice') : undefined}
                        disabled={isLoading}
                        className={`chat-send-btn ${inputValue.trim() ? 'active' : ''}`}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="chat-loading-spinner"
                            />
                        ) : inputValue.trim() ? (
                            <Send size={18} />
                        ) : (
                            <Mic size={18} />
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};
