import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] bg-warmWhite flex flex-col items-center justify-center">
      {/* Book Opening Animation */}
      <div className="relative w-24 h-24 mb-8">
        <motion.div
          animate={{ 
            rotateY: [0, -180, 0],
            z: [0, 50, 0]
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute inset-0 bg-emerald rounded-lg shadow-xl origin-left"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-forest rounded-lg backface-hidden flex items-center justify-center">
            <BookOpen size={32} className="text-white" />
          </div>
          <div className="absolute inset-0 bg-white rounded-lg backface-hidden flex items-center justify-center rotate-y-180 border border-forest/10">
            {/* Pages effect */}
            <div className="absolute right-2 top-2 bottom-2 w-1 bg-gray-200 rounded-full" />
            <div className="absolute right-4 top-2 bottom-2 w-1 bg-gray-200 rounded-full" />
          </div>
        </motion.div>
        
        {/* Back Cover */}
        <div className="absolute inset-0 bg-forest rounded-lg shadow-lg -z-10 translate-x-1 translate-y-1" />
      </div>
      
      {/* Loading Text */}
      <div className="text-center">
        <motion.h2 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="font-serif text-2xl font-bold text-forest mb-2 flex items-center justify-center gap-2"
        >
          Book<span className="text-emerald">Cycle</span>
        </motion.h2>
        <motion.div 
          className="flex gap-1 justify-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2, repeat: Infinity }
            }
          }}
        >
          {['L', 'o', 'a', 'd', 'i', 'n', 'g', '.', '.', '.'].map((letter, i) => (
            <motion.span 
              key={i}
              variants={{
                hidden: { y: 0 },
                visible: { y: [-5, 0, 0], transition: { duration: 1, repeat: Infinity } }
              }}
              className="text-sm font-medium text-mutedText"
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default PageLoader;
