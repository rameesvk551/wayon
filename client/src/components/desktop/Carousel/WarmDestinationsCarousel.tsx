import React from 'react';

export interface WarmDestination {
  id: number;
  title: string;
  image: string;
  label: string;
}

interface WarmDestinationsCarouselProps {
  data: WarmDestination[];
}

const WarmDestinationsCarousel: React.FC<WarmDestinationsCarouselProps> = ({ data }) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
          Warm Destinations
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {data.slice(0, 4).map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden cursor-pointer h-80 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {/* Background image */}
              <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-2xl mb-1">{item.title}</h3>
                <p className="text-white/90 text-sm">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WarmDestinationsCarousel;
