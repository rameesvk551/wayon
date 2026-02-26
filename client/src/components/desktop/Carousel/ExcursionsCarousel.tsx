import React from 'react';
import { Star, Heart } from 'lucide-react';

export interface Excursion {
  id: number;
  title: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  price: string;
  originalPrice?: string;
  perPerson: string;
}

interface ExcursionsCarouselProps {
  data: Excursion[];
}

const ExcursionsCarousel: React.FC<ExcursionsCarouselProps> = ({ data }) => {
  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
            Discover Amazing Excursions
          </h2>
          <p className="text-neutral-600 mt-2">
            Explore the best tours and experiences
          </p>
        </div>

        {/* Excursions grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((excursion) => (
            <div
              key={excursion.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={excursion.image}
                  alt={excursion.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Wishlist button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-lg">
                  <Heart className="w-5 h-5 text-neutral-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Location */}
                <p className="text-sm font-semibold text-neutral-900 mb-2">
                  {excursion.location}
                </p>

                {/* Title */}
                <h3 className="font-bold text-base text-neutral-900 mb-2 line-clamp-2 leading-snug min-h-[3rem]">
                  {excursion.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-600 mb-3 line-clamp-3">
                  {excursion.description}
                </p>

                {/* Rating */}
                {excursion.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    <Star className="w-4 h-4 fill-neutral-900 text-neutral-900" />
                    <span className="text-sm font-semibold text-neutral-900">
                      {excursion.rating}
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="border-t pt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-neutral-600">From</span>
                    {excursion.originalPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        {excursion.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold text-accent-600">
                      {excursion.price}
                    </span>
                    <span className="text-sm text-neutral-600">
                      {excursion.perPerson}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExcursionsCarousel;
