import useAuthStore from '../store/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = useAuthStore.getState().token;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/books${query ? `?${query}` : ''}`;
  return fetch(url, {
    headers: getHeaders()
  }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch books');
    return res.json();
  }).then(json => {
    const rawList = Array.isArray(json.data) ? json.data : (json.data?.books || []);
    const books = rawList.map(b => ({
      ...b,
      id: b._id || b.id,
      category: b.category?.name || b.category || b.genre || 'General',
      image: (b.images && b.images.length > 0 && b.images[0]) || b.image || '/book-images/class-12/04-mathematics-part-i.webp',
      images: (b.images && b.images.length > 0) ? b.images : [(b.image || '/book-images/class-12/04-mathematics-part-i.webp')],
      available: b.availabilityStatus ? (b.availabilityStatus === 'available' && b.quantity > 0) : (b.quantity === undefined || b.quantity > 0),
    }));
    return {
      data: books,
      totalPages: json.meta?.pages || json.pagination?.pages || 1
    };
  });
};

export const getProduct = (id) => {
  return fetch(`${BASE_URL}/books/${id}`, {
    headers: getHeaders()
  }).then(res => {
    if (!res.ok) throw new Error('Failed to fetch book details');
    return res.json();
  }).then(json => {
    const book = json.data?.book || json.data || {};
    return {
      ...book,
      id: book._id || book.id,
      category: book.category?.name || book.category || book.genre || 'General',
      image: (book.images && book.images.length > 0 && book.images[0]) || book.image || '/book-images/class-12/04-mathematics-part-i.webp',
      images: (book.images && book.images.length > 0) ? book.images : [(book.image || '/book-images/class-12/04-mathematics-part-i.webp')],
      available: book.availabilityStatus ? (book.availabilityStatus === 'available' && book.quantity > 0) : (book.quantity === undefined || book.quantity > 0),
    };
  });
};

export const addToCart = (item) => {
  return fetch(`${BASE_URL}/cart`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      bookId: item.bookId || item.id || item._id,
      quantity: item.quantity || 1
    })
  }).then(res => {
    if (!res.ok) throw new Error('Failed to add item to cart');
    return res.json();
  });
};

export const checkoutCOD = (order) => {
  return fetch(`${BASE_URL}/orders/checkout`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(order)
  }).then(res => {
    if (!res.ok) throw new Error('Failed to checkout');
    return res.json();
  });
};
