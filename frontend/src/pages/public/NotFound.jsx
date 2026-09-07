import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookX, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-warmWhite flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-card border border-forest/5"
      >
        <BookX size={64} className="text-emerald" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-6xl font-serif font-bold text-forest mb-4"
      >
        404
      </motion.h1>
      
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-bold text-darkText mb-4"
      >
        Page Not Found
      </motion.h2>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-mutedText max-w-md mb-8"
      >
        Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <Home size={18} /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
