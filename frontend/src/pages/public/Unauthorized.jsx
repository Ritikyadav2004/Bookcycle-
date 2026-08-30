import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-warmWhite flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="w-32 h-32 bg-error/10 rounded-full flex items-center justify-center mb-8 shadow-card border border-error/20"
      >
        <ShieldAlert size={64} className="text-error" />
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl md:text-5xl font-serif font-bold text-forest mb-4"
      >
        Access Denied
      </motion.h1>
      
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-mutedText max-w-md mb-8 text-lg"
      >
        You don't have permission to access this page. Please ensure you are logged in with the correct account privileges.
      </motion.p>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button onClick={() => navigate(-1)} className="btn-secondary inline-flex items-center justify-center gap-2">
          <ArrowLeft size={18} /> Go Back
        </button>
        {!isAuthenticated ? (
          <Link to="/login" className="btn-primary inline-flex items-center justify-center gap-2">
            <LogIn size={18} /> Login
          </Link>
        ) : (
          <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
            Return Home
          </Link>
        )}
      </motion.div>
    </div>
  );
};

export default Unauthorized;
