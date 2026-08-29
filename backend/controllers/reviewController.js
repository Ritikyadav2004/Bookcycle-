const reviewService = require("../services/reviewService");
const { sendSuccess } = require("../utils/response");

const addReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(req.user._id, req.body);
    return sendSuccess(res, "Review submitted successfully", { review }, 201);
  } catch (error) {
    next(error);
  }
};

const getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const reviews = await reviewService.getBookReviews(bookId);
    return sendSuccess(res, "Book reviews retrieved successfully", { reviews });
  } catch (error) {
    next(error);
  }
};

const moderateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const review = await reviewService.moderateReview(id, status);
    return sendSuccess(res, `Review status updated to ${status} successfully`, { review });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getBookReviews,
  moderateReview,
};
