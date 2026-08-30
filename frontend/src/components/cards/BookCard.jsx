import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { formatPrice, calcDiscount, getConditionInfo } from '../../utils/formatters';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useUIStore from '../../store/uiStore';
import { cardHover } from '../../animations/variants';

const BookCard = ({ book, index = 0 }) => {
  const addToCart = useCartStore(state => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { openQuickView } = useUIStore();

  if (!book) return null;

  const isWished = isInWishlist(book.id);
  const condition = getConditionInfo(book.condition);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(book);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(book);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(book);
  };

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      className="card group relative flex flex-col h-full bg-white cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {book.discount > 0 && (
          <span className="bg-error text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            {book.discount}% OFF
          </span>
        )}
        <span className={`${condition.bg} ${condition.color} text-[10px] font-bold px-2 py-1 rounded-md shadow-sm capitalize border border-current border-opacity-20`}>
          {condition.label}
        </span>
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-mutedText hover:text-error transition-colors"
        aria-label="Toggle Wishlist"
      >
        <Heart size={16} className={isWished ? 'fill-error text-error' : ''} />
      </button>

      {/* Image Container */}
      <div className="relative pt-[130%] bg-warmWhite overflow-hidden rounded-t-2xl border-b border-forest/5">
        <Link to={`/book/${book.id}`} className="absolute inset-0 p-6 flex items-center justify-center">
          <img 
            src={book.images?.[0] || book.image} 
            alt={book.title} 
            className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>
        
        {/* Quick actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center gap-3 translate-y-4 group-hover:translate-y-0">
          <button 
            onClick={handleQuickView}
            className="w-10 h-10 rounded-full bg-white text-forest flex items-center justify-center hover:bg-emerald hover:text-white transition-colors shadow-lg"
            title="Quick View"
          >
            <Eye size={18} />
          </button>
          <button 
            onClick={handleAddToCart}
            disabled={!book.available}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${
              book.available 
                ? 'bg-emerald text-white hover:bg-forest' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={book.available ? "Add to Cart" : "Out of Stock"}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald">
            {book.category}
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-dark">
            <Star size={10} className="fill-amber-dark" />
            {book.rating}
          </div>
        </div>
        
        <Link to={`/book/${book.id}`} className="block mt-1 mb-1">
          <h3 className="font-serif font-bold text-darkText line-clamp-2 leading-tight group-hover:text-emerald transition-colors">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-xs text-mutedText mb-3 line-clamp-1">
          by {book.author}
        </p>
        
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-2">
            <span className="font-bold text-lg text-forest leading-none">
              {formatPrice(book.sellingPrice)}
            </span>
            {book.discount > 0 && (
              <span className="text-xs text-mutedText line-through leading-relaxed">
                {formatPrice(book.originalPrice)}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-[11px] text-mutedText border-t border-forest/5 pt-2 mt-1">
            <span className="truncate max-w-[60%]">
              Seller: <span className="font-semibold text-darkText">{book.seller?.name}</span>
            </span>
            <span>{book.seller?.city}</span>
          </div>
        </div>
      </div>
      
      {!book.available && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 rounded-2xl flex items-center justify-center">
          <div className="bg-darkText text-white px-4 py-2 rounded-lg font-bold text-sm shadow-xl rotate-[-10deg]">
            OUT OF STOCK
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BookCard;
