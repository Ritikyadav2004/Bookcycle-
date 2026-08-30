import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { HOW_IT_WORKS_STEPS } from '../../constants';
import { initTextReveal } from '../../animations/gsapAnimations';
import { getIcon } from '../../utils/iconMaps';

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  useEffect(() => {
    initTextReveal('.reveal-text');
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Path */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-emerald/0 via-emerald/20 to-emerald/0 -translate-y-1/2 hidden md:block" />
      
      <div className="section-container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 reveal-text">
          <h2 className="section-heading mb-4">How BookCycle Works</h2>
          <p className="section-subheading mx-auto">
            A simple, sustainable cycle for your books. Buy what you need, sell what you don't.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => {
            const Icon = getIcon(step.icon, BookOpen);
            
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: 0.2 + (index * 0.15) }}
                className="relative text-center group"
              >
                {/* Connector Line for Mobile */}
                {index !== HOW_IT_WORKS_STEPS.length - 1 && (
                  <div className="absolute left-1/2 bottom-0 w-px h-12 bg-emerald/20 translate-y-full md:hidden" />
                )}

                <div className="mx-auto w-24 h-24 bg-warmWhite rounded-full shadow-inner flex items-center justify-center relative mb-6 group-hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-2 bg-white rounded-full shadow-md flex items-center justify-center">
                    <Icon size={32} className="text-emerald" />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold font-serif shadow-lg border-2 border-white">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="font-serif font-bold text-xl text-darkText mb-3">{step.title}</h3>
                <p className="text-mutedText text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
