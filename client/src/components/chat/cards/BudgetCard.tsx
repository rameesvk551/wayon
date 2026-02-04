import { type CSSProperties } from 'react';
import { DollarSign } from 'lucide-react';

interface BudgetCardProps {
    onSelect: (budget: string) => void;
    selected: string | null;
}

export const BudgetCard = ({ onSelect, selected }: BudgetCardProps) => {
    const options = [
        { id: 'economy', label: 'Economy', emoji: '\uD83D\uDCB5', color: '#22C55E' },
        { id: 'normal', label: 'Normal', emoji: '\uD83D\uDCB0', color: '#F59E0B' },
        { id: 'luxury', label: 'Luxury', emoji: '\uD83D\uDC8E', color: '#A855F7' },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <DollarSign size={20} className="text-[var(--color-primary)]" />
                <h3>Your Budget</h3>
            </div>
            <p className="interactive-card-subtitle">Select your preferred budget type</p>

            <div className="interactive-options-grid three-col">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => onSelect(opt.id)}
                        className={`interactive-option-card ${selected === opt.id ? 'selected' : ''}`}
                        style={{ '--option-color': opt.color } as CSSProperties}
                    >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span>{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
