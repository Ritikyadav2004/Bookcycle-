const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const apiLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorMiddleware');
const AppError = require('./utils/appError');
const authRoutes = require('./routes/authRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const bookRoutes = require('./routes/bookRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

dotenv.config();

const app = express();

// Set security headers
app.use(helmet());

// Cookie parser middleware
app.use(cookieParser());

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// Logger middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Request size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use(apiLimiter);

// Auth routes
app.use('/api/auth', authRoutes);

// Seller routes
app.use('/api/seller', sellerRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Book catalog routes
app.use('/api/books', bookRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Review routes
app.use('/api/reviews', reviewRoutes);

// Recommendation routes
app.use('/api/recommendations', recommendationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BookCycle backend is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to BookCycle API' });
});

// Fallback for non-existent routes (404)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
