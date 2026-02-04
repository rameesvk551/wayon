import { motion } from 'framer-motion';
import { Wallet, CreditCard, Diamond, Compass } from 'lucide-react';
import { WizardStepCard } from '../../molecules/WizardStepCard';
import { useTripWizard } from '../../../store/TripWizardContext';

const travelStyles = [
    { id: 'budget', label: 'Budget', icon: Wallet, color: '#22C55E', desc: 'Save more, explore more' },
    { id: 'mid-range', label: 'Mid-Range', icon: CreditCard, color: '#3B82F6', desc: 'Balance comfort & cost' },
    { id: 'luxury', label: 'Luxury', icon: Diamond, color: '#A855F7', desc: 'Premium experiences' },
    { id: 'adventure', label: 'Adventure', icon: Compass, color: '#F97316', desc: 'Thrill-seeking trips' },
];

export const TravelStyleStep: React.FC = () => {
    const { wizardData, setTravelStyle } = useTripWizard();

    return (
        <WizardStepCard
            title="What's your travel style?"
            subtitle="Choose how you like to travel"
            icon={<Compass size={36} />}
        >
            <div className="wizard-options-grid">
                {travelStyles.map((style, index) => {
                    const Icon = style.icon;
                    const isSelected = wizardData.travelStyle === style.id;

                    return (
                        <motion.button
                            key={style.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setTravelStyle(style.id)}
                            className={`wizard-option-card ${isSelected ? 'selected' : ''}`}
                            style={{
                                '--option-color': style.color,
                                backgroundColor: isSelected ? style.color : undefined,
                            } as React.CSSProperties}
                        >
                            <Icon
                                size={32}
                                style={{ color: isSelected ? 'white' : style.color }}
                            />
                            <span className={`wizard-option-label ${isSelected ? 'selected' : ''}`}>
                                {style.label}
                            </span>
                            <span className={`wizard-option-desc ${isSelected ? 'selected' : ''}`}>
                                {style.desc}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </WizardStepCard>
    );
};

export default TravelStyleStep;
