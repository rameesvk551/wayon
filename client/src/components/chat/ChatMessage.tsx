import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import type { Message, TripPreferences, Attraction } from '../../types/chat';
import type { CollectInputBlock, UIResponse, AttractionItem } from '../../types/ui-schema';
import { ChatRenderer } from '../renderer/ChatRenderer';
import { ItineraryDisplay, ItinerarySkeleton } from '../organisms/ItineraryDisplay';
import {
    DestinationCard,
    CompanionsCard,
    BudgetCard,
    DatesCard,
    HotelDatesCard,
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
    onHotelDatesSelect: (dates: string) => void;
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
    onHotelDatesSelect,
    onLocationSelect,
    onTransportSelect,
    onInterestsSelect,
    onAttractionsContinue,
}) => {
    const isInputMissing = (input: CollectInputBlock['inputs'][number]) => {
        switch (input) {
            case 'destination':
                return !preferences.destination;
            case 'companions':
                return !preferences.companions;
            case 'budget':
                return !preferences.budget;
            case 'dates':
            case 'hotel_dates':
                return !preferences.dates;
            case 'location':
                return !preferences.currentLocation;
            case 'transport':
                return !preferences.transportMode;
            case 'interests':
                return preferences.interests.length < 2;
            default:
                return true;
        }
    };

    const handleAttractionBlockSubmit = (items: AttractionItem[]) => {
        const mapped: Attraction[] = items.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            rating: item.rating,
            duration: item.duration || 'Flexible visit',
            price: item.price || 'Free',
            image: item.image || '',
            description: item.description || 'A must-see attraction.',
            lat: item.lat,
            lng: item.lng
        }));

        onAttractionsContinue(mapped);
    };

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
            case 'hotel_dates':
                return <HotelDatesCard onSelect={onHotelDatesSelect} selected={preferences.dates} />;
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
        const collectBlocks = message.blocks?.blocks?.filter(
            (block): block is CollectInputBlock => block.type === 'collect_input'
        ) ?? [];
        const collectInputs = Array.from(new Set(
            collectBlocks.flatMap((block) => block.inputs)
        ));
        const renderableBlocks = message.blocks?.blocks?.filter(
            (block) => block.type !== 'collect_input'
        ) ?? [];
        const renderableResponse: UIResponse | undefined = renderableBlocks.length
            ? { ...message.blocks!, blocks: renderableBlocks }
            : undefined;

        const renderCollectCards = () => {
            if (collectInputs.length === 0) return null;
            const pendingInputs = collectInputs.filter(isInputMissing);
            if (pendingInputs.length === 0) return null;
            return (
                <div className="mobile-chat-interactive">
                    {pendingInputs.map((input) => (
                        <div key={`collect-${input}`}>
                            {renderInteractiveCard(input)}
                        </div>
                    ))}
                </div>
            );
        };

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
                </div>
                {message.type === 'ai' && renderableResponse && (
                    <div className="mobile-chat-interactive">
                        <ChatRenderer
                            response={renderableResponse}
                            onAction={(actionId) => console.log('Action:', actionId)}
                            onAttractionsSubmit={handleAttractionBlockSubmit}
                        />
                    </div>
                )}
                {message.type === 'ai' && renderCollectCards()}
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
