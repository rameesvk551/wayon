import React from 'react';

const CallToActionSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main CTA content */}
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Ready to Start Your
          <span className="block mt-2">Adventure?</span>
        </h2>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
          Join thousands of travelers who trust us to plan their perfect journey. 
          Your next adventure is just a click away!
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 hover:bg-gray-50">
            Start Planning Now
          </button>
          <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all hover:scale-105">
            Browse Destinations
          </button>
        </div>

        {/* Newsletter signup */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Get Travel Inspiration & Deals
          </h3>
          <p className="text-white/80 mb-6">
            Subscribe to our newsletter for exclusive offers and travel tips
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-white text-gray-800"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
            <div className="text-white/80">Happy Travelers</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
            <div className="text-white/80">Destinations</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
            <div className="text-white/80">Hotels Partner</div>
          </div>
          <div className="text-white">
            <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
            <div className="text-white/80">Support</div>
          </div>
        </div>

        {/* Social proof */}
        <div className="mt-12 pt-12 border-t border-white/20">
          <p className="text-white/80 mb-4">Trusted by travelers worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <span className="text-white text-sm">★★★★★ 4.9/5 on TrustPilot</span>
            <span className="text-white text-sm">★★★★★ 4.8/5 on Google</span>
            <span className="text-white text-sm">★★★★★ 4.9/5 on App Store</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
