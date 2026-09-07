import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Leaf, ShieldCheck, Mail, MapPin, Phone } from 'lucide-react';
import { pageTransition } from '../../animations/variants';

const About = () => {
  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-paper-bg py-12 lg:py-20"
    >
      <div className="section-container">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-forest mb-6">
            Our Mission is to Make Education Accessible
          </h1>
          <p className="text-lg text-mutedText leading-relaxed">
            BookCycle was founded with a simple idea: every student should have access to the books they need without breaking the bank, and every book should be read more than once.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop" 
                alt="Students studying together" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-emerald/20 rounded-full blur-2xl z-0"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-amber/20 rounded-full blur-2xl z-0"></div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest">The BookCycle Story</h2>
            <p className="text-mutedText leading-relaxed text-lg">
              Every year, millions of textbooks are printed, used for a single academic session, and then discarded or left to gather dust. Meanwhile, countless students struggle with the rising costs of educational materials.
            </p>
            <p className="text-mutedText leading-relaxed text-lg">
              We built BookCycle to bridge this gap. By creating a trusted marketplace for pre-owned academic books, we're building a community where knowledge is shared, resources are conserved, and education becomes more affordable for everyone.
            </p>
            
            <div className="pt-6 grid grid-cols-2 gap-6 border-t border-forest/10">
              <div>
                <h4 className="text-3xl font-bold text-emerald mb-2">50k+</h4>
                <p className="text-sm font-semibold text-darkText">Books Recycled</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-amber-dark mb-2">₹2M+</h4>
                <p className="text-sm font-semibold text-darkText">Saved by Students</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest text-center mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-forest/5 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-emerald/10 text-emerald rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">Accessibility</h3>
              <p className="text-mutedText text-sm">Making quality educational resources affordable and available to students from all backgrounds.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-forest/5 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-amber/10 text-amber-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">Sustainability</h3>
              <p className="text-mutedText text-sm">Reducing paper waste and our carbon footprint by extending the lifecycle of every printed book.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-forest/5 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">Trust</h3>
              <p className="text-mutedText text-sm">Ensuring secure transactions, accurate book descriptions, and a safe environment for our community.</p>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-forest/5 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-forest mb-3">Community</h3>
              <p className="text-mutedText text-sm">Fostering a network of learners, educators, and book lovers who support one another.</p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default About;
