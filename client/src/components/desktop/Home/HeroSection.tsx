import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [whereQuery, setWhereQuery] = useState('');
  const [whatQuery, setWhatQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&h=1080&fit=crop',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    console.log('Searching for:', { where: whereQuery, what: whatQuery });
    // Add search logic here
  };

  return (
    <div className="relative bg-neutral-100 overflow-hidden">
      {/* Background image carousel */}
      <div className="absolute inset-0">
        {slides.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-white"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main heading - Viator style */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 tracking-tight">
            Discover more with NomadicNook
          </h1>
          
          <p className="text-base md:text-lg text-neutral-600 mb-10 max-w-2xl mx-auto">
            Your journey to authentic travel experiences starts here
          </p>

          {/* Search module - Viator inspired clean white card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4 items-end">
              {/* Where input */}
              <div className="text-left">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Where to?
                </label>
                <input
                  type="text"
                  value={whereQuery}
                  onChange={(e) => setWhereQuery(e.target.value)}
                  placeholder="Search destinations or activities"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder-neutral-400"
                />
              </div>

              {/* What input */}
              <div className="text-left">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  When
                </label>
                <input
                  type="text"
                  value={whatQuery}
                  onChange={(e) => setWhatQuery(e.target.value)}
                  placeholder="Select dates"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder-neutral-400"
                />
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                <span className="hidden md:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Carousel dots indicator (interactive) */}
          <div className="flex justify-center gap-2 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-neutral-900 w-8'
                    : 'bg-neutral-400 hover:bg-neutral-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
