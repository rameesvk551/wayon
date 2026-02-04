import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Plane, X } from 'lucide-react';
import { TripWizardProvider, useTripWizard } from '../../store/TripWizardContext';
import { DestinationStep, FreeTimeStep, CompanionsStep, BudgetStep, TravelStyleStep, DatesStep, InterestsStep } from './wizard';

interface TripWizardProps {
    onComplete: (summary: string) => void;
    onClose?: () => void;
}

const WizardContent: React.FC<TripWizardProps> = ({ onComplete, onClose }) => {
    const {
        currentStep,
        totalSteps,
        wizardData,
        nextStep,
        prevStep,
        completeWizard,
        getSummary
    } = useTripWizard();

    const canProceed = () => {
        switch (currentStep) {
            case 0: return wizardData.destination !== null && wizardData.destination.trim() !== '';
            case 1: return wizardData.freeTime !== null;
            case 2: return wizardData.companions !== null;
            case 3: return wizardData.budget !== null;
            case 4: return wizardData.travelStyle !== null;
            case 5: return wizardData.dates !== null;
            case 6: return wizardData.interests.length >= 2;
            default: return false;
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            nextStep();
        } else {
            completeWizard();
            onComplete(getSummary());
        }
    };

    const steps = [
        <DestinationStep key="destination" />,
        <FreeTimeStep key="freetime" />,
        <CompanionsStep key="companions" />,
        <BudgetStep key="budget" />,
        <TravelStyleStep key="travelstyle" />,
        <DatesStep key="dates" />,
        <InterestsStep key="interests" />
    ];

    return (
        <div className="mobile-app-container">
            {/* Header with Logo */}
            <header className="wizard-header">
                <div className="flex items-center gap-3">
                    <div className="wizard-logo-icon">
                        <Plane size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="wizard-header-title">
                            AI Trip Planner
                        </h1>
                        <p className="wizard-header-subtitle">
                            Let's plan your dream trip
                        </p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="wizard-close-btn">
                        <X size={24} />
                    </button>
                )}
            </header>

            {/* Progress Indicator */}
            <div className="px-8 py-4">
                <div className="max-w-2xl mx-auto">
                    {/* Step Dots */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                        {Array.from({ length: totalSteps }).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={false}
                                animate={{
                                    scale: index === currentStep ? 1.2 : 1,
                                    backgroundColor: index <= currentStep
                                        ? 'var(--color-primary)'
                                        : 'var(--color-border)'
                                }}
                                className={`
                                    w-3 h-3 rounded-full
                                    ${index === currentStep ? 'ring-4 ring-[var(--color-primary-light)]' : ''}
                                `}
                            />
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-[var(--color-border-light)] rounded-full overflow-hidden">
                        <motion.div
                            initial={false}
                            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                        />
                    </div>

                    {/* Step Label */}
                    <div className="text-center mt-3">
                        <span className="text-sm font-medium text-[var(--color-text-muted)]">
                            Step {currentStep + 1} of {totalSteps}
                        </span>
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 px-8 py-8 flex items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="w-full"
                    >
                        {steps[currentStep]}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <footer className="px-8 py-6 bg-white/80 backdrop-blur-lg border-t border-[var(--color-border-light)]">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    {/* Back Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-xl
                            font-medium transition-all duration-200
                            ${currentStep === 0
                                ? 'text-[var(--color-text-light)] cursor-not-allowed'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]'
                            }
                        `}
                    >
                        <ArrowLeft size={18} />
                        Back
                    </motion.button>

                    {/* Next/Complete Button */}
                    <motion.button
                        whileHover={canProceed() ? { scale: 1.02, y: -1 } : {}}
                        whileTap={canProceed() ? { scale: 0.98 } : {}}
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`
                            flex items-center gap-2 px-8 py-3.5 rounded-xl
                            font-semibold text-lg transition-all duration-200
                            ${canProceed()
                                ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-lg hover:shadow-xl'
                                : 'bg-[var(--color-border)] text-[var(--color-text-light)] cursor-not-allowed'
                            }
                        `}
                    >
                        {currentStep === totalSteps - 1 ? (
                            <>
                                <Sparkles size={20} />
                                Start Planning
                            </>
                        ) : (
                            <>
                                Continue
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </div>
            </footer>
        </div>
    );
};

// Wrapper with Provider
export const TripWizard: React.FC<TripWizardProps> = (props) => {
    return (
        <TripWizardProvider>
            <WizardContent {...props} />
        </TripWizardProvider>
    );
};
