import React from 'react';
import { Link } from 'react-router-dom';
import { User, Store, ArrowRight } from 'lucide-react';

const RoleSelector = () => {
  return (
    <div className="w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif font-bold text-forest mb-2">Welcome to BookCycle</h2>
        <p className="text-mutedText">Please select your account type to continue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Buyer Option */}
        <Link 
          to="/buyer/login"
          className="bg-white p-8 rounded-3xl border border-forest/10 shadow-sm hover:shadow-md hover:border-emerald/30 transition-all duration-300 group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-emerald/10 text-emerald flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald group-hover:text-white transition-all duration-300">
            <User size={32} />
          </div>
          <h3 className="text-xl font-bold text-forest mb-3">I am a Buyer</h3>
          <p className="text-mutedText text-sm mb-6 flex-1">
            Browse and buy pre-owned books at affordable prices.
          </p>
          <div className="flex items-center gap-1 text-sm font-semibold text-emerald group-hover:text-forest transition-colors">
            Login as Buyer <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Seller Option */}
        <Link 
          to="/seller/login"
          className="bg-white p-8 rounded-3xl border border-forest/10 shadow-sm hover:shadow-md hover:border-amber/30 transition-all duration-300 group flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-amber/10 text-amber-dark flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-amber group-hover:text-white transition-all duration-300">
            <Store size={32} />
          </div>
          <h3 className="text-xl font-bold text-forest mb-3">I am a Seller</h3>
          <p className="text-mutedText text-sm mb-6 flex-1">
            List your used books and sell to thousands of readers.
          </p>
          <div className="flex items-center gap-1 text-sm font-semibold text-amber-dark group-hover:text-forest transition-colors">
            Login as Seller <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

      </div>
    </div>
  );
};

export default RoleSelector;
