import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { WizardStepCard } from '../../molecules/WizardStepCard';
import { useTripWizard } from '../../../store/TripWizardContext';

const presetAmounts = [500, 1000, 2000, 5000];

export const BudgetStep: React.FC = () => {
    const { wizardData, setBudget } = useTripWizard();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            setBudget(parseInt(value, 10));
        } else {
            setBudget(null);
        }
    };

    return (
        <WizardStepCard
            title="What's your budget?"
            subtitle="Total budget for your trip"
            icon={<DollarSign size={36} />}
        >
            <div className="wizard-budget-content">
                {/* Budget Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="wizard-budget-input-container"
                >
                    <span className="wizard-currency-symbol">$</span>
                    <input
                        type="text"
                        value={wizardData.budget || ''}
                        onChange={handleInputChange}
                        placeholder="1000"
                        className="wizard-budget-input"
                    />
                </motion.div>

                {/* Preset Amounts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="wizard-budget-presets"
                >
                    {presetAmounts.map((amount) => (
                        <button
                            key={amount}
                            onClick={() => setBudget(amount)}
                            className={`wizard-budget-preset ${wizardData.budget === amount ? 'selected' : ''}`}
                        >
                            ${amount.toLocaleString()}
                        </button>
                    ))}
                </motion.div>
            </div>
        </WizardStepCard>
    );
};

export default BudgetStep;
