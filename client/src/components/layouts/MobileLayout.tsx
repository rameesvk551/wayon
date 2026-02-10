import { motion } from 'framer-motion';
import { Home, Compass, LayoutGrid, Heart, User } from 'lucide-react';

interface MobileLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'chat', label: 'Explore', icon: LayoutGrid },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
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
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default MobileLayout;
