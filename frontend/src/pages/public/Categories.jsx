import React from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import CategoryCard from '../../components/cards/CategoryCard';
import { pageTransition } from '../../animations/variants';

const Categories = () => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-paper-bg py-12"
    >
      <div className="section-container">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 text-emerald font-bold uppercase tracking-wider text-sm mb-3">
            <Layers size={16} />
            <span>All Categories</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-forest mb-4">
            Explore Our Collection
          </h1>
          <p className="text-mutedText text-lg">
            Browse through our extensive catalog organized by class, subject, and genre to find exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="h-full"
            >
              <CategoryCard category={category} index={index} />
            </motion.div>
          ))}
        </div>

      </div>
    </motion.div>
  );
};

export default Categories;
