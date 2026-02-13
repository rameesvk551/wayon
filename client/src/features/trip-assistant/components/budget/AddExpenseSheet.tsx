import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import type { BudgetCategoryId } from '../../types/tripAssistant.types';
import { getBudgetCategoryIcon } from '../../config/uiMaps';
import { useTripAssistantStore } from '../../store/useTripAssistantStore';

interface AddExpenseSheetProps {
  open: boolean;
  onClose: () => void;
}

const quickAmounts = [100, 500, 1000, 2500, 5000];

export const AddExpenseSheet = ({ open, onClose }: AddExpenseSheetProps) => {
  const categories = useTripAssistantStore((state) => state.budgetCategories);
  const addExpense = useTripAssistantStore((state) => state.addExpense);
  const defaultCategory = categories[0]?.id ?? 'food';

  const [categoryId, setCategoryId] = useState<BudgetCategoryId>(defaultCategory);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('');

  const parsedAmount = useMemo(() => Number(amount), [amount]);
  const canSave = Number.isFinite(parsedAmount) && parsedAmount > 0 && date.length > 0;

  const selectedCat = categories.find((c) => c.id === categoryId);

  const onSubmit = () => {
    if (!canSave) return;
    addExpense({
      categoryId,
      amount: parsedAmount,
      date,
      note,
    });
    setAmount('');
    setNote('');
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-label="Close add expense sheet"
          />
          <motion.section
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="expense-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Add expense"
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-200" />

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Expense</h3>
                  <p className="text-[11px] text-slate-400">Track your spending</p>
                </div>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                type="button"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Category selector */}
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Category
            </label>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {categories.map((category) => {
                const Icon = getBudgetCategoryIcon(category.icon);
                const active = categoryId === category.id;
                return (
                  <motion.button
                    type="button"
                    key={category.id}
                    onClick={() => setCategoryId(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`expense-category-chip ${active ? 'active' : ''}`}
                    style={active ? {
                      backgroundColor: `${category.color}12`,
                      borderColor: category.color,
                      color: category.color,
                    } : {}}
                  >
                    <Icon size={18} className={active ? '' : 'text-slate-400'} />
                    <span className={`text-[11px] font-semibold ${active ? '' : 'text-slate-600'}`}>
                      {category.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Amount input */}
            <label className="mb-3 block">
              <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Amount
              </span>
              <div className="expense-amount-input">
                <span className="text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0"
                  className="flex-1 bg-transparent text-2xl font-extrabold text-slate-900 outline-none placeholder:text-slate-200"
                />
              </div>
            </label>

            {/* Quick amount chips */}
            <div className="mb-4 flex flex-wrap gap-2">
              {quickAmounts.map((chipValue) => (
                <motion.button
                  type="button"
                  key={chipValue}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`quick-amount-chip ${
                    Number(amount) === chipValue ? 'active' : ''
                  }`}
                  style={
                    Number(amount) === chipValue && selectedCat
                      ? { backgroundColor: `${selectedCat.color}14`, borderColor: selectedCat.color, color: selectedCat.color }
                      : {}
                  }
                  onClick={() => setAmount(String(chipValue))}
                >
                  ₹{chipValue.toLocaleString()}
                </motion.button>
              ))}
            </div>

            {/* Date & Notes row */}
            <div className="mb-4 grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Date
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="expense-field"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Note
                </span>
                <input
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="e.g. Taxi fare"
                  className="expense-field"
                />
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="button"
              onClick={onSubmit}
              disabled={!canSave}
              whileHover={canSave ? { scale: 1.01 } : {}}
              whileTap={canSave ? { scale: 0.98 } : {}}
              className="expense-submit-btn"
              style={canSave && selectedCat ? {
                background: `linear-gradient(135deg, ${selectedCat.color}, ${selectedCat.color}CC)`,
              } : {}}
            >
              Save Expense
            </motion.button>
          </motion.section>
        </>
      )}
    </AnimatePresence>
  );
};
