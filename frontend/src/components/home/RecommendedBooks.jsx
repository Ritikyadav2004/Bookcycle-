import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookCard from '../cards/BookCard';
import { initStaggerCards } from '../../animations/gsapAnimations';
import useAuthStore from '../../store/authStore';

const RecommendedBooks = ({ books = [] }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (books.length > 0) {
      initStaggerCards('.recommended-grid', '.card');
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
            <Star size={16} />
            <span>Curated For You</span>
          </div>
          <h2 className="section-heading">
            {isAuthenticated ? `Recommended for ${user?.name?.split(' ')[0]}` : 'Recommended Reading'}
          </h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/browse?recommended=true" className="group flex items-center gap-2 font-semibold text-forest hover:text-emerald transition-colors">
            View All
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <div className="recommended-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-10">
        {books.slice(0, 4).map((book, index) => (
          <BookCard key={book.id} book={book} index={index} />
        ))}
      </div>
    </section>
  );
};

export default RecommendedBooks;
