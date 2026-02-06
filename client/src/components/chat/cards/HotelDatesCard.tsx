import { useMemo, useState } from 'react';
import { Calendar, Check } from 'lucide-react';

interface HotelDatesCardProps {
    onSelect: (dates: string) => void;
    selected: string | null;
}

const isValidDateRange = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return false;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return false;
    return outDate > inDate;
};

export const HotelDatesCard = ({ onSelect, selected }: HotelDatesCardProps) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    const canConfirm = useMemo(() => isValidDateRange(checkIn, checkOut), [checkIn, checkOut]);
    const showInvalid = Boolean(checkIn && checkOut && !canConfirm);

    const handleConfirm = () => {
        if (!canConfirm) return;
        onSelect(`${checkIn} to ${checkOut}`);
    };

    return (
        <div className="interactive-card">
            <div className="interactive-card-header">
                <Calendar size={20} className="text-[var(--color-primary)]" />
                <h3>Check-in & Check-out</h3>
            </div>
            <p className="interactive-card-subtitle">Select your stay dates</p>

            <div className="interactive-select-group">
                <label className="interactive-select">
                    <span className="sr-only">Check-in date</span>
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        aria-label="Check-in date"
                        className="w-full bg-transparent outline-none"
                    />
                </label>

                <label className="interactive-select">
                    <span className="sr-only">Check-out date</span>
                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        aria-label="Check-out date"
                        className="w-full bg-transparent outline-none"
                    />
                </label>
            </div>

            {showInvalid && (
                <p className="text-sm text-red-500">Check-out must be after check-in.</p>
            )}

            {canConfirm && (
                <button onClick={handleConfirm} className="interactive-confirm-btn">
                    <Check size={18} />
                    Confirm: {checkIn} to {checkOut}
                </button>
            )}

            {selected && (
                <p className="text-xs text-[var(--color-text-muted)]">Selected: {selected}</p>
            )}
        </div>
    );
};
