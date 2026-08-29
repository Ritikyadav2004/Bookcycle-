const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require("../validators/authValidator");

router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);
router.post("/admin/login", loginValidator, authController.adminLogin);
router.post("/refresh-token", authController.refresh);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgot);
router.post("/reset-password", authController.reset);
router.post("/verify-email", authController.verify);
router.get("/verify-email", authController.verify);

// Protected routes
router.post("/change-password", protect, changePasswordValidator, authController.change);
router.get("/me", protect, authController.getMe);

module.exports = router;
