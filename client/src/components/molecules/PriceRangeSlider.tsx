import React, { useCallback } from 'react';

interface PriceRangeSliderProps {
    min: number;
    max: number;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    currency?: string;
}

export const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
    min,
    max,
    value,
    onChange,
    currency = '$',
}) => {
    const leftPercent = ((value[0] - min) / (max - min)) * 100;
    const rightPercent = ((value[1] - min) / (max - min)) * 100;

    const handleMinChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = Math.min(Number(e.target.value), value[1] - 10);
            onChange([v, value[1]]);
        },
        [value, onChange]
    );

    const handleMaxChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = Math.max(Number(e.target.value), value[0] + 10);
            onChange([value[0], v]);
        },
        [value, onChange]
    );

    return (
        <div className="price-range-slider">
            <div className="price-range-labels">
                <span className="price-range-value">
                    {currency}{value[0]}
                </span>
                <span className="price-range-separator">—</span>
                <span className="price-range-value">
                    {currency}{value[1]}{value[1] >= max ? '+' : ''}
                </span>
            </div>
            <div className="price-range-track-container">
                <div className="price-range-track" />
                <div
                    className="price-range-fill"
                    style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[0]}
                    onChange={handleMinChange}
                    className="price-range-thumb"
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={value[1]}
                    onChange={handleMaxChange}
                    className="price-range-thumb"
                />
            </div>
        </div>
    );
};

export default PriceRangeSlider;
