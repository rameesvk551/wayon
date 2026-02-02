import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { Send, Sparkles, Route, MapPin, Clock, Utensils, Hotel } from 'lucide-react';

interface InlineAIInputProps {
    onSubmit?: (message: string) => void;
    onActionClick?: (action: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

const quickActions = [
    { id: 'optimize', label: 'Optimize route', icon: Route },
    { id: 'nearby', label: 'Add nearby attractions', icon: MapPin },
    { id: 'reduce-time', label: 'Reduce travel time', icon: Clock },
    { id: 'restaurants', label: 'Find restaurants', icon: Utensils },
    { id: 'hotels', label: 'Better hotels', icon: Hotel }
];

export const InlineAIInput: React.FC<InlineAIInputProps> = ({
    onSubmit,
    onActionClick,
    placeholder = "Ask AI to modify your trip...",
    isLoading = false
}) => {
    const [inputValue, setInputValue] = useState('');
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
            className="
                bg-white
                border-t border-[var(--color-border)]
                p-4
            "
        >
            {/* Quick Actions */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
                {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onActionClick?.(action.id)}
                            disabled={isLoading}
                            className="
                                flex-shrink-0
                                inline-flex items-center gap-1.5
                                px-3 py-1.5
                                bg-[var(--color-primary-subtle)]
                                text-[var(--color-primary)]
                                text-xs font-medium
                                rounded-full
                                border border-transparent
                                hover:bg-[var(--color-primary-light)]
                                hover:border-[var(--color-primary)]
                                disabled:opacity-50
                                transition-all duration-200
                            "
                        >
                            <Icon size={12} />
                            {action.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative">
                <div className="
                    flex items-center gap-3
                    px-4 py-3
                    bg-[var(--color-bg-tertiary)]
                    border border-[var(--color-border)]
                    rounded-xl
                    focus-within:border-[var(--color-primary)]
                    focus-within:ring-2 focus-within:ring-[var(--color-primary-light)]
                    transition-all duration-200
                ">
                    {/* AI Icon */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                        <Sparkles size={14} className="text-white" />
                    </div>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isLoading}
                        className="
                            flex-1
                            bg-transparent
                            text-sm
                            text-[var(--color-text-primary)]
                            placeholder:text-[var(--color-text-muted)]
                            outline-none
                            disabled:opacity-50
                        "
                    />

                    {/* Send Button */}
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!inputValue.trim() || isLoading}
                        className="
                            flex-shrink-0
                            w-9 h-9
                            rounded-lg
                            bg-[var(--color-primary)]
                            text-white
                            flex items-center justify-center
                            disabled:opacity-50 disabled:cursor-not-allowed
                            hover:bg-[var(--color-primary-hover)]
                            transition-colors
                        "
                    >
                        {isLoading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                            />
                        ) : (
                            <Send size={16} />
                        )}
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};
