import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MessageSquare, Quote, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { TESTIMONIALS } from '../../constants';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section ref={sectionRef} className="py-24 bg-paper-bg relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-[400px] bg-gradient-to-r from-emerald/5 to-amber/5 blur-3xl pointer-events-none rounded-full" />
      
      <div className="section-container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center gap-2 text-emerald font-bold uppercase tracking-wider text-sm mb-3">
              <MessageSquare size={16} />
              <span>Community Stories</span>
            </div>
            <h2 className="section-heading mb-4">What Our Readers Say</h2>
            <p className="section-subheading mx-auto">
              Join thousands of happy students and readers who buy and sell on BookCycle.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="!pb-16 px-2"
          >
            {TESTIMONIALS.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className="h-auto">
                <div className="bg-white rounded-2xl p-8 shadow-card border border-forest/5 h-full flex flex-col relative group">
                  <div className="absolute top-6 right-6 text-emerald/20 group-hover:text-emerald/40 transition-colors duration-300">
                    <Quote size={40} />
                  </div>
                  
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < testimonial.rating ? "fill-amber text-amber" : "text-gray-300"} />
                    ))}
                  </div>
                  
                  <p className="text-darkText leading-relaxed flex-1 italic mb-8 relative z-10 font-medium">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto border-t border-forest/10 pt-6">
                    <div className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center font-bold text-lg shadow-inner">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-darkText font-serif">{testimonial.name}</h4>
                      <p className="text-xs text-mutedText capitalize">{testimonial.role} • {testimonial.location}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
