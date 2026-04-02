import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import DesktopHome from './pages/DesktopHome';
import DesktopLayout from './components/layouts/DesktopLayout';
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
import { FavoritesScreen } from './pages/FavoritesScreen';
import { ProfileScreen } from './pages/ProfileScreen';
import { TripsScreen } from './pages/TripsScreen';
import useIsDesktop from './hooks/useIsDesktop';
import './index.css';
import './styles/desktop.css';

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
      hotels: '/hotels',
      tours: '/tours',
      bot: '/chat',
    };
    navigate(routes[tab] || '/');
  };
  return (
    <MobileLayout activeTab={activeTab} onTabChange={handleTabChange}>
      {children}
    </MobileLayout>
  );
};

/** Responsive wrapper: shows DesktopLayout on >=1024px, passes through on mobile */
const Responsive: React.FC<{
  children: React.ReactNode;
  mobileWrapper?: 'standalone' | 'nav';
  mobileActiveTab?: string;
  desktopNoFooter?: boolean;
  desktopFullWidth?: boolean;
  desktopNoPadding?: boolean;
  desktopFullHeight?: boolean;
}> = ({
  children,
  mobileWrapper,
  mobileActiveTab = 'home',
  desktopNoFooter,
  desktopFullWidth,
  desktopNoPadding,
  desktopFullHeight,
}) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <DesktopLayout
        noFooter={desktopNoFooter}
        fullWidth={desktopFullWidth}
        noPadding={desktopNoPadding}
        fullHeight={desktopFullHeight}
      >
        {children}
      </DesktopLayout>
    );
  }

  if (mobileWrapper === 'standalone') {
    return <StandaloneMobileLayout>{children}</StandaloneMobileLayout>;
  }
  if (mobileWrapper === 'nav') {
    return (
      <MobileNavWrapper activeTab={mobileActiveTab}>
        {children}
      </MobileNavWrapper>
    );
  }
  return <>{children}</>;
};

function App() {
  const isDesktop = useIsDesktop();

  return (
    <BrowserRouter>
      <Routes>
        {/* ══════ HOME ══════ */}
        <Route path="/" element={isDesktop ? <DesktopHome /> : <MobileApp />} />

        {/* ══════ AI CHAT / PLANNER ══════ */}
        <Route path="/chat" element={
          <Responsive desktopFullHeight desktopNoFooter desktopNoPadding mobileWrapper="nav" mobileActiveTab="bot">
            <MapProvider>
              <ChatScreen />
            </MapProvider>
          </Responsive>
        } />

        {/* ══════ DISCOVER ══════ */}
        <Route path="/discover" element={
          <Responsive desktopNoPadding mobileWrapper="nav" mobileActiveTab="discover">
            <DiscoverPage />
          </Responsive>
        } />

        {/* ══════ TRIP PLANNING ══════ */}
        <Route path="/plan/:tripId" element={
          <Responsive desktopFullHeight desktopNoFooter desktopNoPadding>
            <PlanPage />
          </Responsive>
        } />
        <Route path="/plan/new" element={
          <Responsive desktopFullHeight desktopNoFooter desktopNoPadding>
            <PlanPage />
          </Responsive>
        } />
        <Route path="/review/:tripId" element={
          <Responsive desktopNoPadding>
            <ReviewPage />
          </Responsive>
        } />

        {/* ══════ HOTELS ══════ */}
        <Route path="/hotels" element={
          <Responsive desktopNoPadding mobileWrapper="nav" mobileActiveTab="hotels">
            <HotelListingPage />
          </Responsive>
        } />

        {/* ══════ TOURS ══════ */}
        <Route path="/tours" element={
          <Responsive desktopNoPadding mobileWrapper="nav" mobileActiveTab="tours">
            <ToursListingPage />
          </Responsive>
        } />
        <Route path="/tours/:tourId" element={
          <Responsive desktopNoPadding>
            <TourDetailPage />
          </Responsive>
        } />

        {/* ══════ ATTRACTIONS ══════ */}
        <Route path="/attractions" element={
          <Responsive desktopNoPadding mobileWrapper="nav" mobileActiveTab="discover">
            <AttractionDiscoveryPage />
          </Responsive>
        } />
        <Route path="/attractions/:city" element={
          <Responsive desktopNoPadding mobileWrapper="nav" mobileActiveTab="discover">
            <AttractionSearchPage />
          </Responsive>
        } />
        <Route path="/attractions/:city/:id" element={
          <Responsive desktopNoPadding>
            <AttractionDetailPage />
          </Responsive>
        } />

        {/* ══════ VISA ══════ */}
        <Route path="/visa-checker" element={
          <Responsive>
            <VisaCheckerPage />
          </Responsive>
        } />
        <Route path="/visa-explorer" element={
          <Responsive desktopNoPadding>
            <VisaExplorerPage />
          </Responsive>
        } />

        {/* ══════ TOOLS ══════ */}
        <Route path="/budget-tracker" element={
          <Responsive mobileWrapper="standalone">
            <BudgetTrackerPage />
          </Responsive>
        } />
        <Route path="/packing-assistant" element={
          <Responsive mobileWrapper="standalone">
            <PackingAssistantPage />
          </Responsive>
        } />
        <Route path="/itinerary/:tripId/edit" element={
          <Responsive desktopFullHeight desktopNoFooter desktopNoPadding>
            <ItineraryEditorPage />
          </Responsive>
        } />

        {/* ══════ USER PAGES ══════ */}
        <Route path="/favorites" element={
          <Responsive>
            <FavoritesScreen />
          </Responsive>
        } />
        <Route path="/profile" element={
          <Responsive>
            <ProfileScreen />
          </Responsive>
        } />
        <Route path="/trips" element={
          <Responsive>
            <TripsScreen />
          </Responsive>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

