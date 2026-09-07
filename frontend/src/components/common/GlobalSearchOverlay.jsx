import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import useUIStore from '../../store/uiStore';
import { searchBooks } from '../../data/mockBooks';
import { formatPrice } from '../../utils/formatters';

const GlobalSearchOverlay = () => {
  const navigate = useNavigate();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    return searchBooks(query).slice(0, 5);
  }, [query]);

  useEffect(() => {
    if (!isSearchOpen) setQuery('');
  }, [isSearchOpen]);

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    closeSearch();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-forest/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Search books"
        >
          <button className="absolute inset-0 cursor-default" type="button" aria-label="Close search" onClick={closeSearch} />
          <motion.div
            initial={{ y: -24, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -24, scale: 0.98 }}
            className="relative mx-auto mt-20 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-modal"
          >
            <form onSubmit={submitSearch} className="flex items-center gap-3 rounded-xl border border-forest/10 bg-warmWhite px-4 py-3">
              <Search size={20} className="text-emerald" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-darkText outline-none placeholder:text-mutedText"
                placeholder="Search by title, author, ISBN, or category"
              />
              <button type="button" onClick={closeSearch} className="rounded-full p-1 text-mutedText hover:bg-forest/10 hover:text-forest" aria-label="Close search">
                <X size={20} />
              </button>
            </form>

            <div className="mt-4 overflow-hidden rounded-xl border border-forest/10">
              {suggestions.length > 0 ? suggestions.map((book) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  onClick={closeSearch}
                  className="flex items-center gap-4 border-b border-forest/10 bg-white p-3 transition last:border-b-0 hover:bg-warmWhite"
                >
                  <img src={book.image} alt={book.title} className="h-16 w-12 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-darkText">{book.title}</p>
                    <p className="text-sm text-mutedText">{book.author} - Class {book.class}</p>
                  </div>
                  <span className="text-sm font-bold text-emerald">{formatPrice(book.sellingPrice)}</span>
                </Link>
              )) : (
                <div className="bg-white p-6 text-center text-sm text-mutedText">
                  Type at least two characters to see instant suggestions.
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearchOverlay;
