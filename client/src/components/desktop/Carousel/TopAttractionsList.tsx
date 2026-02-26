import React from 'react';

export interface TopAttraction {
  id: number;
  title: string;
  image: string;
  location: string;
}

interface TopAttractionsListProps {
  data: TopAttraction[];
}

const TopAttractionsList: React.FC<TopAttractionsListProps> = ({ data }) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-6">
          Top Attractions
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.slice(0, 9).map((item) => (
            <div
              key={item.id}
              className="group flex gap-3 bg-white rounded-lg hover:shadow-medium transition-all duration-300 cursor-pointer p-2"
            >
              {/* Small image */}
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Content */}
              <div className="flex flex-col justify-center flex-1 min-w-0">
                <h3 className="font-bold text-sm text-neutral-900 line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 line-clamp-1">
                  {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopAttractionsList;
