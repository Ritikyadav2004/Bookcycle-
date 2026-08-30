import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    if (email) {
      toast.success('Successfully subscribed to newsletter!');
      e.target.reset();
    }
  };

  return (
    <section className="py-20 bg-warmWhite relative">
      <div className="section-container">
        <div className="max-w-5xl mx-auto bg-gradient-forest rounded-3xl p-10 md:p-16 overflow-hidden relative shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            
            <div className="w-full md:w-1/2 text-center md:text-left text-white">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center justify-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6 border border-white/20 backdrop-blur-sm"
              >
                <Mail size={16} className="text-amber" />
                <span>Stay Updated</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-serif font-bold mb-4"
              >
                Subscribe for <span className="text-emerald">exclusive</span> offers
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-cream/80 text-lg"
              >
                Get the latest news on used book arrivals, exclusive discounts, and sustainability tips delivered straight to your inbox.
              </motion.p>
            </div>
            
            <div className="w-full md:w-1/2 max-w-md">
              <motion.form 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                onSubmit={handleSubmit} 
                className="relative flex flex-col gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={20} className="text-mutedText" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white border border-white/20 text-darkText focus:outline-none focus:ring-2 focus:ring-emerald shadow-inner"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full btn-amber py-4 flex items-center justify-center gap-2 group shadow-lg"
                >
                  Subscribe Now
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
                <p className="text-center text-xs text-cream/60 mt-2">
                  We care about your data. See our Privacy Policy.
                </p>
              </motion.form>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
