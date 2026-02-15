
import { WeatherWidgetSection } from '../features/trip-assistant/components/weather/WeatherWidgetSection';
import '../features/trip-assistant/styles/tripAssistant.css';

const ToursScreen = () => {

  return (
    <div className="trip-assistant-page no-scrollbar overflow-y-auto px-4 pb-24 pt-4">
      <header className="mb-4">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">AI Trip Assistant</p>
        <h1 className="text-2xl font-semibold text-slate-900">Planning Hub</h1>
      </header>

      <WeatherWidgetSection />


    </div>
  );
};

export default ToursScreen;
