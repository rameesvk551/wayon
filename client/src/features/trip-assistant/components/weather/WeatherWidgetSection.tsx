import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Droplets, Sunrise, Thermometer, Wind, X } from 'lucide-react';
import { useTripAssistantStore } from '../../store/useTripAssistantStore';
import { weatherStripIconMap, weatherVisualMap } from '../../config/uiMaps';

export const WeatherWidgetSection = () => {
  const weatherDays = useTripAssistantStore((state) => state.weatherDays);
  const selectedWeatherDayId = useTripAssistantStore((state) => state.selectedWeatherDayId);
  const selectWeatherDay = useTripAssistantStore((state) => state.selectWeatherDay);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const selectedDay = useMemo(
    () => weatherDays.find((day) => day.id === selectedWeatherDayId) ?? weatherDays[0],
    [selectedWeatherDayId, weatherDays]
  );
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
    <section className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Weather Outlook</h2>
        {rainInsight.hasRainAlert && (
          <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-semibold text-sky-800">
            Rain likely
          </span>
        )}
      </div>

      {rainInsight.hasRainAlert && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="trip-alert-banner mb-3 rounded-2xl px-3 py-2 text-xs text-sky-900"
        >
          {rainInsight.message}
        </motion.div>
      )}

      <div className="no-scrollbar mb-2 flex gap-2 overflow-x-auto pb-1">
        {weatherDays.map((day) => {
          const Icon = weatherStripIconMap[day.type];
          const isActive = selectedDay.id === day.id;
          return (
            <motion.button
              type="button"
              key={day.id}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.16 }}
              onClick={() => {
                selectWeatherDay(day.id);
                setOverlayOpen(true);
              }}
              className={`min-w-[88px] rounded-[20px] bg-gradient-to-br px-3 py-3 text-left ${
                weatherVisualMap[day.type].gradient
              } ${isActive ? 'ring-2 ring-slate-900/20' : ''}`}
            >
              <Icon size={16} className={`mb-2 ${weatherVisualMap[day.type].textClass}`} />
              <p className="text-xs font-semibold text-slate-800">{day.dayLabel}</p>
              <p className="text-[11px] text-slate-700">
                {day.minTemp}° / {day.maxTemp}°
              </p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {overlayOpen && selectedDay && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[1.5px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOverlayOpen(false)}
            />
            <motion.section
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className={`fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] rounded-t-[24px] bg-gradient-to-b ${
                weatherVisualMap[selectedDay.type].gradient
              } px-4 pb-7 pt-3 shadow-2xl`}
              role="dialog"
              aria-modal="true"
            >
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-700">{selectedDay.dateISO}</p>
                  <h3 className="text-xl font-bold text-slate-900">{selectedDay.dayLabel}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOverlayOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="mb-4"
              >
                {(() => {
                  const Icon = weatherVisualMap[selectedDay.type].icon;
                  return <Icon size={52} className={weatherVisualMap[selectedDay.type].textClass} />;
                })()}
              </motion.div>
              <div className="mb-4 text-3xl font-bold text-slate-900">{selectedDay.maxTemp}°</div>
              <div className="grid grid-cols-2 gap-2">
                <WeatherMeta label="Humidity" value={`${selectedDay.humidity}%`} icon={<Droplets size={14} />} />
                <WeatherMeta label="Wind" value={`${selectedDay.windKph} km/h`} icon={<Wind size={14} />} />
                <WeatherMeta label="Sunrise" value={selectedDay.sunrise} icon={<Sunrise size={14} />} />
                <WeatherMeta label="Feels Like" value={`${selectedDay.feelsLike}°`} icon={<Thermometer size={14} />} />
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

const WeatherMeta = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl bg-white/70 p-3">
    <div className="mb-1 flex items-center gap-1.5 text-slate-700">
      {icon}
      <span className="text-[11px] font-semibold">{label}</span>
    </div>
    <p className="text-sm font-semibold text-slate-900">{value}</p>
  </div>
);
