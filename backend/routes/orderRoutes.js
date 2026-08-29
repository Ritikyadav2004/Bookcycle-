const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

// All order routes are protected
router.use(protect);

router.post("/checkout", orderController.checkout);
router.get("/", orderController.getOrders);
router.get("/:id", orderController.getOrder);

module.exports = router;
