import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Send } from 'lucide-react';

interface InlineAIInputProps {
    onSubmit?: (message: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export const InlineAIInput: React.FC<InlineAIInputProps> = ({
    onSubmit,
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

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="chat-input-v2"
        >
            <form onSubmit={handleSubmit} className="chat-input-form">
                <div className={`chat-input-container ${isFocused ? 'focused' : ''}`}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="chat-input-field"
                    />

                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading || !inputValue.trim()}
                        className={`chat-send-btn ${inputValue.trim() ? 'active' : ''}`}
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="chat-loading-spinner"
                            />
                        ) : (
                            <Send size={18} />
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};
