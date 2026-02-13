import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronRight,
  Plus,
  X,
  CloudRain,
  Shirt,
  Cpu,
  FileText,
  Heart,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import { useTripAssistantStore } from '../../store/useTripAssistantStore';
import type { PackingCategoryId } from '../../types/tripAssistant.types';

const packingCategoryMeta: Record<PackingCategoryId, { icon: typeof Briefcase; bg: string; color: string }> = {
  essentials: { icon: Briefcase, bg: '#E0F2FE', color: '#0284C7' },
  clothing: { icon: Shirt, bg: '#FCE7F3', color: '#DB2777' },
  gadgets: { icon: Cpu, bg: '#DBEAFE', color: '#2563EB' },
  documents: { icon: FileText, bg: '#FEF3C7', color: '#D97706' },
  health: { icon: Heart, bg: '#D1FAE5', color: '#059669' },
};

export const PackingChecklistSection = () => {
  const packingCategories = useTripAssistantStore((state) => state.packingCategories);
  const packingItems = useTripAssistantStore((state) => state.packingItems);
  const expandedPackingCategories = useTripAssistantStore((state) => state.expandedPackingCategories);
  const weatherDays = useTripAssistantStore((state) => state.weatherDays);
  const toggleCategory = useTripAssistantStore((state) => state.togglePackingCategory);
  const toggleItem = useTripAssistantStore((state) => state.togglePackingItem);
  const addWeatherSuggestions = useTripAssistantStore((state) => state.addWeatherSuggestionsToPacking);
  const [openModal, setOpenModal] = useState(false);

  const progress = useMemo(() => {
    const total = packingItems.length;
    const packed = packingItems.filter((item) => item.checked).length;
    return { total, packed, percent: total > 0 ? (packed / total) * 100 : 0 };
  }, [packingItems]);

  const groups = useMemo(
    () =>
      packingCategories.map((category) => {
        const items = packingItems.filter((item) => item.categoryId === category.id);
        const meta = packingCategoryMeta[category.id];
        return {
          category,
          items,
          packedCount: items.filter((item) => item.checked).length,
          totalCount: items.length,
          isExpanded: expandedPackingCategories[category.id],
          meta,
        };
      }),
    [expandedPackingCategories, packingCategories, packingItems]
  );

  const rainInsight = useMemo(() => {
    const rainyDays = weatherDays.filter((day) => day.rainChance >= 60);
    if (rainyDays.length === 0) return { hasRainAlert: false, message: '', days: '' };
    return {
      hasRainAlert: true,
      message: 'Weather Alert',
      days: `Rain expected ${rainyDays.map((d) => d.dayLabel).join(' ')}`,
    };
  }, [weatherDays]);

  const isComplete = progress.packed === progress.total && progress.total > 0;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress.percent / 100) * circumference;

  return (
    <div className="pack-wrapper">
      {/* ─── Unified card ─── */}
      <div className="pack-unified-card">
        {/* ─── Progress Ring ─── */}
        <div className="pack-ring-area">
          <div className="pack-ring-bg" />
          <div className="relative z-10 flex flex-col items-center py-5">
            <div className="relative">
              <svg className="-rotate-90" width="110" height="110" viewBox="0 0 130 130">
                <circle cx="65" cy="65" r={radius} stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                <motion.circle
                  cx="65" cy="65" r={radius}
                  stroke="#14B8A6"
                  strokeWidth="8"
                  fill="transparent"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[22px] font-extrabold text-teal-600">
                  {Math.round(progress.percent)}%
                </span>
                <span className="text-[10px] font-semibold text-slate-400">packed</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Summary row ─── */}
        {isComplete ? (
          <div className="pack-allset-banner">
            <CheckCircle2 size={24} className="text-teal-500" />
            <div>
              <h3 className="text-[15px] font-bold text-slate-800">All Set for Your Trip!</h3>
              <p className="mt-0.5 text-[11px] text-slate-400">
                All items in your packing checklist are packed and ready!
              </p>
            </div>
          </div>
        ) : (
          <div className="pack-allset-banner">
            <CheckCircle2 size={24} className="text-teal-500" />
            <div>
              <h3 className="text-[15px] font-bold text-slate-800">Packing Checklist</h3>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {progress.packed} of {progress.total} items packed
              </p>
            </div>
          </div>
        )}

        {/* ─── Weather Alert row ─── */}
        {rainInsight.hasRainAlert && (
          <button
            type="button"
            onClick={addWeatherSuggestions}
            className="pack-weather-row"
          >
            <div className="pack-icon-circle" style={{ background: '#E0F2FE' }}>
              <CloudRain size={18} className="text-sky-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700">{rainInsight.message}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Check size={12} className="text-teal-500" />
                <span className="text-xs text-slate-400">{rainInsight.days}</span>
              </div>
            </div>
            <div className="pack-weather-illustration">
              <CloudRain size={28} className="text-slate-200" />
            </div>
          </button>
        )}

        {/* ─── Category rows ─── */}
        <div className="pack-category-list">
          {groups.map((group) => {
            const CatIcon = group.meta.icon;
            const allDone = group.totalCount > 0 && group.packedCount === group.totalCount;

            return (
              <div key={group.category.id}>
                {/* Category header row */}
                <button
                  type="button"
                  onClick={() => toggleCategory(group.category.id)}
                  className="pack-row"
                  aria-expanded={group.isExpanded}
                >
                  <div className="pack-icon-circle" style={{ background: group.meta.bg }}>
                    <CatIcon size={16} style={{ color: group.meta.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-700">
                        {group.category.label}
                      </span>
                    </div>
                    {group.isExpanded && group.packedCount > 0 && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Check size={11} className="text-teal-500" />
                        <span className="text-[11px] text-slate-400">
                          {group.packedCount} Packed
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400">
                      {group.packedCount}/{group.totalCount}
                    </span>
                    {allDone ? (
                      <CheckCircle2 size={18} className="text-teal-500" />
                    ) : (
                      <ChevronRight
                        size={16}
                        className={`text-slate-300 transition-transform duration-200 ${
                          group.isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </div>
                </button>

                {/* Expanded items */}
                <AnimatePresence initial={false}>
                  {group.isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pack-items-list">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            className="pack-item"
                          >
                            <div className={`pack-check ${item.checked ? 'checked' : ''}`}>
                              {item.checked && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span
                              className={`flex-1 text-[13px] ${
                                item.checked
                                  ? 'text-slate-300 line-through'
                                  : 'font-medium text-slate-600'
                              }`}
                            >
                              {item.label}
                            </span>
                            {item.suggestedByWeather && (
                              <span className="pack-smart-tag">Smart</span>
                            )}
                            {item.checked && (
                              <CheckCircle2 size={16} className="text-teal-400 flex-shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>  {/* end pack-unified-card */}

      {/* ─── Add Custom Item — fixed bottom ─── */}
      <div className="pack-add-fixed">
        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="pack-add-btn"
        >
          <Plus size={16} className="text-slate-400" />
          <span>Add Custom Item</span>
        </button>
      </div>

      <AddPackingItemSheet open={openModal} onClose={() => setOpenModal(false)} />
    </div>
  );
};

/* ─────────── Add Packing Item Bottom Sheet ─────────── */
const AddPackingItemSheet = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const categories = useTripAssistantStore((state) => state.packingCategories);
  const addPackingItem = useTripAssistantStore((state) => state.addPackingItem);
  const [label, setLabel] = useState('');
  const [categoryId, setCategoryId] = useState<PackingCategoryId>('essentials');

  const canSave = label.trim().length > 1;
  const selectedMeta = packingCategoryMeta[categoryId];

  const onSubmit = () => {
    if (!canSave) return;
    addPackingItem({ label, categoryId });
    setLabel('');
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close"
          />
          <motion.section
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="packing-sheet"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-slate-200" />

            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800">Add Custom Item</h3>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400"
              >
                <X size={16} />
              </button>
            </div>

            <label className="mb-4 block">
              <span className="mb-1 block text-xs font-semibold text-slate-500">Item name</span>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="packing-input"
                placeholder="e.g. Travel pillow"
              />
            </label>

            <label className="mb-1 block text-xs font-semibold text-slate-500">Category</label>
            <div className="mb-5 grid grid-cols-5 gap-2">
              {categories.map((cat) => {
                const meta = packingCategoryMeta[cat.id];
                const CatIcon = meta.icon;
                const active = categoryId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`packing-cat-chip ${active ? 'active' : ''}`}
                    style={active ? { background: meta.bg, borderColor: meta.color, color: meta.color } : {}}
                  >
                    <CatIcon size={16} className={active ? '' : 'text-slate-400'} />
                    <span className="text-[10px] font-semibold">{cat.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSave}
              className="packing-submit-btn"
              style={canSave ? { background: selectedMeta.color } : {}}
            >
              Add to Packing List
            </button>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
};
