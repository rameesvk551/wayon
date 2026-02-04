import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';

interface DatesCardProps {
    onSelect: (dates: string) => void;
    selected: string | null;
}

export const DatesCard = ({ onSelect }: DatesCardProps) => {
    const [month, setMonth] = useState('');
    const [duration, setDuration] = useState('');

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const durations = ['3 days', '5 days', '1 week', '2 weeks'];

    const handleConfirm = () => {
        if (month && duration) {
            onSelect(`${duration} in ${month}`);
        }
    };

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Calendar size={20} className="text-[var(--color-primary)]" />
                <h3>When are you traveling?</h3>
            </div>
            <p className="interactive-card-subtitle">Select month and duration</p>

            <div className="interactive-select-group">
                <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="interactive-select"
                >
                    <option value="">Select month</option>
                    {months.map((m) => (
                        <option key={m} value={m}>{m} 2026</option>
                    ))}
                </select>

                <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="interactive-select"
                >
                    <option value="">Select duration</option>
                    {durations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>
            </div>

            {month && duration && (
                <button onClick={handleConfirm} className="interactive-confirm-btn">
                    <Check size={18} />
                    Confirm: {duration} in {month}
                </button>
            )}
        </div>
    );
};
