import React from 'react';

const RouteFinderSection: React.FC = () => {
  return (
    <section className="py-20 bg-[#E8EEF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Find everything<br />you need along<br />your route
            </h2>
            <p className="text-gray-600 mb-4 text-base leading-relaxed">
              Route from A to B to discover what you love in between, explore places within a set distance from your route.
            </p>

            {/* Category Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">🏔️</span>
                The Great Outdoors
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">💎</span>
                Activities & Experiences
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">🍽️</span>
                Food & Drink
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">🏕️</span>
                Parks to Camp
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">⛽</span>
                Fuel & Rest Stops
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">🏨</span>
                Hotels & Unique Stays
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">🛍️</span>
                Shopping
              </button>
              <button className="flex items-center gap-2 px-4 py-3 bg-white rounded-full text-sm font-medium text-gray-800">
                <span className="text-lg">🎡</span>
                Sights & Attractions
              </button>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Route from A to B to discover what you love in between, explore places within a set distance from your route.
            </p>
          </div>

          {/* Right Content - Map */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl overflow-hidden">
              {/* Map placeholder with route visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background map styling */}
                  <rect width="600" height="400" fill="#E8F3F5"/>
                  
                  {/* Route line */}
                  <path 
                    d="M 50 200 Q 150 150, 250 180 T 550 200" 
                    stroke="#0EA5E9" 
                    strokeWidth="4" 
                    fill="none"
                    strokeDasharray="8 4"
                  />
                  
                  {/* Location markers */}
                  <circle cx="50" cy="200" r="8" fill="#0EA5E9"/>
                  <circle cx="550" cy="200" r="8" fill="#0EA5E9"/>
                  
                  {/* Points of interest along route */}
                  <circle cx="150" cy="150" r="6" fill="#10B981"/>
                  <circle cx="250" cy="180" r="6" fill="#F59E0B"/>
                  <circle cx="350" cy="170" r="6" fill="#EF4444"/>
                  <circle cx="450" cy="190" r="6" fill="#8B5CF6"/>
                  
                  {/* Decorative elements - mountains, trees, etc */}
                  <text x="100" y="120" fontSize="24">🏔️</text>
                  <text x="200" y="240" fontSize="24">🏕️</text>
                  <text x="300" y="130" fontSize="24">🍔</text>
                  <text x="400" y="250" fontSize="24">⛽</text>
                  <text x="500" y="160" fontSize="24">🏨</text>
                  
                  {/* Legend box */}
                  <rect x="10" y="10" width="140" height="80" fill="white" rx="8" opacity="0.95"/>
                  <text x="20" y="30" fontSize="12" fill="#374151" fontWeight="600">Route & Stops</text>
                  <circle cx="20" cy="45" r="4" fill="#0EA5E9"/>
                  <text x="30" y="50" fontSize="11" fill="#6B7280">Your Route</text>
                  <circle cx="20" cy="65" r="4" fill="#10B981"/>
                  <text x="30" y="70" fontSize="11" fill="#6B7280">National Parks</text>
                </svg>
              </div>
              
              {/* Info cards on map */}
              <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-3 h-3" />
                  <span className="text-gray-700">Beaches & Sports Spots</span>
                </div>
              </div>
              
              <div className="absolute top-14 right-4 bg-white px-3 py-2 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-3 h-3" />
                  <span className="text-gray-700">Coffee Shops</span>
                </div>
              </div>
              
              <div className="absolute bottom-14 left-4 bg-white px-3 py-2 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-3 h-3" />
                  <span className="text-gray-700">National Parks</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-3 h-3" />
                  <span className="text-gray-700">State Parks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteFinderSection;
