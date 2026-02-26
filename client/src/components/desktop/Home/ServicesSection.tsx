import React from 'react';

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  link: string;
}

const ServicesSection: React.FC = () => {
  const services: Service[] = [
    {
      icon: '🗓️',
      title: 'Trip Planning',
      description: 'Create the perfect itinerary with our intelligent planning tools',
      features: ['AI-powered suggestions', 'Custom itineraries', 'Budget calculator', 'Share with friends'],
      link: '/trip-planner'
    },
    {
      icon: '🏨',
      title: 'Hotel Booking',
      description: 'Find and book the perfect place to stay for your journey',
      features: ['Best price guarantee', '1M+ properties', 'Instant confirmation', 'Free cancellation'],
      link: '/hotels'
    },
    {
      icon: '✈️',
      title: 'Flight Booking',
      description: 'Compare and book flights from airlines around the world',
      features: ['Multi-airline search', 'Flexible dates', 'Seat selection', 'Price alerts'],
      link: '/flights'
    },
    {
      icon: '📝',
      title: 'Travel Blog',
      description: 'Get inspired by stories and tips from fellow travelers',
      features: ['Travel guides', 'Local tips', 'Photo galleries', 'Community reviews'],
      link: '/blog'
    }
  ];

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive travel solutions designed to make your journey seamless and memorable
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col h-full">
                {/* Icon and title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Features list */}
                <ul className="space-y-3 mb-6 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700">
                      <span className="text-green-500 text-xl">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA button */}
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105">
                  Explore {service.title}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom info section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Why Choose Our Platform?
          </h3>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            We combine cutting-edge technology with personalized service to deliver an unmatched travel experience
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-white/90">Customer Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-white/90">Secure Booking</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Best</div>
              <div className="text-white/90">Price Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
