import React from 'react';
import { Star, Heart } from 'lucide-react';

export interface Tour {
  id: number;
  title: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  duration: string;
  badge?: string;
}

interface ToursCarouselProps {
  data: Tour[];
}

const ToursCarousel: React.FC<ToursCarouselProps> = ({ data }) => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Top Tours
            </h2>
            <p className="text-sm text-accent-500 mt-1">Likely to sell out</p>
          </div>
        </div>

        {/* Tours grid/carousel */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4">
          {data.map((tour) => (
            <div
              key={tour.id}
              className="group flex-shrink-0 w-72 bg-white rounded-xl shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer snap-start"
            >
              {/* Image */}
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Badge */}
                {tour.badge && (
                  <div className="absolute top-3 left-3 bg-accent-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {tour.badge}
                  </div>
                )}
                
                {/* Wishlist button */}
                <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors shadow-soft">
                  <Heart className="w-4 h-4 text-neutral-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Location */}
                <p className="text-xs text-neutral-600 mb-2">{tour.location}</p>

                {/* Title */}
                <h3 className="font-bold text-base text-neutral-900 mb-3 line-clamp-2 leading-tight">
                  {tour.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold text-neutral-900">{tour.rating}</span>
                  </div>
                  <span className="text-xs text-neutral-600">({tour.reviewCount})</span>
                </div>

                {/* Duration */}
                <p className="text-xs text-neutral-600 mb-3">{tour.duration}</p>

                {/* Price */}
                <div className="flex items-baseline gap-1">
                  <span className="text-xs text-neutral-600">From</span>
                  <span className="text-lg font-bold text-neutral-900">{tour.price}</span>
                  <span className="text-xs text-neutral-600">per group (up to 15)</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows (visual only) */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors">
            <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center hover:bg-neutral-100 transition-colors">
            <svg className="w-5 h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ToursCarousel;
