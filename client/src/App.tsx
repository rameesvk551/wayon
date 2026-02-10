import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './components/layouts/MobileLayout';
import AppHeader from './components/AppHeader';
import ToursScreen from './pages/ToursScreen';
import HotelsScreen from './pages/HotelsScreen';
import ChatScreen from './pages/ChatScreen';
import HomeScreen from './pages/HomeScreen';
import TripsScreen from './pages/TripsScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import ProfileScreen from './pages/ProfileScreen';
import { MapProvider } from './store/MapContext';
import DiscoverPage from './pages/DiscoverPage';
import PlanPage from './pages/PlanPage';
import ReviewPage from './pages/ReviewPage';
import HotelListingPage from './pages/HotelListingPage';
import './index.css';

// Layout wrapper that includes AppHeader for non-auth pages
const WithHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <AppHeader />
    {children}
  </>
);

// Main Mobile App with Tab Navigation
const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tours');

  const renderScreen = () => {
    switch (activeTab) {
      case 'tours':
        return <ToursScreen />;
      case 'hotels':
        return <HotelListingPage />;
      case 'planner':
        return (
          <MapProvider>
            <ChatScreen onNavigate={setActiveTab} />
          </MapProvider>
        );
      case 'bot':
        return (
          <MapProvider>
            <ChatScreen onNavigate={setActiveTab} />
          </MapProvider>
        );
      default:
        return <ToursScreen />;
    }
  };

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderScreen()}
    </MobileLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Mobile App */}
        <Route path="/" element={<MobileApp />} />

        {/* Legacy Routes with Header */}
        <Route path="/discover" element={<WithHeader><DiscoverPage /></WithHeader>} />
        <Route path="/plan/:tripId" element={<WithHeader><PlanPage /></WithHeader>} />
        <Route path="/plan/new" element={<WithHeader><PlanPage /></WithHeader>} />
        <Route path="/review/:tripId" element={<WithHeader><ReviewPage /></WithHeader>} />
        <Route path="/hotels" element={<WithHeader><HotelListingPage /></WithHeader>} />

        {/* Auth Routes (no header) */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/signup" element={<SignupPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
