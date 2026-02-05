import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import type { Message, TripPreferences, Attraction } from '../../types/chat';
import { ChatRenderer } from '../renderer/ChatRenderer';
import { ItineraryDisplay, ItinerarySkeleton } from '../organisms/ItineraryDisplay';
import {
    DestinationCard,
    CompanionsCard,
    BudgetCard,
    DatesCard,
    LocationCard,
    TransportCard,
    InterestsCard,
    TripSummaryCard,
    AttractionsCard,
} from './cards';

interface ChatMessageProps {
    message: Message;
    preferences: TripPreferences;
    onDestinationSelect: (destination: string) => void;
    onCompanionsSelect: (companions: string) => void;
    onBudgetSelect: (budget: string) => void;
    onDatesSelect: (dates: string) => void;
    onLocationSelect: (location: string) => void;
    onTransportSelect: (transport: string) => void;
    onInterestsSelect: (interests: string[]) => void;
    onAttractionsContinue: (selectedAttractions: Attraction[]) => void;
}

const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    preferences,
    onDestinationSelect,
    onCompanionsSelect,
    onBudgetSelect,
    onDatesSelect,
    onLocationSelect,
    onTransportSelect,
    onInterestsSelect,
    onAttractionsContinue,
}) => {
    const renderInteractiveCard = (type: string) => {
        switch (type) {
            case 'destination':
                return <DestinationCard onSelect={onDestinationSelect} selected={preferences.destination} />;
            case 'companions':
                return <CompanionsCard onSelect={onCompanionsSelect} selected={preferences.companions} />;
            case 'budget':
                return <BudgetCard onSelect={onBudgetSelect} selected={preferences.budget} />;
            case 'dates':
                return <DatesCard onSelect={onDatesSelect} selected={preferences.dates} />;
            case 'location':
                return <LocationCard onSelect={onLocationSelect} selected={preferences.currentLocation} />;
            case 'transport':
                return <TransportCard onSelect={onTransportSelect} selected={preferences.transportMode} />;
            case 'attractions':
                return <AttractionsCard destination={preferences.destination || ''} onContinue={onAttractionsContinue} />;
            case 'interests':
                return <InterestsCard onSelect={onInterestsSelect} selectedInterests={preferences.interests} />;
            case 'summary':
                return <TripSummaryCard preferences={preferences} />;
            case 'itinerary':
                return null; // Handled separately
            default:
                return null;
        }
    };

    const renderMessageContent = () => {
        // Special handling for itinerary messages
        if (message.interactiveType === 'itinerary') {
            if (message.isLoading) {
                return (
                    <div className="mobile-chat-interactive">
                        <ItinerarySkeleton />
                    </div>
                );
            }
            if (message.itineraryData) {
                return (
                    <div className="mobile-chat-interactive">
                        <ItineraryDisplay 
                            itinerary={message.itineraryData}
                            preferences={{
                                companions: preferences.companions || undefined,
                                budget: preferences.budget || undefined,
                                interests: preferences.interests,
                            }}
                            transportMode={preferences.transportMode || undefined}
                        />
                    </div>
                );
            }
        }

        // Regular interactive cards
        if (message.type === 'interactive') {
            return (
                <div className="mobile-chat-interactive">
                    {renderInteractiveCard(message.interactiveType!)}
                </div>
            );
        }

        // Text + schema blocks (ai or user)
        return (
            <>
                <div className={`mobile-chat-bubble ${message.type}`}>
                    {message.content && <p>{message.content}</p>}
                    {message.type === 'ai' && message.blocks && (
                        <div className="mt-3">
                            <ChatRenderer
                                response={message.blocks}
                                onAction={(actionId) => console.log('Action:', actionId)}
                            />
                        </div>
                    )}
                </div>
                <span className="mobile-chat-time">
                    {formatTime(message.timestamp)}
                </span>
            </>
        );
    };

    return (
        <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`mobile-chat-message ${message.type}`}
        >
            {message.type === 'ai' && (
                <div className="mobile-chat-ai-avatar">
                    <Bot size={18} className="text-white" />
                </div>
            )}

            {renderMessageContent()}
        </motion.div>
    );
};

export default ChatMessage;
