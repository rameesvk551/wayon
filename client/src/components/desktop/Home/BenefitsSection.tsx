import React from 'react';
import { HeadphonesIcon, Gift, Star, Calendar } from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitsSection: React.FC = () => {
  const benefits: Benefit[] = [
    {
      icon: <HeadphonesIcon className="w-8 h-8" />,
      title: '24/7 customer support',
      description: 'We\'re here for you, day and night',
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Earn rewards',
      description: 'Explore, earn credits, and save',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Millions of reviews',
      description: 'Real verified feedback',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: 'Plan your way',
      description: 'Stay flexible with free cancellation',
    },
  ];

  return (
    <section className="py-12 px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            Why book with NomadicNook?
          </h2>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4 text-accent-500">
                {benefit.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm text-neutral-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
