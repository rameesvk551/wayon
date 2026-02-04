import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';

interface DestinationCardProps {
    onSelect: (destination: string) => void;
    selected: string | null;
}

export const DestinationCard = ({ onSelect, selected }: DestinationCardProps) => {
    const [inputValue, setInputValue] = useState(selected || '');

    const destinations = [
        { id: 'paris', label: 'Paris, France', emoji: '\uD83D\uDDFC' },
        { id: 'tokyo', label: 'Tokyo, Japan', emoji: '\uD83D\uDFBE' },
        { id: 'bali', label: 'Bali, Indonesia', emoji: '\uD83C\uDFDD\uFE0F' },
        { id: 'dubai', label: 'Dubai, UAE', emoji: '\uD83C\uDFD9\uFE0F' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <MapPin size={20} className="text-[var(--color-primary)]" />
                <h3>Where do you want to go?</h3>
            </div>
            <p className="interactive-card-subtitle">Enter a destination or choose from popular options</p>

            <div className="interactive-input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., Paris, Bali, Tokyo..."
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
                {destinations.map((dest) => (
                    <button
                        key={dest.id}
                        onClick={() => {
                            setInputValue(dest.label);
                            onSelect(dest.label);
                        }}
                        className={`interactive-chip ${selected === dest.label ? 'selected' : ''}`}
                    >
                        <span>{dest.emoji}</span>
                        <span>{dest.label.split(',')[0]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
