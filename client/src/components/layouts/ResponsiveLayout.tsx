import { motion } from 'framer-motion';
import { Compass, Hotel, Map, Bot, Sparkles, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ResponsiveLayoutProps {
    children: React.ReactNode;
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'tours', label: 'Tours', icon: Compass },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'planner', label: 'Planner', icon: Map },
    { id: 'bot', label: 'Bot', icon: Bot },
];

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
    children,
    activeTab,
    onTabChange
}) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mobile Layout
    if (isMobile) {
        return (
            <div className="mobile-app-container">
                <main className="mobile-content">
                    {children}
                </main>
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
    }

    // Desktop Layout with Sidebar
    return (
        <div className="desktop-app-container">
            {/* Desktop Sidebar */}
            <aside className={`desktop-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                {/* Logo/Brand */}
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon">
                            <Sparkles size={24} />
                        </div>
                        {!sidebarCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="logo-text"
                            >
                                AI Travel
                            </motion.span>
                        )}
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className="sidebar-nav">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <div className="nav-icon-wrapper">
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                {!sidebarCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="nav-label"
                                    >
                                        {tab.label}
                                    </motion.span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeSidebarIndicator"
                                        className="sidebar-active-indicator"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* AI Assistant Quick Access */}
                <div className="sidebar-footer">
                    <button
                        className="sidebar-ai-button"
                        onClick={() => onTabChange('bot')}
                    >
                        <Sparkles size={20} />
                        {!sidebarCollapsed && <span>Ask AI Assistant</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="desktop-content">
                <div className="desktop-content-inner">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default ResponsiveLayout;
