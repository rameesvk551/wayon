import React from 'react';

export interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

interface BlogCarouselProps {
  data: BlogPost[];
}

const BlogCarousel: React.FC<BlogCarouselProps> = ({ data }) => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900">
            From the blog
          </h2>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((post) => (
            <div
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-lg text-neutral-900 mb-3 line-clamp-2 leading-snug min-h-[3.5rem]">
                  {post.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>

                {/* Date */}
                <p className="text-xs text-neutral-500 mt-auto">
                  {post.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogCarousel;
