import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { BudgetSummaryCard } from './BudgetSummaryCard';
import { BudgetCategoryList } from './BudgetCategoryList';
import { AddExpenseSheet } from './AddExpenseSheet';
import { useTripAssistantStore } from '../../store/useTripAssistantStore';
import { formatINR } from '../../utils/formatters';

export const BudgetTrackerSection = () => {
  const [open, setOpen] = useState(false);
  const totalBudget = useTripAssistantStore((s) => s.totalBudget);
  const expenses = useTripAssistantStore((s) => s.expenses);
  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  return (
    <section className="sb-container">
      <BudgetSummaryCard />
      <BudgetCategoryList />

      {/* Total Budget row */}
      <div className="sb-total-row">
        <span className="sb-total-label">Total Budget</span>
        <span className="sb-total-budget">{formatINR(totalBudget)}</span>
        <span className="sb-total-spent">{formatINR(totalSpent)}</span>
      </div>

      {/* Add Budget button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="sb-add-btn"
        onClick={() => setOpen(true)}
      >
        <Plus size={18} strokeWidth={2.5} />
        <span>Add Budget</span>
      </motion.button>

      <AddExpenseSheet open={open} onClose={() => setOpen(false)} />
    </section>
  );
};
