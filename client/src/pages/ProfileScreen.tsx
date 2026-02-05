import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User, Pencil, Bell, DollarSign, Globe, CreditCard,
    Shield, HelpCircle, Info, LogOut, ChevronRight
} from 'lucide-react';

const menuItems = [
    { id: 'edit', label: 'Edit Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell, toggle: true },
    { id: 'currency', label: 'Currency', icon: DollarSign, value: 'USD' },
    { id: 'language', label: 'Language', icon: Globe, value: 'English' },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
    { id: 'about', label: 'About', icon: Info },
];

const user = {
    name: '',
    email: ''
};

const stats = {
    trips: 0,
    countries: 0,
    cities: 0
};

export const ProfileScreen: React.FC = () => {
    const [notifications, setNotifications] = useState(true);

    const handleLogout = () => {
        // Handle logout
        console.log('Logout clicked');
    };

    return (
        <div className="mobile-screen">
            {/* Header */}
            <header className="mobile-simple-header">
                <h1>Profile</h1>
            </header>

            {/* User Card */}
            <div className="mobile-user-card">
                <div className="mobile-user-avatar">
                    <User size={40} className="text-[var(--color-primary)]" />
                </div>
                <div className="mobile-user-info">
                    <h2>{user.name || 'Guest'}</h2>
                    <p>{user.email || 'No profile data loaded'}</p>
                </div>
                <button className="mobile-edit-btn">
                    <Pencil size={18} className="text-[var(--color-primary)]" />
                </button>
            </div>

            {/* Stats */}
            <div className="mobile-stats-card">
                <div className="mobile-stat">
                    <span className="mobile-stat-value">{stats.trips}</span>
                    <span className="mobile-stat-label">Trips</span>
                </div>
                <div className="mobile-stat-divider" />
                <div className="mobile-stat">
                    <span className="mobile-stat-value">{stats.countries}</span>
                    <span className="mobile-stat-label">Countries</span>
                </div>
                <div className="mobile-stat-divider" />
                <div className="mobile-stat">
                    <span className="mobile-stat-value">{stats.cities}</span>
                    <span className="mobile-stat-label">Cities</span>
                </div>
            </div>

            {/* Menu Items */}
            <div className="mobile-menu-card">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <motion.button
                            key={item.id}
                            whileTap={{ scale: 0.98 }}
                            className={`mobile-menu-item ${index === 0 ? 'first' : ''} ${index === menuItems.length - 1 ? 'last' : ''}`}
                        >
                            <div className="mobile-menu-left">
                                <div className="mobile-menu-icon">
                                    <Icon size={22} className="text-[var(--color-primary)]" />
                                </div>
                                <span>{item.label}</span>
                            </div>

                            {item.toggle ? (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setNotifications(!notifications);
                                    }}
                                    className={`mobile-toggle ${notifications ? 'active' : ''}`}
                                >
                                    <div className="mobile-toggle-thumb" />
                                </button>
                            ) : item.value ? (
                                <div className="mobile-menu-right">
                                    <span>{item.value}</span>
                                    <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                                </div>
                            ) : (
                                <ChevronRight size={18} className="text-[var(--color-text-muted)]" />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Logout Button */}
            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="mobile-logout-btn"
            >
                <LogOut size={22} />
                <span>Log Out</span>
            </motion.button>

            {/* Version */}
            <p className="mobile-version">Version 1.0.0</p>

            {/* Bottom spacing */}
            <div style={{ height: '100px' }} />
        </div>
    );
};

export default ProfileScreen;
