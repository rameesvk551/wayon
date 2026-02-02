import { createContext, useContext, useState, ReactNode } from 'react';

// Wizard step data types
export interface WizardData {
    freeTime: string | null;
    companions: string | null;
    dates: { month: string; year: string; flexible: boolean } | null;
    interests: string[];
}

interface TripWizardContextType {
    currentStep: number;
    totalSteps: number;
    wizardData: WizardData;
    isComplete: boolean;
    goToStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setFreeTime: (value: string) => void;
    setCompanions: (value: string) => void;
    setDates: (dates: { month: string; year: string; flexible: boolean }) => void;
    toggleInterest: (interest: string) => void;
    completeWizard: () => void;
    resetWizard: () => void;
    getSummary: () => string;
}

const TripWizardContext = createContext<TripWizardContextType | undefined>(undefined);

const initialData: WizardData = {
    freeTime: null,
    companions: null,
    dates: null,
    interests: []
};

export const TripWizardProvider = ({ children }: { children: ReactNode }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [wizardData, setWizardData] = useState<WizardData>(initialData);
    const [isComplete, setIsComplete] = useState(false);
    const totalSteps = 4;

    const goToStep = (step: number) => {
        if (step >= 0 && step < totalSteps) {
            setCurrentStep(step);
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const setFreeTime = (value: string) => {
        setWizardData(prev => ({ ...prev, freeTime: value }));
    };

    const setCompanions = (value: string) => {
        setWizardData(prev => ({ ...prev, companions: value }));
    };

    const setDates = (dates: { month: string; year: string; flexible: boolean }) => {
        setWizardData(prev => ({ ...prev, dates }));
    };

    const toggleInterest = (interest: string) => {
        setWizardData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const completeWizard = () => {
        setIsComplete(true);
    };

    const resetWizard = () => {
        setCurrentStep(0);
        setWizardData(initialData);
        setIsComplete(false);
    };

    const getSummary = (): string => {
        const { freeTime, companions, dates, interests } = wizardData;
        let summary = "I want to plan a trip";
        
        if (freeTime) {
            summary += ` for ${freeTime}`;
        }
        if (companions) {
            summary += `, traveling ${companions}`;
        }
        if (dates) {
            summary += dates.flexible 
                ? `, around ${dates.month} ${dates.year} (flexible dates)`
                : `, in ${dates.month} ${dates.year}`;
        }
        if (interests.length > 0) {
            summary += `. I'm interested in ${interests.join(', ')}`;
        }
        
        return summary + ".";
    };

    return (
        <TripWizardContext.Provider value={{
            currentStep,
            totalSteps,
            wizardData,
            isComplete,
            goToStep,
            nextStep,
            prevStep,
            setFreeTime,
            setCompanions,
            setDates,
            toggleInterest,
            completeWizard,
            resetWizard,
            getSummary
        }}>
            {children}
        </TripWizardContext.Provider>
    );
};

export const useTripWizard = () => {
    const context = useContext(TripWizardContext);
    if (!context) {
        throw new Error('useTripWizard must be used within a TripWizardProvider');
    }
    return context;
};
