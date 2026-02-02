import { Clock, Calendar, CalendarDays, CalendarRange } from 'lucide-react';
import { WizardStepCard, SelectionOption } from '../../molecules/WizardStepCard';
import { useTripWizard } from '../../../store/TripWizardContext';

const freeTimeOptions = [
    { id: 'weekend', label: 'Weekend Getaway', description: '2-3 days', icon: <Clock size={24} /> },
    { id: '1-week', label: '1 Week', description: '5-7 days', icon: <Calendar size={24} /> },
    { id: '2-weeks', label: '2 Weeks', description: '10-14 days', icon: <CalendarDays size={24} /> },
    { id: 'month+', label: 'Month or More', description: '30+ days', icon: <CalendarRange size={24} /> },
];

export const FreeTimeStep: React.FC = () => {
    const { wizardData, setFreeTime } = useTripWizard();

    return (
        <WizardStepCard
            title="How much free time do you have?"
            subtitle="This helps us plan the perfect trip duration"
            icon={<Calendar size={36} />}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {freeTimeOptions.map((option, index) => (
                    <SelectionOption
                        key={option.id}
                        icon={option.icon}
                        label={option.label}
                        description={option.description}
                        selected={wizardData.freeTime === option.id}
                        onClick={() => setFreeTime(option.id)}
                        delay={index}
                    />
                ))}
            </div>
        </WizardStepCard>
    );
};
