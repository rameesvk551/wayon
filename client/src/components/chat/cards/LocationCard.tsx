import { useState } from 'react';
import { Navigation, Check } from 'lucide-react';

interface LocationCardProps {
    onSelect: (location: string) => void;
    selected: string | null;
}

export const LocationCard = ({ onSelect, selected }: LocationCardProps) => {
    const [inputValue, setInputValue] = useState(selected || '');

    const popularLocations = [
        { id: 'delhi', label: 'Delhi, India', emoji: '\uD83C\uDDEE\uD83C\uDDF3' },
        { id: 'mumbai', label: 'Mumbai, India', emoji: '\uD83C\uDDEE\uD83C\uDDF3' },
        { id: 'bangalore', label: 'Bangalore, India', emoji: '\uD83C\uDDEE\uD83C\uDDF3' },
        { id: 'chennai', label: 'Chennai, India', emoji: '\uD83C\uDDEE\uD83C\uDDF3' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Navigation size={20} className="text-[var(--color-primary)]" />
                <h3>Where are you from?</h3>
            </div>
            <p className="interactive-card-subtitle">Enter your current location for better travel planning</p>

            <div className="interactive-input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., Delhi, Mumbai, New York..."
                    className="interactive-input"
                />
                {inputValue && (
                    <button
                        onClick={() => onSelect(inputValue)}
                        className="interactive-input-btn"
                    >
                        <Check size={18} />
                    </button>
                )}
            </div>

            <div className="interactive-options-row">
                {popularLocations.map((loc) => (
                    <button
                        key={loc.id}
                        onClick={() => {
                            setInputValue(loc.label);
                            onSelect(loc.label);
                        }}
                        className={`interactive-chip ${selected === loc.label ? 'selected' : ''}`}
                    >
                        <span>{loc.emoji}</span>
                        <span>{loc.label.split(',')[0]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
