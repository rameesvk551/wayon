import { motion } from 'framer-motion';
import type { Country } from '../../data/countries';
import { getCountryByCode } from '../../data/countries';
import type { VisaInfo } from '../../data/visaData';
import VisaStatusBadge from './VisaStatusBadge';

interface CountryCardProps {
    visaInfo: VisaInfo;
    viewMode?: 'grid' | 'list';
    onClick?: () => void;
    index?: number;
}

const CountryCard: React.FC<CountryCardProps> = ({
    visaInfo,
    viewMode = 'list',
    onClick,
    index = 0,
}) => {
    const country: Country | undefined = getCountryByCode(visaInfo.to);

    if (!country) return null;

    return (
        <motion.button
            className={`visa-country-card visa-country-card--${viewMode}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            whileTap={{ scale: 0.97 }}
            type="button"
        >
            <div className="visa-country-card-flag">{country.flag}</div>
            <div className="visa-country-card-info">
                <span className="visa-country-card-name">{country.name}</span>
                <span className="visa-country-card-region">{country.region}</span>
            </div>
            <div className="visa-country-card-meta">
                <VisaStatusBadge status={visaInfo.status} size="sm" />
                <span className="visa-country-card-stay">{visaInfo.maxStay}</span>
            </div>
        </motion.button>
    );
};

export default CountryCard;
