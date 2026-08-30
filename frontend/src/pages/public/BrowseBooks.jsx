import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Search } from 'lucide-react';
import { bookService } from '../../services/bookService';
import BookCard from '../../components/cards/BookCard';
import { pageTransition } from '../../animations/variants';
import { CATEGORIES } from '../../constants';

const BrowseBooks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Filters state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    condition: searchParams.get('condition') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await bookService.getBooks({
          ...filters,
          page: pagination.page,
          limit: 12,
        });
        setBooks(response.data);
        setPagination(prev => ({ ...prev, totalPages: response.totalPages }));
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
    
    // Update URL params
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) newParams.set(key, value);
    });
    setSearchParams(newParams);

  }, [filters, pagination.page, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
      search: '',
      sort: 'newest',
    });
    setPagination({ page: 1, totalPages: 1 });
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-paper-bg py-8 lg:py-12"
    >
      <div className="section-container">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-forest mb-2">Browse Books</h1>
            <p className="text-mutedText">Discover thousands of pre-owned books.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-forest/10 focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald bg-white"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-mutedText" />
            </div>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden btn-secondary p-3"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters (Desktop & Mobile) */}
          <AnimatePresence>
            {(isFilterOpen || isDesktop) && (
              <motion.aside 
                initial={{ opacity: 0, x: -50, width: 0 }}
                animate={{ opacity: 1, x: 0, width: '100%' }}
                exit={{ opacity: 0, x: -50, width: 0 }}
                className={`lg:w-72 shrink-0 ${isFilterOpen ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden lg:block'}`}
              >
                {isFilterOpen && (
                  <div className="flex justify-between items-center mb-6 lg:hidden">
                    <h2 className="font-bold text-xl">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)}><X size={24} /></button>
                  </div>
                )}
                
                <div className="bg-white lg:rounded-2xl lg:shadow-card lg:p-6 lg:border lg:border-forest/5 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-forest flex items-center gap-2">
                      <Filter size={18} /> Filters
                    </h3>
                    <button onClick={clearFilters} className="text-xs text-emerald font-semibold hover:underline">
                      Clear All
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-sm mb-3">Category</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          className="accent-emerald w-4 h-4"
                          checked={filters.category === ''}
                          onChange={() => handleFilterChange('category', '')}
                        />
                        <span className="text-sm text-darkText">All Categories</span>
                      </label>
                      {CATEGORIES.map(cat => (
                        <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            className="accent-emerald w-4 h-4"
                            checked={filters.category === cat.id}
                            onChange={() => handleFilterChange('category', cat.id)}
                          />
                          <span className="text-sm text-darkText">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Filter */}
                  <div className="mb-6 border-t border-forest/5 pt-6">
                    <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-full px-3 py-2 border border-forest/10 rounded-lg text-sm focus:border-emerald outline-none"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      />
                      <span className="text-mutedText">-</span>
                      <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-full px-3 py-2 border border-forest/10 rounded-lg text-sm focus:border-emerald outline-none"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Condition Filter */}
                  <div className="mb-6 border-t border-forest/5 pt-6">
                    <h4 className="font-semibold text-sm mb-3">Condition</h4>
                    <div className="space-y-2">
                      {['Like New', 'Good', 'Fair'].map(cond => (
                        <label key={cond} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="condition"
                            className="accent-emerald w-4 h-4"
                            checked={filters.condition === cond.toLowerCase().replace(' ', '-')}
                            onChange={() => handleFilterChange('condition', cond.toLowerCase().replace(' ', '-'))}
                          />
                          <span className="text-sm text-darkText">{cond}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  {isFilterOpen && (
                    <button onClick={() => setIsFilterOpen(false)} className="btn-primary w-full mt-6 lg:hidden">
                      Apply Filters
                    </button>
                  )}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            
            {/* Sort & Results Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-forest/5 mb-6 gap-4">
              <p className="text-sm text-mutedText font-medium">
                Showing <span className="font-bold text-forest">{books.length}</span> results
              </p>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-mutedText">Sort by:</span>
                <div className="relative">
                  <select
                    className="appearance-none bg-warmWhite border border-forest/10 text-darkText text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-emerald cursor-pointer font-medium"
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Most Popular</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Books Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-white rounded-2xl p-4 h-[350px] shadow-sm">
                    <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mt-auto"></div>
                  </div>
                ))}
              </div>
            ) : books.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button 
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                      disabled={pagination.page === 1}
                      className="px-4 py-2 border border-forest/20 rounded-lg text-sm font-medium text-forest disabled:opacity-50 hover:bg-forest hover:text-white transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {[...Array(pagination.totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPagination(prev => ({ ...prev, page: i + 1 }))}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            pagination.page === i + 1 ? 'bg-emerald text-white' : 'hover:bg-forest/10 text-forest'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-4 py-2 border border-forest/20 rounded-lg text-sm font-medium text-forest disabled:opacity-50 hover:bg-forest hover:text-white transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-forest/5 flex flex-col items-center">
                <div className="w-20 h-20 bg-warmWhite rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-mutedText" />
                </div>
                <h3 className="text-xl font-serif font-bold text-forest mb-2">No books found</h3>
                <p className="text-mutedText mb-6 max-w-md">
                  We couldn't find any books matching your current filters. Try adjusting your search criteria or clearing filters.
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BrowseBooks;
