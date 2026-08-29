const jwt = require("jsonwebtoken");
const User = require("../models/user");
const AppError = require("../utils/appError");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Get token from authorization header or cookies
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      return next(new AppError("You are not logged in! Please log in to get access.", 401));
    }

    // 2) Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your_development_jwt_secret");
    } catch (err) {
      return next(new AppError("Invalid or expired token. Please log in again.", 401));
    }

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError("The user belonging to this token no longer exists.", 401));
    }

    // 4) Check if user account is active
    if (currentUser.accountStatus !== "active") {
      return next(new AppError("Your account has been blocked or suspended.", 403));
    }

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect };
