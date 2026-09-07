import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookMarked, IndianRupee, ArrowRight } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const SellBanner = () => {
  const { isAuthenticated, role } = useAuthStore();

  const getTargetLink = () => {
    if (!isAuthenticated) return '/seller/register';
    if (role === 'seller') return '/seller/add-book';
    return '/seller/register';
  };

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="section-container">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden bg-forest text-white"
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald rounded-full opacity-30 blur-3xl translate-x-1/3 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber rounded-full opacity-20 blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 p-10 md:p-16">
            <div className="order-2 lg:order-1 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-cream text-sm font-medium mb-6">
                <BookMarked size={16} className="text-amber-light" />
                <span>Turn Old Books Into Cash</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold leading-tight mb-6">
                Got books you no longer read? <span className="text-amber-light">Sell them here.</span>
              </h2>
              
              <p className="text-cream/90 text-lg mb-8 leading-relaxed">
                Join our community of sellers. List your textbooks, novels, and study materials in minutes and reach thousands of buyers across India.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={getTargetLink()} className="btn-amber py-4 px-8 magnetic-btn group shadow-lg inline-flex justify-center">
                  Start Selling Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/how-it-works" className="btn-secondary bg-white/10 hover:bg-white/20 border-white/20 text-white py-4 px-8 magnetic-btn inline-flex justify-center">
                  Learn More
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center">
                     <IndianRupee size={16} className="text-emerald-300" />
                   </div>
                   <span className="text-sm font-medium text-cream-dark">Zero Listing Fee</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center">
                     <BookMarked size={16} className="text-emerald-300" />
                   </div>
                   <span className="text-sm font-medium text-cream-dark">Quick Sales</span>
                 </div>
              </div>
            </div>
            
            {/* Visual area */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-square perspective-1000">
                <motion.div
                  animate={{ rotateY: [-5, 5, -5], rotateX: [5, -5, 5] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full h-full relative"
                >
                  <div className="absolute top-10 right-10 w-48 h-64 rounded-xl shadow-2xl overflow-hidden border-4 border-white/20 rotate-6 transform-gpu z-10">
                    <img src="/book-images/class-11/05-physics-part-i.webp" alt="Sell Books" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute bottom-10 left-10 w-40 h-56 rounded-xl shadow-2xl overflow-hidden border-4 border-white/20 -rotate-12 transform-gpu z-20">
                     <img src="/book-images/class-10/04-mathematics.webp" alt="Sell Textbooks" className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Floating price tags */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/4 right-0 bg-white text-forest font-bold px-4 py-2 rounded-lg shadow-xl -rotate-6 z-30"
                  >
                    Sold for ₹350
                  </motion.div>
                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute bottom-1/3 -left-4 bg-amber text-white font-bold px-4 py-2 rounded-lg shadow-xl rotate-12 z-30"
                  >
                    Listed in 2 mins
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SellBanner;
