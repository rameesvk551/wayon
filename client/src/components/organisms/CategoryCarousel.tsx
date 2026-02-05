import { motion } from 'framer-motion';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Category {
    id: string;
    name: string;
    image: string;
    count: number;
}

interface CategoryCarouselProps {
    categories?: Category[];
    onCategoryClick?: (categoryId: string) => void;
}

const defaultCategories: Category[] = [];

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
    categories = defaultCategories,
    onCategoryClick
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 320;
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-12 bg-[var(--color-bg-primary)]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                            Explore by Category
                        </h2>
                        <p className="text-[var(--color-text-muted)] mt-1">
                            Find your perfect trip style
                        </p>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="
                                w-10 h-10 rounded-full
                                bg-white border border-[var(--color-border)]
                                flex items-center justify-center
                                hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
                                transition-colors
                                shadow-sm
                            "
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="
                                w-10 h-10 rounded-full
                                bg-white border border-[var(--color-border)]
                                flex items-center justify-center
                                hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
                                transition-colors
                                shadow-sm
                            "
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {categories.length === 0 ? (
                    <div className="py-10 text-center text-[var(--color-text-muted)]">
                        <p className="text-sm font-medium">No categories available yet</p>
                        <p className="text-xs">Categories will appear as data loads.</p>
                    </div>
                ) : (
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6"
                    >
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                whileHover={{ y: -4 }}
                                onClick={() => onCategoryClick?.(category.id)}
                                className="
                                    flex-shrink-0 w-72
                                    relative overflow-hidden
                                    rounded-2xl
                                    cursor-pointer
                                    group
                                "
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    <h3 className="text-lg font-semibold text-white mb-1">
                                        {category.name}
                                    </h3>
                                    <p className="text-sm text-white/70">
                                        {category.count} destinations
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
