import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackingChecklistSection } from '../features/trip-assistant/components/packing/PackingChecklistSection';
import { TripSelector } from '../features/trip-assistant/components/TripSelector';
import '../features/trip-assistant/styles/tripAssistant.css';

const PackingAssistantPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="trip-assistant-page no-scrollbar overflow-y-auto px-4 pb-4 pt-3 min-h-screen h-full">
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-3"
      >
        <button
          type="button"
          onClick={handleBack}
          className="trip-back-btn mb-3"
          aria-label="Back"
        >
          <ArrowLeft size={13} />
          Back
        </button>
      </motion.header>
      <TripSelector />
      <PackingChecklistSection />
    </div>
  );
};

export default PackingAssistantPage;
