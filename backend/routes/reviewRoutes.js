const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Public routes
router.get("/book/:bookId", reviewController.getBookReviews);

// Protected Buyer routes
router.post("/", protect, restrictTo("buyer"), reviewController.addReview);

// Protected Admin routes
router.post("/:id/moderate", protect, restrictTo("admin"), reviewController.moderateReview);

module.exports = router;
