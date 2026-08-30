// BookCycle App Constants

export const SITE_NAME = 'BookCycle';
export const SITE_TAGLINE = 'Give Books a Second Story';
export const SITE_DESCRIPTION = 'Discover affordable pre-owned books, sell the books you no longer need, and help create a sustainable reading community.';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Book conditions
export const BOOK_CONDITIONS = [
  { value: 'like-new', label: 'Like New', color: 'text-success' },
  { value: 'good', label: 'Good', color: 'text-emerald' },
  { value: 'fair', label: 'Fair', color: 'text-amber-dark' },
  { value: 'acceptable', label: 'Acceptable', color: 'text-mutedText' },
];

// Categories
export const CATEGORIES = [
  { id: 'academic', name: 'Academic', icon: 'GraduationCap', description: 'Textbooks, study guides & academic resources', color: '#237A57' },
  { id: 'competitive-exams', name: 'Competitive Exams', icon: 'Trophy', description: 'UPSC, SSC, JEE, NEET & more', color: '#F4A340' },
  { id: 'fiction', name: 'Fiction', icon: 'BookOpen', description: 'Novels, short stories & literary fiction', color: '#DC4C4C' },
  { id: 'non-fiction', name: 'Non-Fiction', icon: 'Lightbulb', description: 'Essays, journalism & real-world narratives', color: '#163D2A' },
  { id: 'children', name: 'Children', icon: 'Baby', description: 'Picture books, early readers & young adult', color: '#22A06B' },
  { id: 'biography', name: 'Biography', icon: 'User', description: 'Memoirs, autobiographies & life stories', color: '#6B4C9A' },
  { id: 'history', name: 'History', icon: 'Clock', description: 'World history, ancient civilizations & modern era', color: '#8B6914' },
  { id: 'technology', name: 'Technology', icon: 'Cpu', description: 'Programming, AI, web development & IT', color: '#2563EB' },
  { id: 'business', name: 'Business', icon: 'Briefcase', description: 'Entrepreneurship, management & finance', color: '#0D9488' },
  { id: 'self-help', name: 'Self-Help', icon: 'Heart', description: 'Personal development, motivation & wellness', color: '#E11D48' },
];

// Subjects mapping for NCERT books
export const SUBJECTS = [
  'English', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Political Science', 'Economics', 'Accountancy',
  'Business Studies', 'Psychology', 'Sociology', 'Computer Science',
  'Informatics Practices', 'Information Technology', 'Fine Arts',
  'Health and Physical Education',
];

// Classes
export const CLASSES = [9, 10, 11, 12];

// Sort options
export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Best Rated' },
  { value: 'discount', label: 'Highest Discount' },
];

// Order statuses
export const ORDER_STATUSES = {
  pending: { label: 'Pending', color: 'bg-amber/10 text-amber-dark', icon: 'Clock' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: 'CheckCircle' },
  packed: { label: 'Packed', color: 'bg-purple-100 text-purple-700', icon: 'Package' },
  shipped: { label: 'Shipped', color: 'bg-emerald/10 text-emerald', icon: 'Truck' },
  delivered: { label: 'Delivered', color: 'bg-success/10 text-success', icon: 'CheckCircle2' },
  cancelled: { label: 'Cancelled', color: 'bg-error/10 text-error', icon: 'XCircle' },
};

// Listing statuses
export const LISTING_STATUSES = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Pending', color: 'bg-amber/10 text-amber-dark' },
  approved: { label: 'Approved', color: 'bg-success/10 text-success' },
  rejected: { label: 'Rejected', color: 'bg-error/10 text-error' },
  sold: { label: 'Sold', color: 'bg-blue-100 text-blue-700' },
  unavailable: { label: 'Unavailable', color: 'bg-gray-100 text-gray-500' },
};

// Payment methods
export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Cash on Delivery', icon: 'Banknote', description: 'Pay when you receive' },
  { id: 'upi', name: 'UPI Payment', icon: 'Smartphone', description: 'Pay via Google Pay, PhonePe, etc.' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'CreditCard', description: 'Visa, Mastercard, RuPay' },
];

// Delivery methods
export const DELIVERY_METHODS = [
  { id: 'standard', name: 'Standard Delivery', days: '5-7 days', price: 49 },
  { id: 'express', name: 'Express Delivery', days: '2-3 days', price: 99 },
  { id: 'pickup', name: 'Self Pickup', days: 'Coordinate with seller', price: 0 },
];

// Navigation links
export const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/browse', label: 'Browse Books' },
  { path: '/categories', label: 'Categories' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

export const FAQ_ITEMS = [
  {
    question: 'How does BookCycle verify second-hand books?',
    answer: 'Every listing includes condition notes, seller details, images, and admin moderation before it appears in the marketplace.',
  },
  {
    question: 'Can I sell my books after buying them?',
    answer: 'Yes. BookCycle is built around reuse, so buyers can later list books again from the seller portal.',
  },
  {
    question: 'Which payment options are available?',
    answer: 'The frontend supports Cash on Delivery, mock UPI, and mock card flows so the backend can connect real gateways later.',
  },
  {
    question: 'How are shipping and platform fees shown?',
    answer: 'Checkout shows subtotal, delivery charge, platform fee, coupon field, and final total before order placement.',
  },
  {
    question: 'What happens when a seller submits a book?',
    answer: 'The listing moves to pending review and the admin panel can approve, reject with a reason, or remove it.',
  },
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aarav Mehta',
    role: 'class 12 student',
    location: 'Delhi',
    rating: 5,
    content: 'I bought NCERT books for less than half the price and the condition matched the listing perfectly.',
  },
  {
    id: 2,
    name: 'Nisha Rao',
    role: 'seller',
    location: 'Pune',
    rating: 5,
    content: 'The seller dashboard makes listings, approvals, and order updates feel simple and professional.',
  },
  {
    id: 3,
    name: 'Kabir Khan',
    role: 'parent',
    location: 'Mumbai',
    rating: 4,
    content: 'The filters helped me find books by class, subject, price, and condition in a few minutes.',
  },
  {
    id: 4,
    name: 'Meera Iyer',
    role: 'reader',
    location: 'Bengaluru',
    rating: 5,
    content: 'BookCycle feels polished, fast, and trustworthy compared with random marketplace chats.',
  },
];

