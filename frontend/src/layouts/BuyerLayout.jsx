import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import MobileBottomNav from '../components/common/MobileBottomNav';
import { BUYER_NAV_LINKS } from '../constants';
import { pageTransition } from '../animations/variants';
import useUIStore from '../store/uiStore';

const BuyerLayout = () => {
  const location = useLocation();
  const { isSidebarCollapsed } = useUIStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-warmWhite overflow-hidden">
      <Sidebar links={BUYER_NAV_LINKS} />
      <MobileBottomNav links={BUYER_NAV_LINKS} variant="buyer" />
      
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white border-b border-forest/10 flex items-center px-6 md:hidden sticky top-0 z-30">
          <h1 className="font-serif font-bold text-lg text-forest">BookCycle Buyer</h1>
          {/* Mobile menu toggle would go here */}
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-7xl mx-auto w-full h-full pb-20 md:pb-0"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default BuyerLayout;
