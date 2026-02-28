import { useRef } from 'react';
import { motion } from 'framer-motion';
import type { AttractionCategory, AttractionCategoryId } from '../../types/attraction';

interface CategoryScrollerProps {
    categories: AttractionCategory[];
    activeCategory: AttractionCategoryId | null;
    onSelect: (id: AttractionCategoryId | null) => void;
}

const CategoryScroller: React.FC<CategoryScrollerProps> = ({
    categories,
    activeCategory,
    onSelect,
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <div className="cat-scroller" ref={scrollRef}>
            <motion.button
                className={`cat-pill ${activeCategory === null ? 'cat-pill--active' : ''}`}
                onClick={() => onSelect(null)}
                type="button"
                whileTap={{ scale: 0.95 }}
                layout
            >
                <span className="cat-pill__icon">✨</span>
                <span className="cat-pill__label">All</span>
            </motion.button>
            {categories.map((cat) => (
                <motion.button
                    key={cat.id}
                    className={`cat-pill ${activeCategory === cat.id ? 'cat-pill--active' : ''}`}
                    onClick={() => onSelect(activeCategory === cat.id ? null : cat.id)}
                    type="button"
                    whileTap={{ scale: 0.95 }}
                    layout
                >
                    <span className="cat-pill__icon">{cat.icon}</span>
                    <span className="cat-pill__label">{cat.label}</span>
                </motion.button>
            ))}
        </div>
    );
};

export default CategoryScroller;
