import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FilterChipProps {
    label: string;
    onRemove: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove }) => (
    <motion.span
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="
      inline-flex items-center gap-1
      px-3 py-1.5
      bg-[var(--color-primary-light)]
      text-[var(--color-primary)]
      text-xs font-semibold
      rounded-full
      border border-[var(--color-primary)]/20
    "
    >
        {label}
        <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="
        ml-0.5 p-0.5 rounded-full
        hover:bg-[var(--color-primary)]/15
        transition-colors
      "
        >
            <X size={12} />
        </button>
    </motion.span>
);

export default FilterChip;
