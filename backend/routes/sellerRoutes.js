const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// All routes are protected and restricted to sellers
router.use(protect);
router.use(restrictTo("seller"));

router.get("/profile", sellerController.getProfile);
router.put("/profile", upload.single("profileImage"), sellerController.updateProfile);
router.post("/verify", sellerController.submitVerificationDetails);

router.get("/books", sellerController.getMyListings);
router.post("/books", upload.array("images", 5), sellerController.createBookListing);
router.put("/books/:id", upload.array("images", 5), sellerController.updateBookListing);
router.delete("/books/:id", sellerController.deleteBookListing);
router.post("/books/:id/resubmit", sellerController.resubmitBookListing);

// Order Management & Sales
router.get("/orders", sellerController.getReceivedOrders);
router.get("/orders/:id", sellerController.getReceivedOrderDetails);
router.post("/orders/:id/confirm", sellerController.confirmOrder);
router.post("/orders/:id/pack", sellerController.packOrder);
router.post("/orders/:id/ship", sellerController.shipOrder);
router.get("/analytics", sellerController.getAnalytics);

module.exports = router;
