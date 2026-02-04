import { type CSSProperties } from 'react';
import { Car, Bus, Train, Plane } from 'lucide-react';

interface TransportCardProps {
    onSelect: (transport: string) => void;
    selected: string | null;
}

export const TransportCard = ({ onSelect, selected }: TransportCardProps) => {
    const options = [
        { id: 'public', label: 'Public Transport', icon: Bus, color: '#22C55E' },
        { id: 'train', label: 'Train', icon: Train, color: '#3B82F6' },
        { id: 'private', label: 'Private Vehicle', icon: Car, color: '#A855F7' },
        { id: 'flight', label: 'Flight', icon: Plane, color: '#F97316' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Car size={20} className="text-[var(--color-primary)]" />
                <h3>Mode of Transportation</h3>
            </div>
            <p className="interactive-card-subtitle">How would you like to travel?</p>

            <div className="interactive-options-grid">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id)}
                            className={`interactive-option-card ${selected === opt.id ? 'selected' : ''}`}
                            style={{ '--option-color': opt.color } as CSSProperties}
                        >
                            <Icon size={28} style={{ color: selected === opt.id ? 'white' : opt.color }} />
                            <span>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
