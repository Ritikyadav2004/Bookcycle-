import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Layers } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import CategoryCard from '../cards/CategoryCard';
import { initStaggerCards } from '../../animations/gsapAnimations';

const BrowseCategories = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    initStaggerCards('.category-grid', '.card-wrapper');
  }, []);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-white">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-forest/5 to-transparent pointer-events-none" />
      
      <div className="section-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center justify-center gap-2 text-emerald font-bold uppercase tracking-wider text-sm mb-3">
            <Layers size={16} />
            <span>Find What You Need</span>
          </div>
          <h2 className="section-heading">Browse by Category</h2>
          <p className="section-subheading mx-auto mt-4">
            From academic textbooks to literary fiction, find exactly what you're looking for across our diverse collection.
          </p>
        </motion.div>

        <div className="category-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {CATEGORIES.map((category, index) => (
            <div key={category.id} className="card-wrapper h-full">
              <CategoryCard category={category} index={index} />
            </div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link to="/categories" className="btn-ghost inline-flex items-center gap-2 border border-forest/20 hover:border-forest/40">
            View All Categories
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BrowseCategories;
