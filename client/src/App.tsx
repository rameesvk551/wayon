import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ChatbotPage from './pages/ChatbotPage';
import DiscoverPage from './pages/DiscoverPage';
import PlanPage from './pages/PlanPage';
import ReviewPage from './pages/ReviewPage';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Chatbot Page */}
        <Route path="/" element={<ChatbotPage />} />

        {/* Other Routes */}
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/plan/:tripId" element={<PlanPage />} />
        <Route path="/plan/new" element={<PlanPage />} />
        <Route path="/review/:tripId" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
