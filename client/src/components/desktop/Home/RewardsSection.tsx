import React from 'react';
import { useNavigate } from 'react-router-dom';

const RewardsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 px-4 bg-purple-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
          Log in to manage bookings & NomadicNook Rewards
        </h2>
        
        <p className="text-sm md:text-base text-neutral-600 mb-6">
          Track your bookings and earn rewards
        </p>

        {/* Login button */}
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-semibold transition-colors duration-200 shadow-soft hover:shadow-medium"
        >
          Log in
        </button>

        {/* Additional link */}
        <div className="mt-6">
          <a href="#" className="text-sm text-neutral-700 underline hover:text-neutral-900">
            Why are we seeing these recommendations?
          </a>
        </div>
      </div>
    </section>
  );
};

export default RewardsSection;
