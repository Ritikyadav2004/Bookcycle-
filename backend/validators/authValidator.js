const { body, validationResult } = require("express-validator");
const { sendError } = require("../utils/response");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return sendError(res, "Validation failed", errorMessages, 400);
  }
  next();
};

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("mobile").notEmpty().withMessage("Mobile number is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["buyer", "seller"])
    .withMessage("Role must be buyer or seller"),
  body("shopName")
    .if(body("role").equals("seller"))
    .trim()
    .notEmpty()
    .withMessage("Shop name is required for seller registration"),
  handleValidationErrors,
];

const loginValidator = [
  body("email").isEmail().withMessage("Must be a valid email address").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long"),
  handleValidationErrors,
];

module.exports = {
  registerValidator,
  loginValidator,
  changePasswordValidator,
};
