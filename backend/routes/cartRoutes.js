const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// All cart routes are protected
router.use(protect);

router.get("/", cartController.getCart);
router.post("/", cartController.addItem);
router.put("/items/:bookId", cartController.updateItem);
router.delete("/items/:bookId", cartController.removeItem);

module.exports = router;
