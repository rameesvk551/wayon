import { Users, Heart, User } from 'lucide-react';

interface CompanionsCardProps {
    onSelect: (companions: string) => void;
    selected: string | null;
}

export const CompanionsCard = ({ onSelect, selected }: CompanionsCardProps) => {
    const options = [
        { id: 'solo', label: 'Solo', icon: User },
        { id: 'couple', label: 'Couple', icon: Heart },
        { id: 'family', label: 'Family', icon: Users },
        { id: 'friends', label: 'Friends', icon: Users },
    ];

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Users size={20} className="text-[var(--color-primary)]" />
                <h3>Travel Companions</h3>
            </div>
            <p className="interactive-card-subtitle">Select your travel group type</p>

            <div className="interactive-options-grid">
                {options.map((opt) => {
                    const Icon = opt.icon;
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onSelect(opt.id)}
                            className={`interactive-option-card ${selected === opt.id ? 'selected' : ''}`}
                        >
                            <Icon size={24} />
                            <span>{opt.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
