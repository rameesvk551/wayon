import React from 'react';

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  description: string;
  rating: number;
  travelers: string;
}

const DestinationsSection: React.FC = () => {
  const destinations: Destination[] = [
    {
      id: 1,
      name: 'Paris',
      country: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
      description: 'The City of Light awaits with romance and culture',
      rating: 4.8,
      travelers: '2M+'
    },
    {
      id: 2,
      name: 'Tokyo',
      country: 'Japan',
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
      description: 'Modern meets tradition in this vibrant metropolis',
      rating: 4.9,
      travelers: '1.5M+'
    },
    {
      id: 3,
      name: 'Bali',
      country: 'Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
      description: 'Tropical paradise with stunning beaches and culture',
      rating: 4.7,
      travelers: '1.8M+'
    },
    {
      id: 4,
      name: 'New York',
      country: 'USA',
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800',
      description: 'The city that never sleeps, full of energy',
      rating: 4.6,
      travelers: '3M+'
    },
    {
      id: 5,
      name: 'Dubai',
      country: 'UAE',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
      description: 'Luxury and innovation in the desert',
      rating: 4.8,
      travelers: '1.2M+'
    },
    {
      id: 6,
      name: 'Santorini',
      country: 'Greece',
      image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800',
      description: 'White-washed beauty overlooking the Aegean Sea',
      rating: 4.9,
      travelers: '800K+'
    }
  ];

  return (
    <section id="destinations" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Popular Destinations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the world's most amazing places curated by travelers like you
          </p>
        </div>

        {/* Destinations grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Image container */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Rating badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold text-gray-800">{destination.rating}</span>
                </div>

                {/* Travelers count */}
                <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                  {destination.travelers} travelers
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">
                  {destination.name}
                </h3>
                <p className="text-gray-500 mb-3 flex items-center gap-1">
                  <span>📍</span> {destination.country}
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {destination.description}
                </p>
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105">
                  Explore {destination.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-4 bg-white text-gray-800 border-2 border-gray-300 rounded-full font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all">
            View All Destinations →
          </button>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
