// Mock book data - enriched from catalog.json with marketplace fields
// Uses real NCERT book cover images from public/book-images/

const catalogBooks = [
  { id: "ncert-9-beehive", title: "Beehive", class: 9, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/01-beehive.webp" },
  { id: "ncert-9-moments", title: "Moments", class: 9, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/02-moments.webp" },
  { id: "ncert-9-words-and-expressions-i", title: "Words and Expressions I", class: 9, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/03-words-and-expressions-i.webp" },
  { id: "ncert-9-mathematics", title: "Mathematics", class: 9, subject: "Mathematics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/04-mathematics.webp" },
  { id: "ncert-9-science", title: "Science", class: 9, subject: "Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/05-science.webp" },
  { id: "ncert-9-india-and-the-contemporary-world-i", title: "India and the Contemporary World I", class: 9, subject: "History", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/06-india-and-the-contemporary-world-i.webp" },
  { id: "ncert-9-contemporary-india-i", title: "Contemporary India I", class: 9, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/07-contemporary-india-i.webp" },
  { id: "ncert-9-democratic-politics-i", title: "Democratic Politics I", class: 9, subject: "Political Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/08-democratic-politics-i.webp" },
  { id: "ncert-9-economics", title: "Economics", class: 9, subject: "Economics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/09-economics.webp" },
  { id: "ncert-9-information-and-communication-technology", title: "Information and Communication Technology", class: 9, subject: "Information Technology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/10-information-and-communication-technology.webp" },
  { id: "ncert-9-health-and-physical-education", title: "Health and Physical Education", class: 9, subject: "Health and Physical Education", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-9/11-health-and-physical-education.webp" },
  { id: "ncert-10-first-flight", title: "First Flight", class: 10, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/01-first-flight.webp" },
  { id: "ncert-10-footprints-without-feet", title: "Footprints Without Feet", class: 10, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/02-footprints-without-feet.webp" },
  { id: "ncert-10-words-and-expressions-ii", title: "Words and Expressions II", class: 10, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/03-words-and-expressions-ii.webp" },
  { id: "ncert-10-mathematics", title: "Mathematics", class: 10, subject: "Mathematics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/04-mathematics.webp" },
  { id: "ncert-10-science", title: "Science", class: 10, subject: "Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/05-science.webp" },
  { id: "ncert-10-india-and-the-contemporary-world-ii", title: "India and the Contemporary World II", class: 10, subject: "History", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/06-india-and-the-contemporary-world-ii.webp" },
  { id: "ncert-10-contemporary-india-ii", title: "Contemporary India II", class: 10, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/07-contemporary-india-ii.webp" },
  { id: "ncert-10-democratic-politics-ii", title: "Democratic Politics II", class: 10, subject: "Political Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/08-democratic-politics-ii.webp" },
  { id: "ncert-10-understanding-economic-development", title: "Understanding Economic Development", class: 10, subject: "Economics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/09-understanding-economic-development.webp" },
  { id: "ncert-10-information-technology", title: "Information Technology", class: 10, subject: "Information Technology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/10-information-technology.webp" },
  { id: "ncert-10-health-and-physical-education", title: "Health and Physical Education", class: 10, subject: "Health and Physical Education", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-10/11-health-and-physical-education.webp" },
  { id: "ncert-11-hornbill", title: "Hornbill", class: 11, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/01-hornbill.webp" },
  { id: "ncert-11-snapshots", title: "Snapshots", class: 11, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/02-snapshots.webp" },
  { id: "ncert-11-woven-words", title: "Woven Words", class: 11, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/03-woven-words.webp" },
  { id: "ncert-11-mathematics", title: "Mathematics", class: 11, subject: "Mathematics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/04-mathematics.webp" },
  { id: "ncert-11-physics-part-i", title: "Physics Part I", class: 11, subject: "Physics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/05-physics-part-i.webp" },
  { id: "ncert-11-physics-part-ii", title: "Physics Part II", class: 11, subject: "Physics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/06-physics-part-ii.webp" },
  { id: "ncert-11-chemistry-part-i", title: "Chemistry Part I", class: 11, subject: "Chemistry", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/07-chemistry-part-i.webp" },
  { id: "ncert-11-chemistry-part-ii", title: "Chemistry Part II", class: 11, subject: "Chemistry", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/08-chemistry-part-ii.webp" },
  { id: "ncert-11-biology", title: "Biology", class: 11, subject: "Biology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/09-biology.webp" },
  { id: "ncert-11-themes-in-world-history", title: "Themes in World History", class: 11, subject: "History", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/10-themes-in-world-history.webp" },
  { id: "ncert-11-fundamentals-of-physical-geography", title: "Fundamentals of Physical Geography", class: 11, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/11-fundamentals-of-physical-geography.webp" },
  { id: "ncert-11-india-physical-environment", title: "India: Physical Environment", class: 11, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/12-india-physical-environment.webp" },
  { id: "ncert-11-practical-work-in-geography-part-i", title: "Practical Work in Geography Part I", class: 11, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/13-practical-work-in-geography-part-i.webp" },
  { id: "ncert-11-indian-constitution-at-work", title: "Indian Constitution at Work", class: 11, subject: "Political Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/14-indian-constitution-at-work.webp" },
  { id: "ncert-11-political-theory", title: "Political Theory", class: 11, subject: "Political Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/15-political-theory.webp" },
  { id: "ncert-11-indian-economic-development", title: "Indian Economic Development", class: 11, subject: "Economics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/16-indian-economic-development.webp" },
  { id: "ncert-11-statistics-for-economics", title: "Statistics for Economics", class: 11, subject: "Economics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/17-statistics-for-economics.webp" },
  { id: "ncert-11-introductory-microeconomics", title: "Introductory Microeconomics", class: 11, subject: "Economics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/18-introductory-microeconomics.webp" },
  { id: "ncert-11-financial-accounting-part-i", title: "Financial Accounting Part I", class: 11, subject: "Accountancy", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/19-financial-accounting-part-i.webp" },
  { id: "ncert-11-financial-accounting-part-ii", title: "Financial Accounting Part II", class: 11, subject: "Accountancy", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/20-financial-accounting-part-ii.webp" },
  { id: "ncert-11-business-studies", title: "Business Studies", class: 11, subject: "Business Studies", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/21-business-studies.webp" },
  { id: "ncert-11-psychology", title: "Psychology", class: 11, subject: "Psychology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/22-psychology.webp" },
  { id: "ncert-11-introducing-sociology", title: "Introducing Sociology", class: 11, subject: "Sociology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/23-introducing-sociology.webp" },
  { id: "ncert-11-understanding-society", title: "Understanding Society", class: 11, subject: "Sociology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/24-understanding-society.webp" },
  { id: "ncert-11-computer-science", title: "Computer Science", class: 11, subject: "Computer Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/25-computer-science.webp" },
  { id: "ncert-11-informatics-practices", title: "Informatics Practices", class: 11, subject: "Informatics Practices", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/26-informatics-practices.webp" },
  { id: "ncert-11-an-introduction-to-indian-art-part-i", title: "An Introduction to Indian Art Part I", class: 11, subject: "Fine Arts", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-11/27-an-introduction-to-indian-art-part-i.webp" },
  { id: "ncert-12-flamingo", title: "Flamingo", class: 12, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/01-flamingo.webp" },
  { id: "ncert-12-vistas", title: "Vistas", class: 12, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/02-vistas.webp" },
  { id: "ncert-12-kaleidoscope", title: "Kaleidoscope", class: 12, subject: "English", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/03-kaleidoscope.webp" },
  { id: "ncert-12-mathematics-part-i", title: "Mathematics Part I", class: 12, subject: "Mathematics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/04-mathematics-part-i.webp" },
  { id: "ncert-12-mathematics-part-ii", title: "Mathematics Part II", class: 12, subject: "Mathematics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/05-mathematics-part-ii.webp" },
  { id: "ncert-12-physics-part-i", title: "Physics Part I", class: 12, subject: "Physics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/06-physics-part-i.webp" },
  { id: "ncert-12-physics-part-ii", title: "Physics Part II", class: 12, subject: "Physics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/07-physics-part-ii.webp" },
  { id: "ncert-12-chemistry-part-i", title: "Chemistry Part I", class: 12, subject: "Chemistry", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/08-chemistry-part-i.webp" },
  { id: "ncert-12-chemistry-part-ii", title: "Chemistry Part II", class: 12, subject: "Chemistry", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/09-chemistry-part-ii.webp" },
  { id: "ncert-12-biology", title: "Biology", class: 12, subject: "Biology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/10-biology.webp" },
  { id: "ncert-12-themes-in-indian-history-part-i", title: "Themes in Indian History Part I", class: 12, subject: "History", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/11-themes-in-indian-history-part-i.webp" },
  { id: "ncert-12-themes-in-indian-history-part-ii", title: "Themes in Indian History Part II", class: 12, subject: "History", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/12-themes-in-indian-history-part-ii.webp" },
  { id: "ncert-12-themes-in-indian-history-part-iii", title: "Themes in Indian History Part III", class: 12, subject: "History", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/13-themes-in-indian-history-part-iii.webp" },
  { id: "ncert-12-fundamentals-of-human-geography", title: "Fundamentals of Human Geography", class: 12, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/14-fundamentals-of-human-geography.webp" },
  { id: "ncert-12-india-people-and-economy", title: "India: People and Economy", class: 12, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/15-india-people-and-economy.webp" },
  { id: "ncert-12-practical-work-in-geography-part-ii", title: "Practical Work in Geography Part II", class: 12, subject: "Geography", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/16-practical-work-in-geography-part-ii.webp" },
  { id: "ncert-12-contemporary-world-politics", title: "Contemporary World Politics", class: 12, subject: "Political Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/17-contemporary-world-politics.webp" },
  { id: "ncert-12-politics-in-india-since-independence", title: "Politics in India Since Independence", class: 12, subject: "Political Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/18-politics-in-india-since-independence.webp" },
  { id: "ncert-12-introductory-macroeconomics", title: "Introductory Macroeconomics", class: 12, subject: "Economics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/19-introductory-macroeconomics.webp" },
  { id: "ncert-12-indian-economic-development", title: "Indian Economic Development", class: 12, subject: "Economics", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/20-indian-economic-development.webp" },
  { id: "ncert-12-accounting-for-partnership-firms-and-companies", title: "Accounting for Partnership Firms and Companies", class: 12, subject: "Accountancy", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/21-accounting-for-partnership-firms-and-companies.webp" },
  { id: "ncert-12-computerised-accounting-system", title: "Computerised Accounting System", class: 12, subject: "Accountancy", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/22-computerised-accounting-system.webp" },
  { id: "ncert-12-business-studies-part-i", title: "Business Studies Part I", class: 12, subject: "Business Studies", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/23-business-studies-part-i.webp" },
  { id: "ncert-12-business-studies-part-ii", title: "Business Studies Part II", class: 12, subject: "Business Studies", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/24-business-studies-part-ii.webp" },
  { id: "ncert-12-psychology", title: "Psychology", class: 12, subject: "Psychology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/25-psychology.webp" },
  { id: "ncert-12-indian-society", title: "Indian Society", class: 12, subject: "Sociology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/26-indian-society.webp" },
  { id: "ncert-12-social-change-and-development-in-india", title: "Social Change and Development in India", class: 12, subject: "Sociology", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/27-social-change-and-development-in-india.webp" },
  { id: "ncert-12-computer-science", title: "Computer Science", class: 12, subject: "Computer Science", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/28-computer-science.webp" },
  { id: "ncert-12-informatics-practices", title: "Informatics Practices", class: 12, subject: "Informatics Practices", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/29-informatics-practices.webp" },
  { id: "ncert-12-an-introduction-to-indian-art-part-ii", title: "An Introduction to Indian Art Part II", class: 12, subject: "Fine Arts", board: "NCERT/CBSE", medium: "English", image: "/book-images/class-12/30-an-introduction-to-indian-art-part-ii.webp" },
];

// Sellers pool
const sellers = [
  { id: 's1', name: 'Rahul Sharma', city: 'Delhi', rating: 4.8, totalSales: 245 },
  { id: 's2', name: 'Priya Patel', city: 'Mumbai', rating: 4.9, totalSales: 189 },
  { id: 's3', name: 'Amit Kumar', city: 'Bangalore', rating: 4.7, totalSales: 312 },
  { id: 's4', name: 'Sneha Gupta', city: 'Pune', rating: 4.6, totalSales: 167 },
  { id: 's5', name: 'Vikram Singh', city: 'Jaipur', rating: 4.5, totalSales: 98 },
  { id: 's6', name: 'Anita Desai', city: 'Chennai', rating: 4.8, totalSales: 203 },
  { id: 's7', name: 'Ravi Verma', city: 'Kolkata', rating: 4.4, totalSales: 156 },
  { id: 's8', name: 'Meera Nair', city: 'Hyderabad', rating: 4.7, totalSales: 134 },
];

// Conditions pool
const conditions = ['like-new', 'good', 'good', 'fair', 'like-new', 'good'];

// Map subject to category
const subjectToCategory = {
  'English': 'academic',
  'Mathematics': 'academic',
  'Science': 'academic',
  'Physics': 'academic',
  'Chemistry': 'academic',
  'Biology': 'academic',
  'History': 'history',
  'Geography': 'academic',
  'Political Science': 'academic',
  'Economics': 'business',
  'Accountancy': 'business',
  'Business Studies': 'business',
  'Psychology': 'self-help',
  'Sociology': 'non-fiction',
  'Computer Science': 'technology',
  'Informatics Practices': 'technology',
  'Information Technology': 'technology',
  'Fine Arts': 'non-fiction',
  'Health and Physical Education': 'academic',
};

// Enrich catalog with marketplace data
const enrichBook = (book, index) => {
  const seller = sellers[index % sellers.length];
  const condition = conditions[index % conditions.length];
  const originalPrice = 150 + Math.floor(Math.random() * 400);
  const discountPercent = 20 + Math.floor(Math.random() * 50);
  const sellingPrice = Math.round(originalPrice * (1 - discountPercent / 100));
  const daysAgo = Math.floor(Math.random() * 60);
  const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

  return {
    ...book,
    author: 'NCERT',
    isbn: `978-93-${String(5000 + index).padStart(4, '0')}-${String(Math.floor(Math.random() * 99)).padStart(2, '0')}-${index}`,
    publisher: 'NCERT',
    edition: '2024-25',
    publicationYear: 2024,
    category: subjectToCategory[book.subject] || 'academic',
    genre: book.subject,
    language: 'English',
    description: `Pre-owned ${book.title} textbook for Class ${book.class} (${book.board}). This book is in ${condition === 'like-new' ? 'like-new' : condition} condition and perfect for students preparing for their exams. All pages intact, no missing content.`,
    condition,
    originalPrice,
    sellingPrice,
    discount: discountPercent,
    quantity: 1 + Math.floor(Math.random() * 5),
    available: Math.random() > 0.1,
    seller,
    sellerId: seller.id,
    rating: (3.5 + Math.random() * 1.5).toFixed(1),
    reviewCount: Math.floor(Math.random() * 30) + 1,
    soldCount: Math.floor(Math.random() * 50),
    views: Math.floor(Math.random() * 500) + 50,
    images: [book.image],
    deliveryMethods: ['standard', 'express'],
    status: 'approved',
    featured: index < 12,
    createdAt,
    updatedAt: createdAt,
  };
};

// Generate all books
export const mockBooks = catalogBooks.map((book, index) => enrichBook(book, index));

// Helper getters
export const getFeaturedBooks = () => mockBooks.filter(b => b.featured);
export const getRecentBooks = () => [...mockBooks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 12);
export const getPopularBooks = () => [...mockBooks].sort((a, b) => b.soldCount - a.soldCount).slice(0, 12);
export const getRecommendedBooks = () => [...mockBooks].sort(() => 0.5 - Math.random()).slice(0, 8);
export const getBookById = (id) => mockBooks.find(b => b.id === id);
export const getBooksByCategory = (category) => mockBooks.filter(b => b.category === category);
export const getBooksByClass = (classLevel) => mockBooks.filter(b => b.class === classLevel);
export const getBooksBySubject = (subject) => mockBooks.filter(b => b.subject === subject);
export const getBooksBySeller = (sellerId) => mockBooks.filter(b => b.sellerId === sellerId);
export const getSimilarBooks = (bookId) => {
  const book = getBookById(bookId);
  if (!book) return [];
  return mockBooks.filter(b => b.id !== bookId && (b.subject === book.subject || b.class === book.class)).slice(0, 6);
};
export const searchBooks = (query) => {
  const q = query.toLowerCase();
  return mockBooks.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.subject.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.isbn.toLowerCase().includes(q)
  );
};

export const filterBooks = (books = mockBooks, filters = {}) => {
  const {
    search = '',
    query = '',
    category,
    genre,
    author,
    condition,
    language,
    location,
    availability,
    minPrice,
    maxPrice,
    sort = 'newest',
  } = filters;

  const textQuery = String(search || query).trim().toLowerCase();

  const filtered = books.filter((book) => {
    const matchesText = !textQuery || [
      book.title,
      book.author,
      book.isbn,
      book.category,
      book.genre,
      book.seller?.name,
      book.seller?.city,
    ].some((value) => String(value || '').toLowerCase().includes(textQuery));

    const matchesCategory = !category || category === 'all' || book.category === category;
    const matchesGenre = !genre || genre === 'all' || book.genre === genre;
    const matchesAuthor = !author || String(book.author).toLowerCase().includes(String(author).toLowerCase());
    const matchesCondition = !condition || condition === 'all' || book.condition === condition;
    const matchesLanguage = !language || language === 'all' || book.language === language;
    const matchesLocation = !location || location === 'all' || book.seller?.city === location;
    const matchesAvailability = !availability || availability === 'all' || (availability === 'available' ? book.available : !book.available);
    const matchesMin = minPrice === undefined || minPrice === '' || book.sellingPrice >= Number(minPrice);
    const matchesMax = maxPrice === undefined || maxPrice === '' || book.sellingPrice <= Number(maxPrice);

    return matchesText && matchesCategory && matchesGenre && matchesAuthor && matchesCondition &&
      matchesLanguage && matchesLocation && matchesAvailability && matchesMin && matchesMax;
  });

  const sorters = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    'price-low': (a, b) => a.sellingPrice - b.sellingPrice,
    'price-high': (a, b) => b.sellingPrice - a.sellingPrice,
    popular: (a, b) => b.soldCount - a.soldCount,
    rating: (a, b) => Number(b.rating) - Number(a.rating),
    discount: (a, b) => b.discount - a.discount,
  };

  return [...filtered].sort(sorters[sort] || sorters.newest);
};

export default mockBooks;
