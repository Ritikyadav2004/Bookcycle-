import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Heart, ShoppingCart, Star, MapPin, CheckCircle, 
  ShieldCheck, Share2, MessageCircle, AlertCircle, 
  ChevronRight, ArrowLeft
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { bookService } from '../../services/bookService';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import { formatPrice, getConditionInfo } from '../../utils/formatters';
import BookCard from '../../components/cards/BookCard';
import { toast } from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const addToCart = useCartStore(state => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      try {
        const bookData = await bookService.getBook(id);
        setBook(bookData);
        
        const similarData = await bookService.getSimilar(id);
        setSimilarBooks(similarData);
      } catch (error) {
        console.error("Failed to fetch book:", error);
        navigate('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
    window.scrollTo(0, 0);
  }, [id, navigate]);

  if (loading || !book) {
    return (
      <div className="min-h-screen bg-paper-bg pt-8 pb-20 flex justify-center">
        <div className="section-container w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="animate-pulse bg-white rounded-3xl h-[500px]"></div>
          <div className="animate-pulse space-y-6">
             <div className="h-10 bg-white rounded w-3/4"></div>
             <div className="h-6 bg-white rounded w-1/4"></div>
             <div className="h-32 bg-white rounded w-full"></div>
             <div className="h-16 bg-white rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const isWished = isInWishlist(book.id);
  const condition = getConditionInfo(book.condition);
  const images = book.images || [book.image];

  const handleBuyNow = () => {
    addToCart(book);
    navigate('/buyer/checkout');
  };

  return (
    <div className="min-h-screen bg-paper-bg pt-6 pb-20">
      <div className="section-container">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-mutedText mb-8">
          <Link to="/" className="hover:text-emerald transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/browse" className="hover:text-emerald transition-colors">Books</Link>
          <ChevronRight size={14} />
          <span className="text-darkText font-medium truncate max-w-[200px] sm:max-w-xs">{book.title}</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-sm border border-forest/5 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Images */}
            <div className="p-8 lg:p-12 bg-warmWhite flex flex-col">
              <div className="relative aspect-[3/4] max-h-[500px] mx-auto w-full mb-6 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    src={images[activeImage]}
                    alt={book.title}
                    className="max-w-full max-h-full object-contain drop-shadow-xl"
                  />
                </AnimatePresence>
                
                <button 
                  onClick={() => toggleItem(book)}
                  className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-mutedText hover:text-error transition-all hover:scale-110"
                >
                  <Heart size={24} className={isWished ? 'fill-error text-error' : ''} />
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex justify-center gap-4 mt-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === idx ? 'border-emerald shadow-md scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-emerald/10 text-emerald text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  {book.category}
                </span>
                <span className={`${condition.bg} ${condition.color} text-xs font-bold px-3 py-1 rounded-full border border-current border-opacity-20 capitalize`}>
                  Condition: {condition.label}
                </span>
                {book.board && (
                  <span className="bg-forest/5 text-forest text-xs font-bold px-3 py-1 rounded-full">
                    {book.board}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-2 leading-tight">
                {book.title}
              </h1>
              
              <div className="text-lg text-mutedText mb-6 font-medium">
                by <span className="text-darkText">{book.author}</span>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-1 bg-amber-light/20 text-amber-dark px-2 py-1 rounded font-bold text-sm">
                  <Star size={16} className="fill-amber-dark" />
                  <span>{book.rating}</span>
                </div>
                <div className="text-sm text-mutedText">
                  {book.reviews || 12} Reviews
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-1 text-sm text-mutedText">
                  <Share2 size={16} /> Share
                </div>
              </div>

              <div className="flex items-end gap-4 mb-8 pb-8 border-b border-forest/10">
                <span className="text-4xl font-bold text-forest leading-none">
                  {formatPrice(book.sellingPrice)}
                </span>
                <div className="flex flex-col">
                  {book.discount > 0 && (
                    <span className="text-lg text-mutedText line-through leading-none">
                      {formatPrice(book.originalPrice)}
                    </span>
                  )}
                  <span className="text-sm text-emerald font-semibold">
                    You save {formatPrice(book.originalPrice - book.sellingPrice)} ({book.discount}%)
                  </span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-warmWhite rounded-xl p-5 mb-8 border border-forest/5">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold">
                      {book.seller?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-semibold text-darkText text-sm flex items-center gap-1">
                        {book.seller?.name}
                        <ShieldCheck size={14} className="text-emerald" />
                      </p>
                      <p className="text-xs text-mutedText flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {book.seller?.city}, {book.seller?.state}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-forest">Seller Rating</p>
                    <p className="text-sm font-bold text-amber-dark">4.8/5.0</p>
                  </div>
                </div>
                <button
                  onClick={() => toast.success(`Message window opened for ${book.seller?.name || 'seller'}`)}
                  className="w-full py-2 bg-white border border-forest/20 rounded-lg text-sm font-semibold text-forest hover:bg-forest hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} /> Contact Seller
                </button>
              </div>

              {/* Description */}
              <div className="mb-8 flex-1">
                <h3 className="font-bold text-lg text-forest mb-3">Description</h3>
                <p className="text-mutedText leading-relaxed">
                  {book.description || `This is a pre-owned copy of ${book.title}. The book is in ${condition.label.toLowerCase()} condition. It is perfect for students studying under the ${book.board} board.`}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-y-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-mutedText text-xs uppercase tracking-wider">Class</span>
                    <span className="font-medium text-darkText">{book.class || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-mutedText text-xs uppercase tracking-wider">Subject</span>
                    <span className="font-medium text-darkText">{book.subject}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-mutedText text-xs uppercase tracking-wider">Medium</span>
                    <span className="font-medium text-darkText">{book.medium || 'English'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-mutedText text-xs uppercase tracking-wider">ISBN</span>
                    <span className="font-medium text-darkText">{book.isbn || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={() => addToCart(book)}
                  disabled={!book.available}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    book.available 
                      ? 'bg-emerald text-white hover:bg-emerald-dark shadow-lg shadow-emerald/30' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={20} />
                  {book.available ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={!book.available}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                    book.available 
                      ? 'bg-forest text-white hover:bg-forest-dark shadow-lg shadow-forest/30' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed hidden sm:flex'
                  }`}
                >
                  Buy Now
                </button>
              </div>

              {/* Guarantees */}
              <div className="mt-6 flex items-center justify-between border-t border-forest/10 pt-6">
                <div className="flex items-center gap-2 text-xs font-medium text-mutedText">
                  <CheckCircle size={16} className="text-emerald" /> Quality Checked
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-mutedText">
                  <ShieldCheck size={16} className="text-emerald" /> Secure Payment
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-mutedText">
                  <AlertCircle size={16} className="text-emerald" /> Easy Return
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Books */}
        {similarBooks.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-serif font-bold text-forest mb-8">Similar Books You May Like</h2>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={24}
              slidesPerView={2}
              navigation
              breakpoints={{
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
                1280: { slidesPerView: 5 },
              }}
              className="!pb-14"
            >
              {similarBooks.map((b) => (
                <SwiperSlide key={b.id} className="h-auto">
                  <BookCard book={b} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
