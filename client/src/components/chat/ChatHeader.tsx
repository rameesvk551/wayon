import { Bot, Heart, User } from 'lucide-react';

interface ChatHeaderProps {
    onNavigate?: (tab: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onNavigate }) => {
    return (
        <header className="mobile-chat-header">
            <div className="mobile-chat-header-left">
                <div className="mobile-chat-avatar">
                    <Bot size={24} className="text-white" />
                </div>
                <div>
                    <h1>AI Travel Assistant</h1>
                    <p>Always here to help</p>
                </div>
            </div>

            <div className="mobile-chat-header-actions">
                <button
                    className="chat-header-action"
                    onClick={() => onNavigate?.('favorites')}
                    aria-label="Open favorites"
                >
                    <Heart size={18} />
                </button>
                <button
                    className="chat-header-action"
                    onClick={() => onNavigate?.('profile')}
                    aria-label="Open profile"
                >
                    <User size={18} />
                </button>
            </div>
        </header>
    );
};

export default ChatHeader;
