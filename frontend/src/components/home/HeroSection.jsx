import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BookOpen, ArrowRight, BookMarked, Sparkles } from 'lucide-react';
import { wordRevealContainer, wordRevealChild, floatingBook } from '../../animations/variants';
import { initParallax } from '../../animations/gsapAnimations';
import useAuthStore from '../../store/authStore';

const HeroSection = () => {
  const containerRef = useRef(null);
  const { isAuthenticated, role } = useAuthStore();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    initParallax('.parallax-element', 0.2);
  }, []);

  const titleWords = "Give Books a Second Story".split(" ");

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[90vh] flex items-center pt-20 pb-28 lg:pt-32 lg:pb-40 overflow-hidden bg-gradient-hero"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald rounded-full opacity-20 blur-3xl translate-x-1/3 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/4" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} />
      </div>

      <div className="section-container relative z-10 w-full h-full flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
        
        {/* Text Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center items-start pt-10 lg:pt-0">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cream-dark font-medium mb-6 text-sm"
          >
            <Sparkles size={16} className="text-amber-light" />
            <span>Join India's largest sustainable bookstore</span>
          </motion.div>

          <motion.h1 
            variants={wordRevealContainer}
            initial="hidden"
            animate="visible"
            aria-label="Give Books a Second Story"
            className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-6 perspective-1000"
          >
            {titleWords.map((word, index) => (
              <React.Fragment key={index}>
                <motion.span 
                  variants={wordRevealChild}
                  className={`inline-block mr-4 mb-2 ${index === 3 || index === 4 ? 'text-amber-light' : ''}`}
                >
                  {word}
                </motion.span>
                {' '}
              </React.Fragment>
            ))}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-cream/90 font-sans max-w-xl mb-10 leading-relaxed"
          >
            Discover affordable pre-owned books, sell the books you no longer need, and help create a sustainable reading community.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/browse" className="btn-amber text-lg py-4 px-8 magnetic-btn group">
              Browse Used Books
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {isAuthenticated && role === 'seller' ? (
               <Link to="/seller/add-book" className="btn-secondary text-lg py-4 px-8 magnetic-btn text-white bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40">
                  <BookMarked size={20} />
                  Add New Listing
               </Link>
            ) : (
              <Link to="/seller/register" className="btn-secondary text-lg py-4 px-8 magnetic-btn text-white bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40">
                <BookOpen size={20} />
                Start Selling
              </Link>
            )}
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 flex items-center gap-6 text-cream/70 text-sm font-medium"
          >
             <div className="flex -space-x-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-forest bg-emerald flex items-center justify-center text-white text-xs font-bold z-10 shadow-sm" style={{ zIndex: 10 - i }}>
                    U{i}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white font-bold">15,000+ Books</p>
                <p>successfully exchanged</p>
              </div>
          </motion.div>
        </div>

        {/* Illustration & Floating Books */}
        <div className="w-full lg:w-[45%] h-[400px] lg:h-[600px] relative hidden md:block">
          {/* Main animated book graphic */}
          <motion.div 
            style={{ y: y1, opacity }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative w-[300px] h-[200px] sm:w-[400px] sm:h-[260px] perspective-1200">
               {/* 3D Open Book using CSS */}
               <motion.div 
                 animate={{ rotateX: [15, 25, 15], rotateZ: [-5, 0, -5] }}
                 transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                 className="w-full h-full relative transform-style-3d"
               >
                 {/* Left Page */}
                 <div className="absolute right-[50%] top-0 bottom-0 w-[48%] bg-cream rounded-l-lg shadow-[-10px_10px_20px_rgba(0,0,0,0.3)] border-r border-gray-300 origin-right transform -rotate-y-12">
                   <div className="absolute inset-4 border-2 border-dashed border-gray-300 rounded opacity-30 flex items-center justify-center">
                     <BookOpen size={48} className="text-emerald opacity-20" />
                   </div>
                 </div>
                 
                 {/* Right Page */}
                 <div className="absolute left-[50%] top-0 bottom-0 w-[48%] bg-cream rounded-r-lg shadow-[10px_10px_20px_rgba(0,0,0,0.3)] border-l border-gray-300 origin-left transform rotate-y-12">
                    <div className="absolute inset-4 flex flex-col gap-3 opacity-30">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-full"></div>
                      <div className="h-2 bg-gray-300 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-300 rounded w-full mt-4"></div>
                      <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                    </div>
                 </div>
                 
                 {/* Binding */}
                 <div className="absolute left-[49%] right-[49%] top-[-2%] bottom-[-2%] bg-[#102D1F] rounded-full shadow-inner z-10"></div>
                 
                 {/* Glow effect */}
                 <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] bg-amber blur-3xl opacity-20 rounded-full z-0"></div>
               </motion.div>
            </div>
          </motion.div>

          {/* Floating real books */}
          <motion.div 
            variants={floatingBook(0)}
            animate="animate"
            style={{ y: y2 }}
            className="absolute top-10 left-0 w-32 h-44 rounded-lg shadow-2xl overflow-hidden border-2 border-white/20 parallax-element"
          >
            <img src="/book-images/class-12/01-flamingo.webp" alt="Flamingo Class 12" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div 
            variants={floatingBook(1.5)}
            animate="animate"
            className="absolute top-1/4 right-0 w-28 h-40 rounded-lg shadow-2xl overflow-hidden border-2 border-white/20 z-20 parallax-element"
          >
            <img src="/book-images/class-10/05-science.webp" alt="Science Class 10" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div 
            variants={floatingBook(0.8)}
            animate="animate"
            className="absolute bottom-1/4 left-16 w-36 h-48 rounded-lg shadow-2xl overflow-hidden border-2 border-white/20 z-30 parallax-element"
          >
            <img src="/book-images/class-11/04-mathematics.webp" alt="Math Class 11" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div 
            variants={floatingBook(2.2)}
            animate="animate"
            className="absolute bottom-10 right-10 w-24 h-36 rounded-lg shadow-2xl overflow-hidden border-2 border-white/20 z-10 parallax-element"
          >
            <img src="/book-images/class-9/08-democratic-politics-i.webp" alt="Democratic Politics Class 9" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-cream-dark/60 text-xs font-semibold tracking-widest uppercase">Scroll to explore</span>
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 border-2 border-cream-dark/40 rounded-full flex justify-center p-1"
        >
          <div className="w-1 h-2 bg-emerald rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
