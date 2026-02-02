import { User, Heart, Users, UserPlus } from 'lucide-react';
import { WizardStepCard, SelectionOption } from '../../molecules/WizardStepCard';
import { useTripWizard } from '../../../store/TripWizardContext';

const companionOptions = [
    { id: 'solo', label: 'Solo Adventure', description: 'Just me, exploring freely', icon: <User size={24} /> },
    { id: 'couple', label: 'Romantic Getaway', description: 'With my partner', icon: <Heart size={24} /> },
    { id: 'family', label: 'Family Trip', description: 'With kids and family', icon: <Users size={24} /> },
    { id: 'friends', label: 'Friends Group', description: 'Squad adventure', icon: <UserPlus size={24} /> },
];

export const CompanionsStep: React.FC = () => {
    const { wizardData, setCompanions } = useTripWizard();

    return (
        <WizardStepCard
            title="Who are you traveling with?"
            subtitle="We'll tailor recommendations for your group"
            icon={<Users size={36} />}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {companionOptions.map((option, index) => (
                    <SelectionOption
                        key={option.id}
                        icon={option.icon}
                        label={option.label}
                        description={option.description}
                        selected={wizardData.companions === option.id}
                        onClick={() => setCompanions(option.id)}
                        delay={index}
                    />
                ))}
            </div>
        </WizardStepCard>
    );
};
