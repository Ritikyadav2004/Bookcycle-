import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { BookOpen, Leaf } from 'lucide-react';
import { SUSTAINABILITY_STATS } from '../../constants';
import { initCounter } from '../../animations/gsapAnimations';
import { getIcon } from '../../utils/iconMaps';

const Sustainability = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  
  // Array of refs for counters
  const counterRefs = useRef([]);
  counterRefs.current = [];

  const addToRefs = (el) => {
    if (el && !counterRefs.current.includes(el)) {
      counterRefs.current.push(el);
    }
  };

  useEffect(() => {
    if (isInView && counterRefs.current.length > 0) {
      counterRefs.current.forEach((el, index) => {
        const targetValue = parseInt(el.getAttribute('data-value'), 10);
        if (!isNaN(targetValue)) {
          // Add staggered delay to counters
          setTimeout(() => {
            initCounter(el, targetValue, { duration: 2.5 });
          }, index * 200);
        }
      });
    }
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-24 bg-forest text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald/20 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="section-container relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="w-full lg:w-1/3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center justify-center gap-2 text-emerald font-bold uppercase tracking-wider text-sm mb-4">
                <Leaf size={16} />
                <span>Our Impact</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Read sustainably.</h2>
              <p className="text-cream/80 text-lg leading-relaxed mb-8">
                Every pre-owned book you buy or sell contributes to a greener planet. Together, our community is making a measurable environmental impact while keeping knowledge accessible and affordable.
              </p>
              <Link to="/about" className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20">
                Read our Mission
              </Link>
            </motion.div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {SUSTAINABILITY_STATS.map((stat, index) => {
                const Icon = getIcon(stat.icon, BookOpen);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 + (index * 0.1) }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
                  >
                    <div className="w-12 h-12 mx-auto bg-emerald/20 rounded-full flex items-center justify-center text-emerald-300 mb-4">
                      <Icon size={24} />
                    </div>
                    <div className="flex items-center justify-center font-serif text-3xl md:text-4xl font-bold text-white mb-2">
                      {stat.prefix && <span>{stat.prefix}</span>}
                      <span ref={addToRefs} data-value={stat.value}>0</span>
                      {stat.suffix && <span className="text-amber-light">{stat.suffix}</span>}
                    </div>
                    <p className="text-sm font-medium text-cream-dark/80">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
