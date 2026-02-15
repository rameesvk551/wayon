import { useRef } from 'react';
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
            <button
                className={`cat-pill ${activeCategory === null ? 'cat-pill--active' : ''}`}
                onClick={() => onSelect(null)}
                type="button"
            >
                <span className="cat-pill__icon">✨</span>
                <span className="cat-pill__label">All</span>
            </button>
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    className={`cat-pill ${activeCategory === cat.id ? 'cat-pill--active' : ''}`}
                    onClick={() => onSelect(activeCategory === cat.id ? null : cat.id)}
                    type="button"
                >
                    <span className="cat-pill__icon">{cat.icon}</span>
                    <span className="cat-pill__label">{cat.label}</span>
                </button>
            ))}
        </div>
    );
};

export default CategoryScroller;
