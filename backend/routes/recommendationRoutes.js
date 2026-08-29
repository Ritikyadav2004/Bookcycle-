const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");
const { protect } = require("../middleware/authMiddleware");

// All recommendation routes are protected
router.get("/", protect, recommendationController.getRecommendations);

module.exports = router;
