import {
    Mountain, Palmtree, Landmark, Utensils, TreePine, PartyPopper,
    Camera, ShoppingBag, Music, Dumbbell, Waves, Building2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { WizardStepCard, InterestChip } from '../../molecules/WizardStepCard';
import { useTripWizard } from '../../../store/TripWizardContext';
import { Sparkles } from 'lucide-react';

const interestOptions = [
    { id: 'adventure', label: 'Adventure', icon: <Mountain size={18} /> },
    { id: 'relaxation', label: 'Relaxation', icon: <Palmtree size={18} /> },
    { id: 'culture', label: 'Culture & History', icon: <Landmark size={18} /> },
    { id: 'food', label: 'Food & Cuisine', icon: <Utensils size={18} /> },
    { id: 'nature', label: 'Nature', icon: <TreePine size={18} /> },
    { id: 'nightlife', label: 'Nightlife', icon: <PartyPopper size={18} /> },
    { id: 'photography', label: 'Photography', icon: <Camera size={18} /> },
    { id: 'shopping', label: 'Shopping', icon: <ShoppingBag size={18} /> },
    { id: 'music', label: 'Music & Festivals', icon: <Music size={18} /> },
    { id: 'wellness', label: 'Wellness & Spa', icon: <Dumbbell size={18} /> },
    { id: 'beach', label: 'Beach & Water', icon: <Waves size={18} /> },
    { id: 'architecture', label: 'Architecture', icon: <Building2 size={18} /> },
];

export const InterestsStep: React.FC = () => {
    const { wizardData, toggleInterest } = useTripWizard();
    const selectedCount = wizardData.interests.length;

    return (
        <WizardStepCard
            title="What are your interests?"
            subtitle="Select at least 2 to personalize your trip"
            icon={<Sparkles size={36} />}
        >
            <div className="space-y-6">
                {/* Interest Chips Grid */}
                <div className="flex flex-wrap gap-3 justify-center">
                    {interestOptions.map((option, index) => (
                        <InterestChip
                            key={option.id}
                            icon={option.icon}
                            label={option.label}
                            selected={wizardData.interests.includes(option.id)}
                            onClick={() => toggleInterest(option.id)}
                            delay={index}
                        />
                    ))}
                </div>

                {/* Selection Count Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center"
                >
                    <div className={`
                        inline-flex items-center gap-2 px-4 py-2 rounded-full
                        text-sm font-medium
                        ${selectedCount >= 2
                            ? 'bg-[var(--color-success-light)] text-[var(--color-success)]'
                            : 'bg-[var(--color-warning-light)] text-[var(--color-warning)]'
                        }
                    `}>
                        {selectedCount >= 2 ? (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {selectedCount} interests selected
                            </>
                        ) : (
                            <>
                                Select {2 - selectedCount} more {2 - selectedCount === 1 ? 'interest' : 'interests'}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </WizardStepCard>
    );
};
