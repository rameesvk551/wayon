import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, TripBuilderPage, ItineraryPage } from './pages';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/discover" element={<TripBuilderPage />} />
        <Route path="/itinerary/:tripId" element={<ItineraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
