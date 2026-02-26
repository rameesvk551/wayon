import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselWrapperProps {
  children: React.ReactNode;
  className?: string;
  cardWidth: string;
  cardGap: string;
  title?: string;
  subtitle?: string;
}

const CarouselWrapper: React.FC<CarouselWrapperProps> = ({
  children,
  className = '',
  cardWidth,
  cardGap,
  title,
  subtitle,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = dir === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-500 mt-1 text-base">{subtitle}</p>}
        </div>
      )}
      <button
        aria-label="Scroll left"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-gray-200 shadow-lg rounded-full p-2 transition-all duration-200"
        onClick={() => scroll('left')}
        style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }}
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth ${cardGap} pb-2`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {React.Children.map(children, (child, idx) => (
          <div
            className={`snap-start ${cardWidth} shrink-0`}
            style={{ minWidth: cardWidth, maxWidth: cardWidth }}
            key={idx}
          >
            {child}
          </div>
        ))}
      </div>
      <button
        aria-label="Scroll right"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-gray-200 shadow-lg rounded-full p-2 transition-all duration-200"
        onClick={() => scroll('right')}
        style={{ boxShadow: '0 2px 12px 0 rgba(0,0,0,0.08)' }}
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
};

export default CarouselWrapper;
