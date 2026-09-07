import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star, Heart } from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import { formatPrice, getConditionInfo } from '../../utils/formatters';

const QuickViewModal = () => {
  const { quickViewBook: book, isQuickViewOpen, closeQuickView } = useUIStore();
  const addToCart = useCartStore(state => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const navigate = useNavigate();

  if (!book) return null;

  const isWished = isInWishlist(book.id);
  const condition = getConditionInfo(book.condition);

  const handleViewDetails = () => {
    closeQuickView();
    navigate(`/book/${book.id}`);
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl shadow-modal w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row pointer-events-auto relative"
            >
              <button
                onClick={closeQuickView}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-darkText hover:bg-white hover:text-error hover:scale-110 transition-all shadow-sm"
              >
                <X size={20} />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-2/5 bg-warmWhite p-8 flex items-center justify-center relative">
                <img 
                  src={book.images?.[0] || book.image} 
                  alt={book.title} 
                  className="max-h-[300px] md:max-h-[400px] object-contain drop-shadow-xl"
                />
                {book.discount > 0 && (
                  <div className="absolute top-6 left-6 bg-error text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {book.discount}% OFF
                  </div>
                )}
              </div>

              {/* Content Side */}
              <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-emerald/10 text-emerald text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                    {book.category}
                  </span>
                  <span className={`${condition.bg} ${condition.color} text-[10px] font-bold px-2 py-1 rounded-md border border-current border-opacity-20 capitalize`}>
                    {condition.label}
                  </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-serif font-bold text-forest mb-2 leading-tight">
                  {book.title}
                </h2>
                
                <p className="text-mutedText mb-4">by <span className="font-medium text-darkText">{book.author}</span></p>
                
                <div className="flex items-center gap-2 mb-6 text-sm">
                  <div className="flex items-center gap-1 font-bold text-amber-dark">
                    <Star size={16} className="fill-amber-dark" /> {book.rating}
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-mutedText">Class {book.class}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-mutedText">{book.subject}</span>
                </div>

                <div className="flex items-end gap-3 mb-6">
                  <span className="text-3xl font-bold text-forest leading-none">
                    {formatPrice(book.sellingPrice)}
                  </span>
                  {book.discount > 0 && (
                    <span className="text-sm text-mutedText line-through mb-1">
                      {formatPrice(book.originalPrice)}
                    </span>
                  )}
                </div>

                <p className="text-sm text-mutedText leading-relaxed mb-8 line-clamp-3">
                  {book.description || `Pre-owned NCERT ${book.subject} textbook for Class ${book.class}. In ${condition.label.toLowerCase()} condition. Perfect for CBSE board students.`}
                </p>

                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      addToCart(book);
                      closeQuickView();
                    }}
                    disabled={!book.available}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${
                      book.available ? 'bg-emerald text-white hover:bg-emerald-dark' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    {book.available ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button 
                    onClick={() => toggleItem(book)}
                    className="w-full sm:w-12 h-12 rounded-xl border border-forest/20 flex items-center justify-center text-darkText hover:bg-forest/5 transition-colors"
                  >
                    <Heart size={20} className={isWished ? 'fill-error text-error' : ''} />
                  </button>
                  <button 
                    onClick={handleViewDetails}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl border border-forest/20 font-bold text-forest hover:bg-forest hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
