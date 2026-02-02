import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Eye, ChevronRight } from 'lucide-react';

export interface WeatherData {
    location: string;
    temperature: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'partly_cloudy';
    humidity: number;
    wind: string;
    uvIndex: string;
    feelsLike?: number;
}

interface WeatherBlockProps extends Omit<WeatherData, never> {
    onForecastClick?: () => void;
}

const conditionIcons = {
    sunny: Sun,
    cloudy: Cloud,
    rainy: CloudRain,
    snowy: CloudSnow,
    partly_cloudy: Cloud,
};

const conditionStyles = {
    sunny: {
        gradient: 'from-amber-400 to-orange-500',
        bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
        border: 'border-amber-200',
    },
    cloudy: {
        gradient: 'from-gray-400 to-slate-500',
        bg: 'bg-gradient-to-br from-gray-50 to-slate-100',
        border: 'border-gray-200',
    },
    rainy: {
        gradient: 'from-blue-400 to-indigo-500',
        bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        border: 'border-blue-200',
    },
    snowy: {
        gradient: 'from-cyan-300 to-blue-400',
        bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
        border: 'border-cyan-200',
    },
    partly_cloudy: {
        gradient: 'from-sky-400 to-blue-500',
        bg: 'bg-gradient-to-br from-sky-50 to-blue-50',
        border: 'border-sky-200',
    },
};

export const WeatherBlock: React.FC<WeatherBlockProps> = ({
    location,
    temperature,
    condition,
    humidity,
    wind,
    uvIndex,
    feelsLike,
    onForecastClick
}) => {
    const Icon = conditionIcons[condition];
    const styles = conditionStyles[condition];
    const conditionText = condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`
                p-5 rounded-2xl
                ${styles.bg}
                border ${styles.border}
                shadow-sm
            `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🌍</span>
                        <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
                            {location} Weather
                        </h4>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">{conditionText}</p>
                </div>
                <div className={`
                    w-12 h-12 rounded-xl
                    bg-gradient-to-br ${styles.gradient}
                    flex items-center justify-center
                    shadow-md
                `}>
                    <Icon size={24} className="text-white" />
                </div>
            </div>

            {/* Temperature */}
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold text-[var(--color-text-primary)]">
                    {temperature}°C
                </span>
                {feelsLike && (
                    <span className="text-sm text-[var(--color-text-muted)]">
                        Feels like {feelsLike}°
                    </span>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <Droplets size={16} className="text-blue-500" />
                    <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Humidity</p>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{humidity}%</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wind size={16} className="text-gray-500" />
                    <div>
                        <p className="text-xs text-[var(--color-text-muted)]">Wind</p>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{wind}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Eye size={16} className="text-amber-500" />
                    <div>
                        <p className="text-xs text-[var(--color-text-muted)]">UV Index</p>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">{uvIndex}</p>
                    </div>
                </div>
            </div>

            {/* Forecast Link */}
            {onForecastClick && (
                <motion.button
                    whileHover={{ x: 4 }}
                    onClick={onForecastClick}
                    className="
                        flex items-center gap-1
                        text-sm font-medium text-[var(--color-primary)]
                        hover:underline
                    "
                >
                    View 5-day forecast
                    <ChevronRight size={16} />
                </motion.button>
            )}
        </motion.div>
    );
};