// Footer links
export const FOOTER_LINKS = {
  company: [
    { path: '/about', label: 'About Us' },
    { path: '/how-it-works', label: 'How It Works' },
    { path: '/contact', label: 'Contact Us' },
    { path: '/seller-guidelines', label: 'Seller Guidelines' },
  ],
  support: [
    { path: '/faq', label: 'FAQ' },
    { path: '/shipping-policy', label: 'Shipping Policy' },
    { path: '/refund-policy', label: 'Refund Policy' },
  ],
  legal: [
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms', label: 'Terms & Conditions' },
  ],
};

// Buyer sidebar links
export const BUYER_NAV_LINKS = [
  { path: '/buyer/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/browse', label: 'Browse Books', icon: 'Search' },
  { path: '/buyer/cart', label: 'Cart', icon: 'ShoppingCart' },
  { path: '/buyer/wishlist', label: 'Wishlist', icon: 'Heart' },
  { path: '/buyer/orders', label: 'My Orders', icon: 'Package' },
  { path: '/buyer/recently-viewed', label: 'Recently Viewed', icon: 'Eye' },
  { path: '/buyer/recommendations', label: 'Recommendations', icon: 'Sparkles' },
  { path: '/buyer/reviews', label: 'My Reviews', icon: 'Star' },
  { path: '/buyer/notifications', label: 'Notifications', icon: 'Bell' },
  { path: '/buyer/profile', label: 'Profile', icon: 'User' },
  { path: '/buyer/settings', label: 'Settings', icon: 'Settings' },
];

// Seller sidebar links
export const SELLER_NAV_LINKS = [
  { path: '/seller/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/seller/add-book', label: 'Add New Book', icon: 'PlusCircle' },
  { path: '/seller/listings', label: 'My Listings', icon: 'BookOpen' },
  { path: '/seller/orders', label: 'Orders Received', icon: 'Package' },
  { path: '/seller/sales', label: 'Sales', icon: 'TrendingUp' },
  { path: '/seller/transactions', label: 'Transactions', icon: 'Receipt' },
  { path: '/seller/reviews', label: 'Reviews', icon: 'Star' },
  { path: '/seller/notifications', label: 'Notifications', icon: 'Bell' },
  { path: '/seller/profile', label: 'Seller Profile', icon: 'User' },
  { path: '/seller/settings', label: 'Settings', icon: 'Settings' },
];

// Admin sidebar links
export const ADMIN_NAV_LINKS = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/admin/buyers', label: 'Buyers', icon: 'Users' },
  { path: '/admin/sellers', label: 'Sellers', icon: 'Store' },
  { path: '/admin/listings', label: 'Book Listings', icon: 'BookOpen' },
  { path: '/admin/categories', label: 'Categories', icon: 'Tag' },
  { path: '/admin/orders', label: 'Orders', icon: 'Package' },
  { path: '/admin/transactions', label: 'Transactions', icon: 'Receipt' },
  { path: '/admin/reports', label: 'Reports', icon: 'Flag' },
  { path: '/admin/reviews', label: 'Reviews', icon: 'Star' },
  { path: '/admin/notifications', label: 'Notifications', icon: 'Bell' },
  { path: '/admin/settings', label: 'Settings', icon: 'Settings' },
];

// Sustainability stats
export const SUSTAINABILITY_STATS = [
  { value: 15420, label: 'Books Reused', suffix: '+', icon: 'BookOpen' },
  { value: 7800, label: 'Trees Saved', suffix: '+', icon: 'TreePine' },
  { value: 2400000, label: 'Money Saved (₹)', suffix: '+', prefix: '₹', icon: 'IndianRupee' },
  { value: 8500, label: 'Active Readers', suffix: '+', icon: 'Users' },
];

// How it works steps
export const HOW_IT_WORKS_STEPS = [
  {
    step: 1,
    title: 'Find a Book',
    description: 'Browse thousands of pre-owned books across categories. Use filters to find exactly what you need.',
    icon: 'Search',
  },
  {
    step: 2,
    title: 'Place Your Order',
    description: 'Add books to your cart and checkout securely. Choose your preferred delivery method.',
    icon: 'ShoppingCart',
  },
  {
    step: 3,
    title: 'Receive & Read',
    description: 'Get your books delivered to your doorstep. Enjoy reading while saving money and the planet.',
    icon: 'BookOpen',
  },
  {
    step: 4,
    title: 'Sell It Again',
    description: 'Done reading? List your books on BookCycle and give them a new home. Complete the cycle!',
    icon: 'RefreshCw',
  },
];

// Indian states for forms
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Delhi', 'Chandigarh',
];

// Languages
export const LANGUAGES = [
  'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi',
  'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu',
];
