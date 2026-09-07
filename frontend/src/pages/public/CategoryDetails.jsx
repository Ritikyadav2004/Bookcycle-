import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Filter, Search } from 'lucide-react';
import { bookService } from '../../services/bookService';
import BookCard from '../../components/cards/BookCard';
import { CATEGORIES } from '../../constants';
import { pageTransition } from '../../animations/variants';
import { getIcon } from '../../utils/iconMaps';

const CategoryDetails = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const category = CATEGORIES.find(c => c.id === id) || { name: 'Unknown Category', description: '', color: '#163D2A', icon: 'Book' };
  const Icon = getIcon(category.icon, Book);

  useEffect(() => {
    const fetchCategoryBooks = async () => {
      setLoading(true);
      try {
        const response = await bookService.getBooks({ category: id, limit: 12 });
        setBooks(response.data);
      } catch (error) {
        console.error("Failed to fetch category books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryBooks();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-paper-bg pb-20"
    >
      {/* Category Header */}
      <div 
        className="pt-20 pb-16 relative overflow-hidden text-white"
        style={{ backgroundColor: category.color }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="section-container relative z-10 flex flex-col items-center text-center">
          <Link to="/categories" className="self-start inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Categories
          </Link>
          
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 mb-6 shadow-lg">
            <Icon size={40} className="text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">{category.name}</h1>
          <p className="text-white/80 max-w-2xl text-lg">{category.description}</p>
        </div>
      </div>

      <div className="section-container -mt-8 relative z-20">
        <div className="bg-white rounded-xl shadow-sm border border-forest/5 p-4 flex justify-between items-center mb-8">
          <p className="text-sm font-medium text-mutedText">
            Showing <span className="font-bold text-forest">{books.length}</span> books in this category
          </p>
          <Link to={`/browse?category=${id}`} className="btn-ghost flex items-center gap-2 text-sm text-emerald">
            <Filter size={16} /> Advanced Filter
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 h-[350px] shadow-sm">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-forest/5 flex flex-col items-center">
            <div className="w-20 h-20 bg-warmWhite rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-mutedText" />
            </div>
            <h3 className="text-xl font-serif font-bold text-forest mb-2">No books found in this category</h3>
            <p className="text-mutedText mb-6 max-w-md">
              We couldn't find any books currently listed in {category.name}. Check back later or browse other categories.
            </p>
            <Link to="/browse" className="btn-primary">
              Browse All Books
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryDetails;
