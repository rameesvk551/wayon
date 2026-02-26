import React from 'react';
import CarouselWrapper from './CarouselWrapper';
import { Star } from 'lucide-react';

export interface TopActivity {
  id: number;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  location: string;
}

interface TopActivitiesCarouselProps {
  data: TopActivity[];
}

const TopActivitiesCarousel: React.FC<TopActivitiesCarouselProps> = ({ data }) => {
  return (
    <CarouselWrapper
      title="Top Activities"
      cardWidth="w-[270px] md:w-[300px] lg:w-[320px] xl:w-[340px]"
      cardGap="gap-6 md:gap-7 lg:gap-8"
      className="mb-12"
    >
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col h-full"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-all duration-300"
            />
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-center mb-1">
              <Star className="h-5 w-5 mr-1" fill="#F4B400" stroke="#F4B400" />
              <span className="font-semibold text-gray-800 text-base mr-2">{item.rating}</span>
              <span className="text-gray-500 text-sm">({item.reviews} reviews)</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2 mb-1">{item.title}</h3>
            <span className="text-gray-500 text-sm mb-2">{item.location}</span>
            <span className="font-bold text-indigo-600 text-lg mt-auto">₹{item.price.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </CarouselWrapper>
  );
};

export default TopActivitiesCarousel;
