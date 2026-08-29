const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// All admin routes must be authorized
router.use(protect);
router.use(restrictTo("admin"));

router.get("/stats", adminController.getStats);
router.post("/users/:id/status", adminController.updateUserStatus);
router.post("/sellers/:id/verify", adminController.verifySeller);
router.post("/books/:id/review", adminController.reviewBookListing);

// Listing queries
router.get("/buyers", adminController.getBuyers);
router.get("/sellers/pending", adminController.getPendingVerifications);
router.get("/sellers", adminController.getSellers);
router.get("/books", adminController.getListings);
router.get("/orders", adminController.getOrders);
router.get("/transactions", adminController.getTransactions);
router.get("/reviews", adminController.getReviews);
router.get("/reports", adminController.getReports);

// Platform settings
router.get("/settings", adminController.getSettings);
router.put("/settings", adminController.updateSettings);

// Category CRUD
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);
router.delete("/categories/:id", adminController.deleteCategory);

module.exports = router;
