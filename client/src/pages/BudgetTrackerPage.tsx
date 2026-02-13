import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BudgetTrackerSection } from '../features/trip-assistant/components/budget/BudgetTrackerSection';
import '../features/trip-assistant/styles/tripAssistant.css';

const BudgetTrackerPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/');
  };

  return (
    <div className="sb-page no-scrollbar overflow-y-auto">
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sb-header"
      >
        <button
          type="button"
          onClick={handleBack}
          className="sb-back-btn"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="sb-title">Spending Breakdown</h1>
      </motion.header>
      <BudgetTrackerSection />
    </div>
  );
};

export default BudgetTrackerPage;
