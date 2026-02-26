import React from 'react';

interface ServiceCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  gradient?: string;
}

const YatraServicesSection: React.FC = () => {
  const services: ServiceCard[] = [
    {
      id: 'adventure',
      title: 'Adventure',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop',
      gradient: 'from-green-900/60 to-transparent'
    },
    {
      id: 'trains',
      title: 'Trains',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
      gradient: 'from-purple-900/60 to-transparent'
    },
    {
      id: 'cruise',
      title: 'Cruise',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      gradient: 'from-blue-900/60 to-transparent'
    },
    {
      id: 'villas',
      title: 'Villas & Cars',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
      gradient: 'from-amber-900/60 to-transparent'
    },
    {
      id: 'luxury-trains',
      title: 'Luxury Trains',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
      gradient: 'from-yellow-900/60 to-transparent'
    },
    {
      id: 'monuments',
      title: 'Monuments',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop',
      gradient: 'from-orange-900/60 to-transparent'
    },
    {
      id: 'activities',
      title: 'Activities',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=400&h=300&fit=crop',
      gradient: 'from-gray-900/60 to-transparent'
    },
    {
      id: 'gift-voucher',
      title: 'Gift Voucher',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop',
      gradient: 'from-gray-900/60 to-transparent'
    },
    {
      id: 'visa',
      title: 'Visa',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
      gradient: 'from-blue-900/60 to-transparent'
    },
    {
      id: 'freight',
      title: 'Freight',
      subtitle: 'Coming Soon...',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop',
      gradient: 'from-gray-900/60 to-transparent'
    }
  ];

  const whyYatraPoints = [
    {
      icon: '✈️',
      title: 'Recent flight and hotels with Exclusive Deals',
      description: 'Get your hands on the lowest airfares from hundreds of airlines and hotels. First time on Yatra we also deal with exclusive deals.'
    },
    {
      icon: '💰',
      title: 'Enjoy Smart Flight Bookings on Yatra',
      description: 'Get lowest airfares from hundreds of airlines and hotels. First time on Yatra we also deal with exclusive deals.'
    },
    {
      icon: '🏖️',
      title: 'Holiday Options for Every Need and Budget',
      description: 'Choose from thousands of properties while booking with us.'
    },
    {
      icon: '🎟️',
      title: 'Customer Your Tour as well with Tailor-made Packages',
      description: 'Get hands on with the best and most affordable holiday packages.'
    },
    {
      icon: '🎫',
      title: 'Skip the Ticket Queue for Railways Bookings',
      description: 'Book confirmed train tickets with us now at assured Discounts, Flights and Hotels.'
    },
    {
      icon: '🎭',
      title: 'Manage Booking Backed by Million of Amazing Travelers',
      description: 'Experience full freedom while choosing your vacations'
    }
  ];

  return (
    <div className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Services Grid */}
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Yatra's Other Services</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="relative h-32 rounded-lg overflow-hidden cursor-pointer group transition-transform hover:scale-105 hover:shadow-xl"
            >
              <img 
                src={service.image} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient || 'from-black/60 to-transparent'}`}></div>
              <div className="absolute bottom-0 left-0 p-3 text-white">
                <h3 className="font-semibold text-sm">{service.title}</h3>
                {service.subtitle && (
                  <p className="text-xs opacity-90">{service.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Why Yatra Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left - Why Yatra Points */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Yatra?</h2>
            
            <div className="space-y-4">
              {whyYatraPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{point.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 text-xs leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Mobile App Mockup */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Location Pin Icons */}
              <div className="absolute -left-12 top-20 text-red-500 text-4xl animate-bounce">
                📍
              </div>
              <div className="absolute -right-12 top-32 text-red-500 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>
                📍
              </div>
              
              {/* Phone Mockup */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-2 border-8 border-gray-800" style={{ width: '280px', height: '560px' }}>
                {/* Phone Screen */}
                <div className="bg-gray-50 rounded-2xl h-full overflow-hidden">
                  {/* App Header */}
                  <div className="bg-white p-4 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-red-500 font-bold text-xl">yatra</span>
                      <div className="flex gap-2">
                        <span className="w-8 h-8 bg-gray-200 rounded-full"></span>
                      </div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-4 space-y-4">
                    {/* New Delhi Card */}
                    <div className="bg-white rounded-lg p-3 shadow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-500">📍</span>
                        <span className="font-semibold text-sm">New Delhi</span>
                      </div>
                      <div className="text-xs text-gray-500">Explore the capital</div>
                    </div>

                    {/* Search Tabs */}
                    <div className="bg-white rounded-lg p-3 shadow">
                      <div className="flex gap-2 mb-3">
                        <button className="px-3 py-1 bg-gray-100 rounded text-xs">Hotels</button>
                        <button className="px-3 py-1 bg-gray-100 rounded text-xs">Flights</button>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">Traveling Economy</div>
                        <div className="text-xs text-gray-600">1 Traveller</div>
                      </div>
                    </div>

                    {/* Browse Beaches Card */}
                    <div className="relative h-48 rounded-lg overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop" 
                        alt="Beach"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-3 text-white">
                        <h3 className="font-bold text-lg">Browse Beaches</h3>
                        <p className="text-xs">Relax by the sea</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YatraServicesSection;
