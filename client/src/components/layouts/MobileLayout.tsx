import { motion } from 'framer-motion';
import { Compass, Hotel, Map, Bot, Shield } from 'lucide-react';
import AppHeader from '../AppHeader';

interface MobileLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'tours', label: 'Tours', icon: Compass },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'visa', label: 'Visa', icon: Shield },
    { id: 'planner', label: 'Planner', icon: Map },
    { id: 'bot', label: 'Bot', icon: Bot },
];

export const MobileLayout: React.FC<MobileLayoutProps> = ({
    children,
    activeTab,
    onTabChange
}) => {
    return (
        <div className="mobile-app-container">
            {/* App Header */}
            <AppHeader />

            {/* Main Content Area */}
            <main className="mobile-content">
                {children}
            </main>

            {/* Bottom Tab Navigation - 5 Icons */}
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
                                    strokeWidth={isActive ? 2.5 : 1.5}
                                    className={isActive ? 'text-white' : 'text-gray-500'}
                                />
                            </motion.div>
                            <span className={`mobile-tab-label ${isActive ? 'active' : ''}`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileLayout;
