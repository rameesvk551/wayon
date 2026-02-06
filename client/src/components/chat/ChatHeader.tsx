import { motion } from 'framer-motion';
import { Sparkles, MoreVertical, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
    onNavigate?: (tab: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onNavigate }) => {
    return (
        <header className="chat-header-v2">
            {/* Background decoration */}
            <div className="chat-header-bg"></div>

            <div className="chat-header-content">
                {/* AI Avatar with animated ring */}
                <div className="chat-avatar-container">
                    <motion.div
                        className="chat-avatar-ring"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="chat-avatar-inner">
                        <Sparkles size={22} className="text-white" />
                    </div>
                    <span className="chat-status-badge">AI</span>
                </div>

                {/* Title & Status */}
                <div className="chat-header-info">
                    <h1>Trip Planner AI</h1>
                    <div className="chat-status">
                        <span className="chat-status-dot"></span>
                        <span>Online • Ready to help</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="chat-header-actions-v2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="chat-action-btn"
                        onClick={() => onNavigate?.('call')}
                        aria-label="Voice call"
                    >
                        <Phone size={18} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="chat-action-btn"
                        onClick={() => onNavigate?.('video')}
                        aria-label="Video call"
                    >
                        <Video size={18} />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="chat-action-btn"
                        onClick={() => onNavigate?.('profile')}
                        aria-label="More options"
                    >
                        <MoreVertical size={18} />
                    </motion.button>
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
