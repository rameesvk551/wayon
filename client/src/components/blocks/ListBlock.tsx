import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import type { ListBlock as ListBlockType, ListItem } from '../../types/ui-schema';

type ListBlockProps = Omit<ListBlockType, 'type'>;

const ListItemComponent: React.FC<{ item: ListItem; index: number; ordered: boolean }> = ({
    item,
    index,
    ordered
}) => {
    return (
        <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-start gap-3"
        >
            {/* Bullet/Number */}
            <span className="flex-shrink-0 mt-0.5">
                {ordered ? (
                    <span className="
            flex items-center justify-center
            w-5 h-5
            text-xs font-semibold
            text-white
            bg-[var(--color-primary)]
            rounded-full
          ">
                        {index + 1}
                    </span>
                ) : (
                    <Circle size={8} className="text-[var(--color-primary)] fill-current mt-1.5" />
                )}
            </span>

            {/* Content */}
            <div className="flex-1">
                <span className="text-sm text-[var(--color-text-secondary)]">
                    {item.text}
                </span>

                {/* Sub Items */}
                {item.subItems && item.subItems.length > 0 && (
                    <ul className="mt-2 ml-2 space-y-2">
                        {item.subItems.map((subItem, subIndex) => (
                            <li key={subItem.id} className="flex items-start gap-2 text-sm text-[var(--color-text-muted)]">
                                <Check size={14} className="text-[var(--color-success)] mt-0.5" />
                                <span>{subItem.text}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </motion.li>
    );
};

export const ListBlock: React.FC<ListBlockProps> = ({ items, ordered = false }) => {
    const Tag = ordered ? 'ol' : 'ul';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <Tag className="space-y-3">
                {items.map((item, index) => (
                    <ListItemComponent
                        key={item.id}
                        item={item}
                        index={index}
                        ordered={ordered}
                    />
                ))}
            </Tag>
        </motion.div>
    );
};
