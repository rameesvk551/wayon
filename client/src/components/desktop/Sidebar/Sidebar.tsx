import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/attractions', label: 'Attractions', icon: '🏛️' },
    { path: '/hotels', label: 'Hotels', icon: '🏨' },
    { path: '/tours', label: 'Tours', icon: '🎫' },
    { path: '/visa-explorer', label: 'Visa Explorer', icon: '🛂' },
    { path: '/visa-checker', label: 'Visa Checker', icon: '✈️' },
    { path: '/chat', label: 'AI Planner', icon: '🤖' },
    { path: '/budget-tracker', label: 'Budget Tracker', icon: '💰' },
    { path: '/packing-assistant', label: 'Packing List', icon: '🎒' },
    { path: '/trips', label: 'My Trips', icon: '📋' },
    { path: '/favorites', label: 'Favorites', icon: '❤️' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-gray-800 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:hidden
        `}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-colors
                  ${
                    isActive(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
