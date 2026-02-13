import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock } from 'lucide-react';
import { useTripAssistantStore } from '../store/useTripAssistantStore';
import { BudgetTrackerSection } from './budget/BudgetTrackerSection';
import { WeatherWidgetSection } from './weather/WeatherWidgetSection';
import { PackingChecklistSection } from './packing/PackingChecklistSection';

export const TripAssistantDashboard = () => {
  const weatherDays = useTripAssistantStore((state) => state.weatherDays);
  const rainInsight = useMemo(() => {
    const rainyDays = weatherDays.filter((day) => day.rainChance >= 60);
    if (rainyDays.length === 0) {
      return {
        hasRainAlert: false,
        message: 'Weather looks stable this week.',
      };
    }

    return {
      hasRainAlert: true,
      message: `Rain expected on ${rainyDays.map((day) => day.dayLabel).join(', ')}. Keep rain-ready plans.`,
    };
  }, [weatherDays]);

  return (
    <div className="trip-assistant-page no-scrollbar overflow-y-auto px-4 pb-24 pt-4">
      <header className="mb-4">
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500"
        >
          AI Trip Assistant
        </motion.p>
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Tokyo Spring Itinerary</h1>
        {rainInsight.hasRainAlert && (
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1.5 text-xs font-semibold text-sky-900">
            <CalendarClock size={14} />
            Itinerary alert: rain-friendly activities recommended
          </div>
        )}
      </header>

      <WeatherWidgetSection />
      <BudgetTrackerSection />
      <PackingChecklistSection />
    </div>
  );
};
