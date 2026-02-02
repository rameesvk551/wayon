import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MapPin, Plus, Sparkles } from 'lucide-react';

interface ChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    placeholder?: string;
    disabled?: boolean;
    isTyping?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    value,
    onChange,
    onSend,
    placeholder = "Ask about flights, hotels, visas, weather…",
    disabled = false,
    isTyping = false
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && !disabled) {
            e.preventDefault();
            onSend();
        }
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="
                sticky bottom-0
                px-4 py-4
                bg-gradient-to-t from-white via-white to-white/80
                backdrop-blur-sm
            "
        >
            <div className={`
                relative
                flex items-center gap-2
                px-4 py-3
                bg-white
                border-2 ${isFocused ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'}
                rounded-2xl
                shadow-lg
                transition-all duration-200
                ${isFocused ? 'shadow-[var(--shadow-card-hover)]' : 'shadow-[var(--shadow-md)]'}
            `}>
                {/* Left Action Buttons */}
                <div className="flex items-center gap-1">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="
                            p-2 rounded-xl
                            text-[var(--color-text-muted)]
                            hover:text-[var(--color-primary)]
                            hover:bg-[var(--color-primary-subtle)]
                            transition-colors duration-200
                        "
                        title="Add tools"
                    >
                        <Plus size={18} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="
                            p-2 rounded-xl
                            text-[var(--color-text-muted)]
                            hover:text-[var(--color-secondary)]
                            hover:bg-[var(--color-secondary-subtle)]
                            transition-colors duration-200
                        "
                        title="Location"
                    >
                        <MapPin size={18} />
                    </motion.button>
                </div>

                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="
                        flex-1
                        bg-transparent
                        text-[15px]
                        text-[var(--color-text-primary)]
                        placeholder:text-[var(--color-text-muted)]
                        outline-none
                        disabled:opacity-50
                    "
                />

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="
                            p-2 rounded-xl
                            text-[var(--color-text-muted)]
                            hover:text-[var(--color-accent)]
                            hover:bg-[var(--color-accent-light)]
                            transition-colors duration-200
                        "
                        title="Voice input"
                    >
                        <Mic size={18} />
                    </motion.button>

                    {/* Send Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSend}
                        disabled={!value.trim() || disabled}
                        className={`
                            p-2.5 rounded-xl
                            transition-all duration-200
                            ${value.trim() && !disabled
                                ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-md hover:shadow-lg'
                                : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-light)] cursor-not-allowed'
                            }
                        `}
                        title="Send message"
                    >
                        {isTyping ? (
                            <Sparkles size={18} className="animate-pulse" />
                        ) : (
                            <Send size={18} />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Typing Indicator */}
            <AnimatePresence>
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="flex items-center justify-center gap-2 mt-2"
                    >
                        <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full"
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-[var(--color-text-muted)]">AI is thinking...</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
