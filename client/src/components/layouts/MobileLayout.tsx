import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Hotel, Home, Bot, Shield, Map, Plus, X } from 'lucide-react';
import AppHeader from '../AppHeader';

interface MobileLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const leftTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tours', label: 'Tours', icon: Compass },
];

const rightTabs = [
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'bot', label: 'AI', icon: Bot },
];

/* Extra actions revealed by the FAB */
const fabActions = [
    { id: 'visa', label: 'Visa', icon: Shield, color: '#6366F1' },
    { id: 'planner', label: 'Plan Trip', icon: Map, color: '#F59E0B' },
    { id: 'bot', label: 'AI Chat', icon: Bot, color: '#10B981' },
];

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    activeTab,
    onTabChange
}) => {
    const [fabOpen, setFabOpen] = useState(false);

    const toggleFab = useCallback(() => setFabOpen((s) => !s), []);

    const handleFabAction = useCallback((id: string) => {
        setFabOpen(false);
        onTabChange(id);
    }, [onTabChange]);

    const renderTab = (tab: typeof leftTabs[0]) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
            <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`mnav-tab ${isActive ? 'mnav-tab--active' : ''}`}
                aria-label={tab.label}
            >
                <motion.div
                    className="mnav-tab__icon"
                    initial={false}
                    animate={{
                        scale: isActive ? 1 : 1,
                        y: isActive ? -1 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                    <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                </motion.div>
                <span className="mnav-tab__label">{tab.label}</span>
                {isActive && (
                    <motion.div
                        className="mnav-tab__dot"
                        layoutId="activeTabDot"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                )}
            </button>
        );
    };

    return (
        <div className="mobile-app-container">
            <AppHeader />

            <main className="mobile-content">
                {children}
            </main>

            {/* Scrim overlay when FAB is open */}
            <AnimatePresence>
                {fabOpen && (
                    <motion.div
                        className="mnav-scrim"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setFabOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* FAB radial action menu */}
            <AnimatePresence>
                {fabOpen && (
                    <div className="mnav-fab-menu">
                        {fabActions.map((action, i) => {
                            const Icon = action.icon;
                            const total = fabActions.length;
                            // Spread evenly across a 140° arc centered above the FAB
                            const spreadAngle = 140;
                            const startAngle = 180 + (180 - spreadAngle) / 2; // start from left
                            const step = spreadAngle / (total - 1);
                            const angleDeg = startAngle + i * step;
                            const radius = 95;
                            const rad = (angleDeg * Math.PI) / 180;
                            const x = Math.cos(rad) * radius;
                            const y = Math.sin(rad) * radius;

                            return (
                                <motion.button
                                    key={action.id}
                                    className="mnav-fab-action"
                                    style={{ '--fab-color': action.color } as React.CSSProperties}
                                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                                    animate={{ opacity: 1, x, y, scale: 1 }}
                                    exit={{ opacity: 0, x: 0, y: 0, scale: 0.2 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 380,
                                        damping: 20,
                                        delay: i * 0.04,
                                    }}
                                    onClick={() => handleFabAction(action.id)}
                                >
                                    <Icon size={20} strokeWidth={2} />
                                    <span className="mnav-fab-action__label">{action.label}</span>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <nav className="mnav">
                <div className="mnav__bar">
                    {/* Left tabs */}
                    <div className="mnav__group">
                        {leftTabs.map(renderTab)}
                    </div>

                    {/* Center FAB */}
                    <div className="mnav__fab-wrapper">
                        <motion.button
                            className={`mnav__fab ${fabOpen ? 'mnav__fab--open' : ''}`}
                            onClick={toggleFab}
                            whileTap={{ scale: 0.92 }}
                            aria-label={fabOpen ? 'Close menu' : 'Open menu'}
                        >
                            <motion.div
                                initial={false}
                                animate={{ rotate: fabOpen ? 0 : 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {fabOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{ rotate: -90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <X size={26} strokeWidth={2.5} />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="plus"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                        >
                                            <Plus size={26} strokeWidth={2.5} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.button>
                    </div>

                    {/* Right tabs */}
                    <div className="mnav__group">
                        {rightTabs.map(renderTab)}
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default MobileLayout;
