import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTripAssistantStore } from '../../store/useTripAssistantStore';
import { formatINR } from '../../utils/formatters';

export const BudgetSummaryCard = () => {
  const budgetCategories = useTripAssistantStore((s) => s.budgetCategories);
  const expenses = useTripAssistantStore((s) => s.expenses);

  const { segments, totalSpent } = useMemo(() => {
    const catSpending = budgetCategories
      .map((cat) => {
        const spent = expenses
          .filter((e) => e.categoryId === cat.id)
          .reduce((sum, e) => sum + e.amount, 0);
        return { ...cat, spent };
      })
      .filter((c) => c.spent > 0);

    const total = catSpending.reduce((acc, c) => acc + c.spent, 0);

    let accDeg = 0;
    const segs = catSpending.map((cat) => {
      const pct = total > 0 ? (cat.spent / total) * 100 : 0;
      const startDeg = accDeg;
      accDeg += (pct / 100) * 360;
      return { ...cat, percentage: pct, startDeg, endDeg: accDeg };
    });

    return { segments: segs, totalSpent: total };
  }, [budgetCategories, expenses]);

  const radius = 70;
  const strokeW = 28;
  const circ = 2 * Math.PI * radius;
  const cx = 100;
  const cy = 100;
  const labelR = radius + 24;
  const segGap = 3;

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sb-donut-wrapper"
    >
      <svg viewBox="0 0 200 200" className="sb-donut-svg">
        {/* Background track */}
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#E8ECF2" strokeWidth={strokeW} />

        {/* Category segments */}
        {segments.map((seg, i) => {
          const fullLen = (seg.percentage / 100) * circ;
          const visLen = Math.max(0, fullLen - segGap);
          const cumPrev = segments
            .slice(0, i)
            .reduce((s, p) => s + (p.percentage / 100) * circ, 0);

          return (
            <motion.circle
              key={seg.id}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeLinecap="butt"
              strokeDasharray={`${visLen} ${circ - visLen}`}
              strokeDashoffset={-(cumPrev + segGap / 2)}
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
              initial={{ strokeDasharray: `0 ${circ}` }}
              animate={{ strokeDasharray: `${visLen} ${circ - visLen}` }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}

        {/* Percentage labels around the donut */}
        {segments.map((seg) => {
          const midDeg = (seg.startDeg + seg.endDeg) / 2;
          const x = cx + labelR * Math.sin((midDeg * Math.PI) / 180);
          const y = cy - labelR * Math.cos((midDeg * Math.PI) / 180);
          return (
            <text
              key={`lbl-${seg.id}`}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#64748B"
              fontSize="10"
              fontWeight="700"
            >
              {Math.round(seg.percentage)}%
            </text>
          );
        })}

        {/* Center amount */}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#1E293B"
          fontSize="18"
          fontWeight="800"
        >
          {formatINR(totalSpent)}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#94A3B8"
          fontSize="11"
          fontWeight="500"
        >
          spent
        </text>
      </svg>
    </motion.div>
  );
};
