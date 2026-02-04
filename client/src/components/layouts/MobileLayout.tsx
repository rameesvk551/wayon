import { motion } from 'framer-motion';
import { Home, MessageCircle, Briefcase } from 'lucide-react';

interface MobileLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'trips', label: 'My Trips', icon: Briefcase },
];

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    activeTab,
    onTabChange
}) => {
    return (
        <div className="mobile-app-container">
            {/* Main Content Area */}
            <main className="mobile-content">
                {children}
            </main>

            {/* Bottom Tab Navigation */}
            <nav className="mobile-bottom-nav">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`mobile-tab-button ${isActive ? 'active' : ''}`}
                        >
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    y: isActive ? -2 : 0
                                }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                className="mobile-tab-icon-wrapper"
                            >
                                <Icon
                                    size={22}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'}
                                />
                            </motion.div>
                            <span className={`mobile-tab-label ${isActive ? 'active' : ''}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="mobile-tab-indicator"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileLayout;
