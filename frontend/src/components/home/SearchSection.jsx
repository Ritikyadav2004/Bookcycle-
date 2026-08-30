import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { bookService } from '../../services/bookService';
import { useDebounce } from '../../hooks/useDebounce'; // We'll create this

const SearchSection = () => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  // Custom hook implementation inline for speed, normally in a separate file
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length > 2) {
        setIsSearching(true);
        try {
          const results = await bookService.search(debouncedQuery);
          setSuggestions(results.slice(0, 5)); // Show max 5 suggestions
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (bookId) => {
    navigate(`/book/${bookId}`);
    setIsFocused(false);
    setQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto relative z-30" ref={searchRef}>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl p-4 md:p-6 shadow-modal border border-forest/5 flex flex-col md:flex-row gap-4 items-center relative"
      >
        <div className="flex-1 w-full relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={20} className="text-mutedText" />
          </div>
          <input
            type="text"
            className="w-full pl-12 pr-4 py-4 bg-warmWhite border border-forest/10 rounded-xl font-sans text-darkText focus:outline-none focus:border-emerald focus:ring-1 focus:ring-emerald transition-all"
            placeholder="Search by title, author, ISBN, or subject..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {/* Decorative separator hidden on mobile */}
        <div className="hidden md:block w-px h-12 bg-forest/10"></div>
        
        <div className="w-full md:w-auto min-w-[200px] relative">
           <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MapPin size={20} className="text-mutedText" />
          </div>
          <select 
            className="w-full pl-12 pr-10 py-4 bg-white border-none text-darkText font-medium cursor-pointer appearance-none focus:outline-none"
            defaultValue="all"
          >
            <option value="all">All Locations (India)</option>
            <option value="delhi">Delhi NCR</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
            <option value="hyderabad">Hyderabad</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
            <svg className="w-4 h-4 text-mutedText" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <button 
          onClick={handleSearch}
          className="w-full md:w-auto btn-primary py-4 px-8 shrink-0"
        >
          Search
        </button>

        {/* Search Suggestions Dropdown */}
        <AnimatePresence>
          {isFocused && query.length > 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-modal border border-forest/10 overflow-hidden z-50"
            >
              {isSearching ? (
                <div className="p-6 flex items-center justify-center text-emerald">
                  <Loader2 className="animate-spin mr-2" size={20} />
                  <span>Searching books...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div>
                  <ul className="py-2">
                    {suggestions.map((book) => (
                      <li key={book.id}>
                        <button
                          onClick={() => handleSuggestionClick(book.id)}
                          className="w-full px-6 py-3 flex items-center gap-4 hover:bg-warmWhite transition-colors text-left"
                        >
                          <img 
                            src={book.images[0]} 
                            alt={book.title} 
                            className="w-10 h-14 object-cover rounded shadow-sm border border-forest/5"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-darkText truncate">{book.title}</h4>
                            <p className="text-xs text-mutedText truncate">by {book.author} • Class {book.class} {book.subject}</p>
                          </div>
                          <div className="font-bold text-forest shrink-0">
                            ₹{book.sellingPrice}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-forest/5 p-2 bg-warmWhite">
                    <button 
                      onClick={handleSearch}
                      className="w-full text-center text-sm font-semibold text-emerald hover:text-forest py-2 flex items-center justify-center gap-1"
                    >
                      View all results <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-mutedText">
                  No books found matching "{query}"
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchSection;
