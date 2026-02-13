import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTripAssistantStore } from '../../store/useTripAssistantStore';
import { getBudgetCategoryIcon } from '../../config/uiMaps';
import { formatINR } from '../../utils/formatters';

export const BudgetCategoryList = () => {
  const categoriesRaw = useTripAssistantStore((s) => s.budgetCategories);
  const expenses = useTripAssistantStore((s) => s.expenses);

  const categories = useMemo(
    () =>
      categoriesRaw.map((cat) => {
        const spent = expenses
          .filter((e) => e.categoryId === cat.id)
          .reduce((sum, e) => sum + e.amount, 0);
        const pct = cat.allocated > 0 ? Math.round((spent / cat.allocated) * 100) : 0;
        return { ...cat, spent, pct };
      }),
    [categoriesRaw, expenses],
  );

  return (
    <div className="sb-category-list">
      {categories.map((cat, i) => {
        const Icon = getBudgetCategoryIcon(cat.icon);
        return (
          <motion.div
            key={cat.id}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="sb-category-row"
          >
            <div className="sb-cat-icon" style={{ backgroundColor: cat.color }}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="sb-cat-info">
              <div className="sb-cat-header">
                <div>
                  <span className="sb-cat-name">{cat.label}</span>
                  <span className="sb-cat-budget">{formatINR(cat.allocated)}</span>
                </div>
                <div className="sb-cat-stats">
                  <span className="sb-cat-spent">{formatINR(cat.spent)}</span>
                  <span className="sb-cat-pct">/ {cat.pct}%</span>
                </div>
              </div>
              <div className="sb-progress-track">
                <motion.div
                  className="sb-progress-fill"
                  style={{ backgroundColor: cat.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(cat.pct, 100)}%` }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.06 }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
