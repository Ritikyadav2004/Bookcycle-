import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import BookCard from '../../components/cards/BookCard';
import { searchBooks } from '../../data/mockBooks';

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const results = useMemo(() => query ? searchBooks(query) : [], [query]);

  return (
    <section className="bg-paper-bg py-16 md:py-24">
      <div className="section-container">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald">
              <Search size={16} />
              <span>Search Results</span>
            </div>
            <h1 className="section-heading">Results for "{query || 'all books'}"</h1>
            <p className="text-mutedText">{results.length} matching books found by title, author, ISBN, or category.</p>
          </div>
          <Link to="/browse" className="btn-secondary">Open advanced filters</Link>
        </div>

        {results.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.slice(0, 16).map((book, index) => (
              <motion.div key={book.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="card p-10 text-center">
            <Search className="mx-auto mb-4 text-emerald" size={40} />
            <h2 className="mb-2 text-2xl font-serif font-bold">No books found</h2>
            <p className="mx-auto mb-6 max-w-md text-mutedText">Try searching by NCERT, Mathematics, ISBN, class, author, or category.</p>
            <Link to="/browse" className="btn-primary">Explore marketplace</Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchResults;
