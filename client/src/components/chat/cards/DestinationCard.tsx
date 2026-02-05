import { useState } from 'react';
import { MapPin, Check } from 'lucide-react';

interface DestinationCardProps {
    onSelect: (destination: string) => void;
    selected: string | null;
}

export const DestinationCard = ({ onSelect, selected }: DestinationCardProps) => {
    const [inputValue, setInputValue] = useState(selected || '');

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <MapPin size={20} className="text-[var(--color-primary)]" />
                <h3>Where do you want to go?</h3>
            </div>
            <p className="interactive-card-subtitle">Enter your destination to get started</p>

            <div className="interactive-input-wrapper">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="City, Country"
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
        </div>
    );
};
