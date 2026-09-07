import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../../constants';
import { initTextReveal } from '../../animations/gsapAnimations';
import { useEffect } from 'react';

const FAQItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border border-forest/10 rounded-2xl mb-4 bg-white overflow-hidden transition-all duration-300 hover:border-emerald/30 shadow-sm hover:shadow-md">
      <button
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={onClick}
      >
        <h3 className={`font-serif font-bold text-lg pr-8 transition-colors ${isOpen ? 'text-emerald' : 'text-darkText'}`}>
          {faq.question}
        </h3>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-emerald text-white rotate-180' : 'bg-warmWhite text-forest'}`}>
          <ChevronDown size={18} />
        </div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 pt-0 text-mutedText leading-relaxed">
              <div className="w-full h-px bg-forest/5 mb-4"></div>
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    initTextReveal('.faq-title');
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-white relative">
      <div className="section-container max-w-4xl relative z-10">
        <div className="text-center mb-16 faq-title">
          <div className="inline-flex items-center justify-center gap-2 text-emerald font-bold uppercase tracking-wider text-sm mb-3">
            <HelpCircle size={16} />
            <span>Got questions?</span>
          </div>
          <h2 className="section-heading mb-4">Frequently Asked Questions</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {FAQ_ITEMS.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
            />
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-mutedText mb-4">Still have questions?</p>
          <a href="mailto:support@bookcycle.in" className="btn-ghost text-emerald hover:text-forest border border-emerald/20 hover:border-forest/40">
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
