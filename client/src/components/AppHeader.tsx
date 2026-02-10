import React from 'react';
import { Search, Bell } from 'lucide-react';

interface AppHeaderProps {
    userName?: string;
    avatarUrl?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
    userName = 'Celia Parker',
    avatarUrl = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
}) => {
    return (
        <header className="app-header">
            <div className="app-header-left">
                <div className="app-header-avatar">
                    <img src={avatarUrl} alt="User" />
                </div>
                <div className="app-header-info">
                    <span className="app-header-welcome">Welcome back!</span>
                    <h1 className="app-header-name">{userName}</h1>
                </div>
            </div>
            <div className="app-header-right">
                <button className="app-header-icon-btn" aria-label="Search">
                    <Search size={20} strokeWidth={2} />
                </button>
                <button className="app-header-icon-btn" aria-label="Notifications">
                    <Bell size={20} strokeWidth={2} />
                </button>
            </div>
        </header>
    );
};

export default AppHeader;
