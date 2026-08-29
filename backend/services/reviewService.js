const Review = require("../models/review");
const Order = require("../models/order");
const Book = require("../models/book");
const User = require("../models/user");
const AppError = require("../utils/appError");

// Helper to aggregate averages and update Book and Seller documents
const updateAverages = async (bookId, sellerId) => {
  // 1) Book Average
  const bookStats = await Review.aggregate([
    { $match: { book: bookId, status: "Approved" } },
    { $group: { _id: "$book", avgRating: { $avg: "$rating" } } }
  ]);
  
  const bookAvg = bookStats.length > 0 ? Math.round(bookStats[0].avgRating * 10) / 10 : 0;
  await Book.findByIdAndUpdate(bookId, { averageRating: bookAvg });

  // 2) Seller Average
  const sellerStats = await Review.aggregate([
    { $match: { seller: sellerId, status: "Approved" } },
    { $group: { _id: "$seller", avgRating: { $avg: "$rating" } } }
  ]);

  const sellerAvg = sellerStats.length > 0 ? Math.round(sellerStats[0].avgRating * 10) / 10 : 0;
  await User.findByIdAndUpdate(sellerId, { averageRating: sellerAvg });
};

const createReview = async (buyerId, { bookId, orderId, rating, comment }) => {
  // Validate Rating Limits
  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5", 400);
  }

  // 1) Check that buyer has a DELIVERED order that contains this book
  const order = await Order.findOne({
    _id: orderId,
    buyer: buyerId,
    orderStatus: "Delivered",
    "items.book": bookId,
  });

  if (!order) {
    throw new AppError("You can only review books that you purchased and have been delivered.", 400);
  }

  // 2) Verify one review per buyer-book-order
  const existingReview = await Review.findOne({
    buyer: buyerId,
    book: bookId,
    order: orderId,
  });

  if (existingReview) {
    throw new AppError("You have already reviewed this book for this order", 400);
  }

  const book = await Book.findById(bookId);
  if (!book) throw new AppError("Book not found", 404);

  const review = await Review.create({
    buyer: buyerId,
    seller: book.seller,
    book: bookId,
    order: orderId,
    rating,
    comment,
    status: "Approved", // Default approved
  });

  // Recalculate average ratings
  await updateAverages(bookId, book.seller);

  return review;
};

const getBookReviews = async (bookId) => {
  return Review.find({ book: bookId, status: "Approved" })
    .populate("buyer", "name profileImage")
    .sort({ createdAt: -1 });
};

const moderateReview = async (reviewId, status) => {
  if (!["Approved", "Flagged", "Pending"].includes(status)) {
    throw new AppError("Invalid moderation status", 400);
  }

  const review = await Review.findById(reviewId);
  if (!review) throw new AppError("Review not found", 404);

  review.status = status;
  await review.save();

  // Re-sync averages in case review was Flagged or Approved
  await updateAverages(review.book, review.seller);

  return review;
};

module.exports = {
  createReview,
  getBookReviews,
  moderateReview,
};
