import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { pageTransition } from '../animations/variants';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-paper-bg overflow-hidden">
      
      {/* Left side - Decorative */}
      <div className="hidden md:flex flex-col justify-between w-1/2 lg:w-[45%] bg-gradient-hero text-white p-10 relative overflow-hidden">
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-40 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 -rotate-12"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 left-10 w-40 h-56 bg-emerald/30 backdrop-blur-sm rounded-lg border border-white/20 rotate-6"
        />
        
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-16 inline-flex hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
              <BookOpen size={28} className="text-white" />
            </div>
            <span className="font-serif text-3xl font-bold tracking-tight">
              Book<span className="text-emerald-300">Cycle</span>
            </span>
          </Link>
          
          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
              Give Books a <br/><span className="text-amber-light">Second Story</span>
            </h1>
            <p className="text-lg text-cream/90 mb-8 font-sans leading-relaxed">
              Join thousands of readers in our sustainable marketplace. 
              Buy affordable pre-owned books or sell the ones you've finished reading.
            </p>
            
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-forest bg-emerald flex items-center justify-center text-xs font-bold z-10" style={{ zIndex: 10 - i }}>
                    U{i}
                  </div>
                ))}
              </div>
              <span className="text-cream">Join 8,500+ readers</span>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-cream/60">
          &copy; {new Date().getFullYear()} BookCycle. All rights reserved.
        </div>
      </div>
      
      {/* Right side - Form area */}
      <div className="w-full md:w-1/2 lg:w-[55%] flex flex-col min-h-screen bg-warmWhite relative">
        <div className="absolute top-6 left-6 md:hidden z-20">
          <Link to="/" className="flex items-center gap-2 text-forest font-bold font-serif text-xl">
             <BookOpen size={24} className="text-emerald" /> BookCycle
          </Link>
        </div>
        
        <div className="absolute top-6 right-6 z-20">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-mutedText hover:text-forest transition-colors bg-white/50 px-3 py-1.5 rounded-full backdrop-blur-sm border border-forest/10">
             <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-20 relative z-10 overflow-y-auto no-scrollbar">
          <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full max-w-md mx-auto"
          >
            <Outlet />
          </motion.div>
        </div>
        
        {/* Subtle texture for right side */}
        <div className="absolute inset-0 bg-paper-texture opacity-30 pointer-events-none z-0" />
      </div>
    </div>
  );
};

export default AuthLayout;
