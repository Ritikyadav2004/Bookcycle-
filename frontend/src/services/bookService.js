import { mockBooks, getBookById, searchBooks, filterBooks, getFeaturedBooks, getRecentBooks, getPopularBooks, getRecommendedBooks, getSimilarBooks } from '../data/mockBooks';
import { delay, paginate } from '../utils/helpers';
import { getProducts, getProduct } from './apiService';

export const bookService = {
  // Get all books with filtering and pagination
  getBooks: async (params = {}) => {
    try {
      return await getProducts(params);
    } catch (e) {
      console.warn("Backend products fetch failed, using mock data:", e);
      await delay(600);
      const { page = 1, limit = 12, ...filters } = params;
      const filtered = filterBooks(mockBooks, filters);
      return paginate(filtered, page, limit);
    }
  },

  // Get single book details
  getBook: async (id) => {
    try {
      return await getProduct(id);
    } catch (e) {
      console.warn("Backend getBook failed, using mock data:", e);
      await delay(400);
      const book = getBookById(id);
      if (!book) throw new Error('Book not found');
      return book;
    }
  },

  // Get home page sections data
  getHomeSections: async () => {
    await delay(800);
    return {
      featured: getFeaturedBooks(),
      recent: getRecentBooks(),
      popular: getPopularBooks(),
      recommended: getRecommendedBooks(),
    };
  },

  // Global search
  search: async (query) => {
    await delay(300);
    return searchBooks(query);
  },

  // Get similar books
  getSimilar: async (bookId) => {
    await delay(400);
    return getSimilarBooks(bookId);
  }
};

export default bookService;
