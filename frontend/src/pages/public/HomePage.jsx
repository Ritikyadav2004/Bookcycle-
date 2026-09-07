import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import HeroSection from '../../components/home/HeroSection';
import SearchSection from '../../components/home/SearchSection';
import FeaturedBooks from '../../components/home/FeaturedBooks';
import BrowseCategories from '../../components/home/BrowseCategories';
import RecentlyAdded from '../../components/home/RecentlyAdded';
import MostPopular from '../../components/home/MostPopular';
import RecommendedBooks from '../../components/home/RecommendedBooks';
import HowItWorks from '../../components/home/HowItWorks';
import SellBanner from '../../components/home/SellBanner';
import Sustainability from '../../components/home/Sustainability';
import Testimonials from '../../components/home/Testimonials';
import FAQ from '../../components/home/FAQ';
import Newsletter from '../../components/home/Newsletter';
import { pageTransition } from '../../animations/variants';
import { bookService } from '../../services/bookService';
import { killAllScrollTriggers, refreshScrollTrigger } from '../../animations/gsapAnimations';

const HomePage = () => {
  const [sectionsData, setSectionsData] = useState({
    featured: [],
    recent: [],
    popular: [],
    recommended: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await bookService.getHomeSections();
        setSectionsData(data);
      } catch (error) {
        console.error('Error fetching home page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Clean up GSAP ScrollTriggers on unmount
    return () => {
      killAllScrollTriggers();
    };
  }, []);

  // Refresh ScrollTrigger after content loads
  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        refreshScrollTrigger();
      }, 500);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-[76px]">
         <div className="skeleton w-full max-w-7xl h-screen mx-auto rounded-3xl" />
      </div>
    );
  }

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-col overflow-x-hidden"
    >
      <HeroSection />
      
      <div className="relative -mt-16 z-20 px-4">
        <SearchSection />
      </div>

      <div className="bg-paper-bg py-20 pb-0">
        <FeaturedBooks books={sectionsData.featured} />
      </div>

      <BrowseCategories />

      <div className="bg-paper-bg py-20">
        <RecentlyAdded books={sectionsData.recent} />
      </div>

      <HowItWorks />

      <div className="bg-paper-bg py-20">
        <MostPopular books={sectionsData.popular} />
      </div>

      <SellBanner />

      <div className="bg-paper-bg py-20">
        <RecommendedBooks books={sectionsData.recommended} />
      </div>

      <Sustainability />
      
      <Testimonials />
      
      <FAQ />
      
      <Newsletter />
    </motion.div>
  );
};

export default HomePage;
