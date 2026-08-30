import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PageLoader from '../components/common/PageLoader';
import GlobalSearchOverlay from '../components/common/GlobalSearchOverlay';
import useUIStore from '../store/uiStore';
import { pageTransition } from '../animations/variants';

const PublicLayout = () => {
  const location = useLocation();
  const { isPageLoading } = useUIStore();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isPageLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-paper-bg overflow-hidden">
      <Navbar />
      <GlobalSearchOverlay />
      
      <main className="flex-1 w-full pt-[76px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLayout;
