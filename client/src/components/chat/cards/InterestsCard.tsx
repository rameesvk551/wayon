import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

interface InterestsCardProps {
    onSelect: (interests: string[]) => void;
    selectedInterests: string[];
}

export const InterestsCard = ({ onSelect, selectedInterests }: InterestsCardProps) => {
    const [interests, setInterests] = useState<string[]>(selectedInterests);

    const options = [
        { id: 'historical', label: 'Historical', emoji: '\uD83C\uDFDB\uFE0F' },
        { id: 'culture', label: 'Art & Culture', emoji: '\uD83C\uDFA8' },
        { id: 'nature', label: 'Nature', emoji: '\uD83C\uDF3F' },
        { id: 'food', label: 'Food & Dining', emoji: '\uD83C\uDF7D\uFE0F' },
        { id: 'shopping', label: 'Shopping', emoji: '\uD83D\uDECD\uFE0F' },
        { id: 'adventure', label: 'Adventure', emoji: '\uD83E\uDDD7' },
        { id: 'nightlife', label: 'Nightlife', emoji: '\uD83C\uDF89' },
        { id: 'relaxation', label: 'Relaxation', emoji: '\uD83E\uDDD8' },
    ];

    const toggleInterest = (id: string) => {
        const newInterests = interests.includes(id)
            ? interests.filter((i) => i !== id)
            : [...interests, id];
        setInterests(newInterests);
    };

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Sparkles size={20} className="text-[var(--color-primary)]" />
                <h3>Your Interests</h3>
            </div>
            <p className="interactive-card-subtitle">Select activities you enjoy (at least 2)</p>

            <div className="interactive-interests-grid">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => toggleInterest(opt.id)}
                        className={`interactive-interest-chip ${interests.includes(opt.id) ? 'selected' : ''}`}
                    >
                        <span>{opt.emoji}</span>
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>

            {interests.length >= 2 && (
                <button onClick={() => onSelect(interests)} className="interactive-confirm-btn">
                    <Check size={18} />
                    Confirm {interests.length} interests
                </button>
            )}
        </div>
    );
};
