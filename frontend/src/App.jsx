import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { Outlet } from 'react-router-dom';
import useUIStore from './store/uiStore';
import QuickViewModal from './components/common/QuickViewModal';

// App is primarily handled by RouterProvider in main.jsx.
// This component might be used as a top-level wrapper if needed.

function App() {
  const { isPageLoading, setPageLoading } = useUIStore();

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Simulate initial page load
    setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => {
      lenis.destroy();
    };
  }, [setPageLoading]);

  return (
    <>
      <Outlet />
      <QuickViewModal />
    </>
  );
}

export default App;
