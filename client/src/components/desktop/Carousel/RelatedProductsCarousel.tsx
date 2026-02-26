import React from 'react';
import CarouselWrapper from './CarouselWrapper';
import { Star } from 'lucide-react';

export interface RelatedProduct {
  id: number;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  oldPrice: number;
  location: string;
}

interface RelatedProductsCarouselProps {
  data: RelatedProduct[];
}

const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({ data }) => {
  return (
    <CarouselWrapper
      title="Related Products"
      cardWidth="w-[250px] md:w-[270px] lg:w-[290px] xl:w-[310px]"
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
            <span className="text-gray-500 text-xs mb-1">{item.location}</span>
            <h3 className="font-bold text-base text-gray-900 leading-tight line-clamp-2 mb-1">{item.title}</h3>
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 mr-1" fill="#F4B400" stroke="#F4B400" />
              <span className="font-semibold text-gray-800 text-base mr-2">{item.rating}</span>
              <span className="text-gray-500 text-sm">({item.reviews} Reviews)</span>
            </div>
            <div className="flex items-end gap-2 mt-auto">
              <span className="text-gray-400 text-sm line-through">₹{item.oldPrice.toLocaleString()}</span>
              <span className="font-bold text-lg text-indigo-600">₹{item.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </CarouselWrapper>
  );
};

export default RelatedProductsCarousel;
