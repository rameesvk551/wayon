export interface Country {
    code: string;
    name: string;
    flag: string;
    region: string;
    popular: boolean;
}

export const regions = [
    'All Regions',
    'Asia',
    'Europe',
    'Americas',
    'Africa',
    'Oceania',
    'Middle East',
] as const;

export type Region = (typeof regions)[number];

export const countries: Country[] = [
    // Asia
    { code: 'IN', name: 'India', flag: '🇮🇳', region: 'Asia', popular: true },
    { code: 'CN', name: 'China', flag: '🇨🇳', region: 'Asia', popular: true },
    { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'Asia', popular: true },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'Asia', popular: true },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'Asia', popular: true },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', popular: true },
    { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', popular: true },
    { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', popular: false },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'Asia', popular: true },
    { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'Asia', popular: false },
    { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia', popular: false },
    { code: 'NP', name: 'Nepal', flag: '🇳🇵', region: 'Asia', popular: false },
    { code: 'MM', name: 'Myanmar', flag: '🇲🇲', region: 'Asia', popular: false },
    { code: 'KH', name: 'Cambodia', flag: '🇰🇭', region: 'Asia', popular: false },
    { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia', popular: false },

    // Europe
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', popular: true },
    { code: 'FR', name: 'France', flag: '🇫🇷', region: 'Europe', popular: true },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'Europe', popular: true },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'Europe', popular: true },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'Europe', popular: true },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', popular: false },
    { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', popular: true },
    { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'Europe', popular: false },
    { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'Europe', popular: true },
    { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'Europe', popular: true },
    { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'Europe', popular: false },
    { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', popular: false },
    { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'Europe', popular: false },
    { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'Europe', popular: false },
    { code: 'RU', name: 'Russia', flag: '🇷🇺', region: 'Europe', popular: false },

    // Americas
    { code: 'US', name: 'United States', flag: '🇺🇸', region: 'Americas', popular: true },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'Americas', popular: true },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'Americas', popular: true },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'Americas', popular: true },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'Americas', popular: false },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'Americas', popular: false },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'Americas', popular: false },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'Americas', popular: false },
    { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'Americas', popular: false },

    // Africa
    { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'Africa', popular: true },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'Africa', popular: true },
    { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'Africa', popular: false },
    { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'Africa', popular: true },
    { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'Africa', popular: false },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', popular: false },
    { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa', popular: false },
    { code: 'MU', name: 'Mauritius', flag: '🇲🇺', region: 'Africa', popular: true },

    // Oceania
    { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'Oceania', popular: true },
    { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', popular: true },
    { code: 'FJ', name: 'Fiji', flag: '🇫🇯', region: 'Oceania', popular: false },
    { code: 'MV', name: 'Maldives', flag: '🇲🇻', region: 'Oceania', popular: true },

    // Middle East
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', popular: true },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', popular: true },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', popular: false },
    { code: 'OM', name: 'Oman', flag: '🇴🇲', region: 'Middle East', popular: false },
    { code: 'JO', name: 'Jordan', flag: '🇯🇴', region: 'Middle East', popular: false },
    { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'Middle East', popular: false },
    { code: 'BH', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East', popular: false },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East', popular: false },
];

export const getCountryByCode = (code: string): Country | undefined =>
    countries.find((c) => c.code === code);

export const getCountriesByRegion = (region: string): Country[] =>
    region === 'All Regions' ? countries : countries.filter((c) => c.region === region);

export const searchCountries = (query: string): Country[] => {
    const q = query.toLowerCase().trim();
    if (!q) return countries;
    return countries.filter(
        (c) =>
            c.name.toLowerCase().includes(q) ||
            c.code.toLowerCase().includes(q)
    );
};
