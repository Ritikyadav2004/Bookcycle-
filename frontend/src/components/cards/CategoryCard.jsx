import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book } from 'lucide-react';
import { getIcon } from '../../utils/iconMaps';

const CategoryCard = ({ category, index }) => {
  const Icon = getIcon(category.icon, Book);
  
  return (
    <Link to={`/categories/${category.id}`}>
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-2xl p-6 shadow-card border border-forest/5 flex flex-col items-center text-center h-full group relative overflow-hidden"
      >
        {/* Hover background effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ backgroundColor: category.color }}
        />
        
        <div 
          className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center text-white shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
          style={{ backgroundColor: category.color }}
        >
          <Icon size={28} />
        </div>
        
        <h3 className="font-serif font-bold text-lg text-darkText mb-2 group-hover:text-forest transition-colors relative z-10">
          {category.name}
        </h3>
        
        <p className="text-sm text-mutedText relative z-10">
          {category.description}
        </p>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
