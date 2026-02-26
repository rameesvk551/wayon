import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: '✈️',
      title: 'Flight Booking',
      description: 'Compare and book flights from hundreds of airlines worldwide with the best prices guaranteed.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🏨',
      title: 'Hotel Booking',
      description: 'Discover and book accommodations ranging from budget hostels to luxury resorts.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🗺️',
      title: 'Trip Planning',
      description: 'Create personalized itineraries with our AI-powered trip planning assistant.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🌍',
      title: 'Destination Search',
      description: 'Explore thousands of destinations with detailed guides, photos, and local insights.',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: '📝',
      title: 'Travel Blog',
      description: 'Read inspiring stories, tips, and guides from fellow travelers around the globe.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: '💼',
      title: 'All-in-One',
      description: 'Manage all your travel needs in one platform - flights, hotels, activities, and more.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Everything You Need for
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
              Perfect Travel Experience
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
            Our comprehensive platform offers all the tools and services you need to plan, book, and enjoy your travels
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
            >
              {/* Icon with gradient background */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl">{feature.icon}</span>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105">
            Start Planning Your Trip
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
