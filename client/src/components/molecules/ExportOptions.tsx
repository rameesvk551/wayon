import { motion } from 'framer-motion';
import { Download, Link, Mail, Calendar, Printer } from 'lucide-react';

interface ExportOptionsProps {
    onExportPDF?: () => void;
    onCopyLink?: () => void;
    onEmail?: () => void;
    onAddToCalendar?: () => void;
    onPrint?: () => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
    onExportPDF,
    onCopyLink,
    onEmail,
    onAddToCalendar,
    onPrint
}) => {
    const options = [
        {
            id: 'pdf',
            label: 'Download PDF',
            icon: Download,
            onClick: onExportPDF,
            primary: true
        },
        {
            id: 'link',
            label: 'Copy Link',
            icon: Link,
            onClick: onCopyLink
        },
        {
            id: 'email',
            label: 'Email',
            icon: Mail,
            onClick: onEmail
        },
        {
            id: 'calendar',
            label: 'Add to Calendar',
            icon: Calendar,
            onClick: onAddToCalendar
        },
        {
            id: 'print',
            label: 'Print',
            icon: Printer,
            onClick: onPrint
        }
    ];

    return (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                Export & Share
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {options.map((option, index) => {
                    const Icon = option.icon;
                    return (
                        <motion.button
                            key={option.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={option.onClick}
                            className={`
                                flex flex-col items-center gap-2
                                p-4
                                rounded-xl
                                transition-all duration-200
                                ${option.primary
                                    ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]'
                                    : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                                }
                            `}
                        >
                            <Icon size={20} />
                            <span className="text-xs font-medium">{option.label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};
