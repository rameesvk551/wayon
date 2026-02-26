import React, { useState } from 'react';

import HeroSection from '../components/desktop/Home/HeroSection';
import BenefitsSection from '../components/desktop/Home/BenefitsSection';
import FlexibilitySection from '../components/desktop/Home/FlexibilitySection';
import RouteFinderSection from '../components/desktop/Home/RouteFinderSection';
import YatraServicesSection from '../components/desktop/Home/YatraServicesSection';
import Navbar from '../components/desktop/Navbar/Navbar';
import Sidebar from '../components/desktop/Sidebar/Sidebar';
import Footer from '../components/desktop/Footer/Footer';
// Carousel imports
import TopDestinationsCarousel from '../components/desktop/Carousel/TopDestinationsCarousel';
import TopAttractionsList from '../components/desktop/Carousel/TopAttractionsList';
import ToursCarousel from '../components/desktop/Carousel/ToursCarousel';
import WarmDestinationsCarousel from '../components/desktop/Carousel/WarmDestinationsCarousel';
import ExcursionsCarousel from '../components/desktop/Carousel/ExcursionsCarousel';
import BlogCarousel from '../components/desktop/Carousel/BlogCarousel';
import {
  topDestinations,
  topAttractions,
  warmDestinations,
  topTours,
  frenchRivieraExcursions,
  blogPosts,
} from '../components/desktop/Carousel/carouselData';

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="pt-16 max-w-[1600px] mx-auto overflow-hidden">
        {/* Viator-inspired section order */}
        <HeroSection />
        <BenefitsSection />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 overflow-hidden">
          <TopDestinationsCarousel data={topDestinations} />
          <FlexibilitySection />
          <TopAttractionsList data={topAttractions} />
          <ExcursionsCarousel data={frenchRivieraExcursions} />
          <ToursCarousel data={topTours} />
          <WarmDestinationsCarousel data={warmDestinations} />
          <BlogCarousel data={blogPosts} />
        </div>
        <YatraServicesSection />
        <RouteFinderSection />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
