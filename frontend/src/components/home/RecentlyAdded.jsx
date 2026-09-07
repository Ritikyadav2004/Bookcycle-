import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import BookCard from '../cards/BookCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const RecentlyAdded = ({ books = [] }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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
            <Clock size={16} />
            <span>Fresh arrivals</span>
          </div>
          <h2 className="section-heading">Recently Added</h2>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/browse?sort=newest" className="group flex items-center gap-2 font-semibold text-forest hover:text-emerald transition-colors">
            View All New
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pb-12"
      >
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          className="!pb-14 px-1" // Padding bottom for pagination bullets
        >
          {books.map((book) => (
            <SwiperSlide key={book.id} className="h-auto">
              <BookCard book={book} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default RecentlyAdded;
