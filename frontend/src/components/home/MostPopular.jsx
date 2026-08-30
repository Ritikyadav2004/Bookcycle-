import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { TrendingUp, ArrowRight } from 'lucide-react';
import BookCard from '../cards/BookCard';
import { initStaggerCards } from '../../animations/gsapAnimations';

const MostPopular = ({ books = [] }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (books.length > 0) {
      initStaggerCards('.popular-grid', '.card');
    }
  }, [books]);

  if (!books || books.length === 0) return null;

  return (
    <section ref={sectionRef} className="section-container relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 text-emerald font-bold uppercase tracking-wider text-sm mb-2">
            <TrendingUp size={16} />
            <span>Community favorites</span>
          </div>
          <h2 className="section-heading">Most Popular</h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/browse?sort=popular" className="group flex items-center gap-2 font-semibold text-forest hover:text-emerald transition-colors">
            View All Popular
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="popular-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-10">
        {books.slice(0, 5).map((book, index) => (
          <div key={book.id} className={index === 4 ? 'hidden xl:block' : ''}>
            <BookCard book={book} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostPopular;
