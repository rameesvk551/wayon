import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '../../types';
import { Avatar } from '../atoms';

interface ChatBubbleProps {
    message: ChatMessage;
    onSuggestionClick?: (suggestion: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
    message,
    onSuggestionClick
}) => {
    const isAI = message.type === 'ai';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                {isAI ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white shadow-md">
                        <Bot size={18} />
                    </div>
                ) : (
                    <Avatar name="You" size="sm" />
                )}
            </div>

            {/* Bubble */}
            <div className={`flex-1 max-w-[85%] ${isAI ? '' : 'flex flex-col items-end'}`}>
                <div
                    className={`
            px-4 py-3
            rounded-2xl
            ${isAI
                            ? 'bg-white border border-[var(--color-border)] rounded-tl-sm'
                            : 'bg-[var(--color-primary)] text-white rounded-tr-sm'
                        }
            shadow-sm
          `}
                >
                    <div
                        className={`text-sm leading-relaxed whitespace-pre-wrap ${isAI ? 'text-[var(--color-text-primary)]' : ''}`}
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                </div>

                {/* Suggestions */}
                {isAI && message.suggestions && message.suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex flex-wrap gap-2 mt-3"
                    >
                        {message.suggestions.map((suggestion, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onSuggestionClick?.(suggestion)}
                                className="
                  px-3 py-1.5
                  text-sm font-medium
                  text-[var(--color-primary)]
                  bg-[var(--color-primary-light)]/30
                  hover:bg-[var(--color-primary-light)]
                  border border-[var(--color-primary)]/20
                  rounded-full
                  transition-colors duration-200
                "
                            >
                                {suggestion}
                            </motion.button>
                        ))}
                    </motion.div>
                )}

                {/* Timestamp */}
                <span className="text-[10px] text-[var(--color-text-muted)] mt-1.5 block">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </motion.div>
    );
};

// Format message content with basic markdown
function formatMessage(content: string): string {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
}

// Format timestamp
function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}
