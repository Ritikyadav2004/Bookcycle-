// Utility helper functions for BookCycle

/**
 * Delay helper for simulating API calls
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Debounce function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Get random items from array
 */
export const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Filter and sort books
 */
export const filterBooks = (books, filters) => {
  let filtered = [...books];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query) ||
      book.isbn?.toLowerCase().includes(query) ||
      book.subject?.toLowerCase().includes(query)
    );
  }

  if (filters.category) {
    filtered = filtered.filter(book => book.category === filters.category);
  }

  if (filters.classLevel) {
    filtered = filtered.filter(book => book.class === parseInt(filters.classLevel));
  }

  if (filters.subject) {
    filtered = filtered.filter(book => book.subject === filters.subject);
  }

  if (filters.condition) {
    filtered = filtered.filter(book => book.condition === filters.condition);
  }

  if (filters.language) {
    filtered = filtered.filter(book => book.language === filters.language);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(book => book.sellingPrice >= filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(book => book.sellingPrice <= filters.maxPrice);
  }

  if (filters.availability) {
    filtered = filtered.filter(book => book.available);
  }

  // Sort
  if (filters.sort) {
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discA = ((a.originalPrice - a.sellingPrice) / a.originalPrice) * 100;
          const discB = ((b.originalPrice - b.sellingPrice) / b.originalPrice) * 100;
          return discB - discA;
        });
        break;
      default:
        break;
    }
  }

  return filtered;
};

/**
 * Paginate array
 */
export const paginate = (array, page = 1, perPage = 12) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: array.slice(start, end),
    total: array.length,
    page,
    perPage,
    totalPages: Math.ceil(array.length / perPage),
  };
};

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Classname merger
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Scroll to top smoothly
 */
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/**
 * Download as CSV
 */
export const downloadCSV = (data, filename = 'export.csv') => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
