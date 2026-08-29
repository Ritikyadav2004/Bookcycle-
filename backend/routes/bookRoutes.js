const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { protect, optionalProtect } = require("../middleware/authMiddleware");

// Public catalog routes
router.get("/", bookController.browseBooks);

// Protected buyer catalog features
router.get("/wishlist", protect, bookController.getWishlist);
router.get("/recent", protect, bookController.getRecent);

// Specific ID matching (must go last to prevent matching static routes)
router.get("/:id", optionalProtect, bookController.getBook);
router.post("/:id/wishlist", protect, bookController.wishlistToggle);

module.exports = router;
