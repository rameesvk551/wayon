import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { WalletCards, CheckSquare, ChevronRight } from 'lucide-react';
import { WeatherWidgetSection } from '../features/trip-assistant/components/weather/WeatherWidgetSection';
import '../features/trip-assistant/styles/tripAssistant.css';

const ToursScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="trip-assistant-page no-scrollbar overflow-y-auto px-4 pb-24 pt-4">
      <header className="mb-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">AI Trip Assistant</p>
        <h1 className="text-2xl font-semibold text-slate-900">Planning Hub</h1>
      </header>

      <WeatherWidgetSection />

      <section className="space-y-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="trip-glass-card flex w-full items-center justify-between p-4 text-left"
          onClick={() => navigate('/budget-tracker')}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <WalletCards size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Budget Tracker</p>
              <p className="text-xs text-slate-500">Track spend, limits, and category breakdown.</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="trip-glass-card flex w-full items-center justify-between p-4 text-left"
          onClick={() => navigate('/packing-assistant')}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <CheckSquare size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Packing Assistant</p>
              <p className="text-xs text-slate-500">Complete your checklist with smart weather suggestions.</p>
            </div>
          </div>
          <ChevronRight size={18} className="text-slate-500" />
        </motion.button>
      </section>
    </div>
  );
};

export default ToursScreen;
