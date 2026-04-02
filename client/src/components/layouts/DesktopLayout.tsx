import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../desktop/Navbar/Navbar';
import Sidebar from '../desktop/Sidebar/Sidebar';
import Footer from '../desktop/Footer/Footer';

interface DesktopLayoutProps {
  children: React.ReactNode;
  /** Hide footer for full-height pages like chat, plan, itinerary editor */
  noFooter?: boolean;
  /** Make content full width (no max-width container) */
  fullWidth?: boolean;
  /** Remove padding from main content area */
  noPadding?: boolean;
  /** Make the page fill the entire viewport (chat, plan) */
  fullHeight?: boolean;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  noFooter = false,
  fullWidth = false,
  noPadding = false,
  fullHeight = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine active nav from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/visa')) return 'Visa Explorer';
    if (path.startsWith('/hotels')) return 'Hotels';
    if (path.startsWith('/tours')) return 'Tours';
    if (path.startsWith('/attractions')) return 'Attractions';
    if (path.startsWith('/plan')) return 'Trip Planner';
    if (path.startsWith('/chat')) return 'AI Assistant';
    if (path.startsWith('/budget')) return 'Budget Tracker';
    if (path.startsWith('/packing')) return 'Packing Assistant';
    if (path.startsWith('/itinerary')) return 'Itinerary Editor';
    if (path.startsWith('/review')) return 'Trip Review';
    if (path.startsWith('/discover')) return 'Discover';
    if (path.startsWith('/favorites')) return 'Favorites';
    if (path.startsWith('/profile')) return 'Profile';
    if (path.startsWith('/trips')) return 'My Trips';
    return '';
  };

  const pageTitle = getPageTitle();

  if (fullHeight) {
    return (
      <div className="desktop-layout desktop-layout--full-height">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="desktop-layout__main desktop-layout__main--full-height">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="desktop-layout">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main
        className={`desktop-layout__main ${noPadding ? '' : 'desktop-layout__main--padded'} ${fullWidth ? 'desktop-layout__main--full-width' : ''}`}
      >
        {/* Breadcrumb / page title */}
        {pageTitle && !noPadding && (
          <div className="desktop-layout__breadcrumb">
            <span className="desktop-layout__breadcrumb-home">Home</span>
            <span className="desktop-layout__breadcrumb-sep">/</span>
            <span className="desktop-layout__breadcrumb-current">{pageTitle}</span>
          </div>
        )}

        <div className={fullWidth ? '' : 'desktop-layout__container'}>
          {children}
        </div>
      </main>

      {!noFooter && <Footer />}
    </div>
  );
};

export default DesktopLayout;
