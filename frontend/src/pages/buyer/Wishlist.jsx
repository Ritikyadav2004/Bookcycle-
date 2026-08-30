import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import useWishlistStore from '../../store/wishlistStore';
import BookCard from '../../components/cards/BookCard';

const Wishlist = () => {
  const { items, clearWishlist } = useWishlistStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 pb-12">
        <div className="w-32 h-32 bg-warmWhite rounded-full flex items-center justify-center mb-8 shadow-inner border border-forest/5 relative">
           <Heart size={48} className="text-error" />
           <div className="absolute top-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
             <span className="text-error font-bold text-sm">0</span>
           </div>
        </div>
        <h2 className="text-3xl font-serif font-bold text-forest mb-4">Your wishlist is empty</h2>
        <p className="text-mutedText max-w-md mb-8">
          Save your favorite books here to buy them later. Never lose track of what you want to read next.
        </p>
        <Link to="/browse" className="btn-primary py-4 px-8 inline-flex items-center gap-2">
          Discover Books <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-forest mb-2">My Wishlist</h1>
          <p className="text-mutedText">You have {items.length} saved item{items.length !== 1 ? 's' : ''}.</p>
        </div>
        <button 
          onClick={clearWishlist}
          className="text-sm font-semibold text-error hover:underline"
        >
          Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
