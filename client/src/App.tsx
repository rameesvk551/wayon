import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './components/layouts/MobileLayout';
import HomeScreen from './pages/HomeScreen';
import ChatScreen from './pages/ChatScreen';
import TripsScreen from './pages/TripsScreen';
import FavoritesScreen from './pages/FavoritesScreen';
import ProfileScreen from './pages/ProfileScreen';
import { MapProvider } from './store/MapContext';
import DiscoverPage from './pages/DiscoverPage';
import PlanPage from './pages/PlanPage';
import ReviewPage from './pages/ReviewPage';
import './index.css';

// Main Mobile App with Tab Navigation
const MobileApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={setActiveTab} />;
      case 'chat':
        return (
          <MapProvider>
            <ChatScreen onNavigate={setActiveTab} />
          </MapProvider>
        );
      case 'trips':
        return <TripsScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen onNavigate={setActiveTab} />;
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

        {/* Legacy Routes for deep links */}
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/plan/:tripId" element={<PlanPage />} />
        <Route path="/plan/new" element={<PlanPage />} />
        <Route path="/review/:tripId" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
