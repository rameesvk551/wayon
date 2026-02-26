import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import DesktopHome from './pages/DesktopHome';
import { MobileLayout } from './components/layouts/MobileLayout';
import StandaloneMobileLayout from './components/layouts/StandaloneMobileLayout';

import { HomeScreen } from './pages/HomeScreen';
import ChatScreen from './pages/ChatScreen';
import { MapProvider } from './store/MapContext';
import DiscoverPage from './pages/DiscoverPage';
import PlanPage from './pages/PlanPage';
import ReviewPage from './pages/ReviewPage';
import HotelListingPage from './pages/HotelListingPage';
import BudgetTrackerPage from './pages/BudgetTrackerPage';
import PackingAssistantPage from './pages/PackingAssistantPage';
import ToursListingPage from './pages/ToursListingPage';
import TourDetailPage from './pages/TourDetailPage';
import VisaCheckerPage from './pages/VisaCheckerPage';
import VisaExplorerPage from './pages/VisaExplorerPage';
import ItineraryEditorPage from './pages/ItineraryEditorPage';
import AttractionDiscoveryPage from './pages/AttractionDiscoveryPage';
import AttractionSearchPage from './pages/AttractionSearchPage';
import AttractionDetailPage from './pages/AttractionDetailPage';
import './index.css';

// Layout wrapper for non-auth pages
const WithHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

// Main Mobile App with Tab Navigation
const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [visaSubTab, setVisaSubTab] = useState<'checker' | 'explorer'>('checker');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />;
      case 'tours':
        return <ToursListingPage />;
      case 'discover':
        return <AttractionDiscoveryPage />;
      case 'hotels':
        return <HotelListingPage />;
      case 'planner':
      case 'bot':
        return (
          <MapProvider>
            <ChatScreen onNavigate={setActiveTab} />
          </MapProvider>
        );
      case 'visa':
        return visaSubTab === 'checker' ? (
          <VisaCheckerPage />
        ) : (
          <VisaExplorerPage />
        );
      case 'budget':
        return <BudgetTrackerPage />;
      case 'packing':
        return <PackingAssistantPage />;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
    }
  };

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'visa' && (
        <div className="visa-nav-tab-group">
          <button
            className={`visa-nav-tab ${visaSubTab === 'checker' ? 'active' : ''}`}
            onClick={() => setVisaSubTab('checker')}
            type="button"
          >
            ✈️ Checker
          </button>
          <button
            className={`visa-nav-tab ${visaSubTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setVisaSubTab('explorer')}
            type="button"
          >
            🌍 Explorer
          </button>
        </div>
      )}
      {renderScreen()}
    </MobileLayout>
  );
};

// Wrapper for standalone routes that need the bottom nav
const MobileNavWrapper: React.FC<{ children: React.ReactNode; activeTab: string }> = ({ children, activeTab }) => {
  const navigate = useNavigate();
  const handleTabChange = (tab: string) => {
    const routes: Record<string, string> = {
      home: '/',
      discover: '/attractions',
      hotels: '/',
      bot: '/',
    };
    navigate(routes[tab] || '/');
  };
  return (
    <MobileLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {children}
    </MobileLayout>
  );
};

function App() {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ResponsiveRoot = () => {
    return isDesktop ? <DesktopHome /> : <MobileApp />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Home Route: Desktop vs Mobile */}
        <Route path="/" element={<ResponsiveRoot />} />

        {/* Legacy Routes with Header */}
        <Route path="/discover" element={<WithHeader><DiscoverPage /></WithHeader>} />
        <Route path="/plan/:tripId" element={<WithHeader><PlanPage /></WithHeader>} />
        <Route path="/plan/new" element={<WithHeader><PlanPage /></WithHeader>} />
        <Route path="/review/:tripId" element={<WithHeader><ReviewPage /></WithHeader>} />
        <Route path="/hotels" element={<WithHeader><HotelListingPage /></WithHeader>} />
        <Route path="/budget-tracker" element={<StandaloneMobileLayout><BudgetTrackerPage /></StandaloneMobileLayout>} />
        <Route path="/packing-assistant" element={<StandaloneMobileLayout><PackingAssistantPage /></StandaloneMobileLayout>} />
        <Route path="/tours" element={<ToursListingPage />} />
        <Route path="/tours/:tourId" element={<TourDetailPage />} />
        <Route path="/attractions" element={
          <MobileNavWrapper activeTab="discover">
            <AttractionDiscoveryPage />
          </MobileNavWrapper>
        } />
        <Route path="/attractions/:city" element={
          <MobileNavWrapper activeTab="discover">
            <AttractionSearchPage />
          </MobileNavWrapper>
        } />
        <Route path="/attractions/:city/:id" element={
          <AttractionDetailPage />
        } />
        <Route path="/visa-checker" element={<VisaCheckerPage />} />
        <Route path="/visa-explorer" element={<VisaExplorerPage />} />
        <Route path="/itinerary/:tripId/edit" element={<ItineraryEditorPage />} />

        {/* Auth Routes (no header) */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/signup" element={<SignupPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

