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

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

const checkOwnership = (Model, idParam = "id", userField = "user") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[idParam];
      const doc = await Model.findById(resourceId);

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      // Admins bypass resource ownership checks
      if (req.user.role === "admin") {
        req.resource = doc;
        return next();
      }

      const ownerId = doc[userField] ? doc[userField]._id || doc[userField] : null;

      if (!ownerId || ownerId.toString() !== req.user._id.toString()) {
        return next(new AppError("You do not own this resource", 403));
      }

      req.resource = doc;
      next();
    } catch (error) {
      next(error);
    }
  };
};

const optionalProtect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_development_jwt_secret");
      const currentUser = await User.findById(decoded.id);
      if (currentUser && currentUser.accountStatus === "active") {
        req.user = currentUser;
      }
    }
    next();
  } catch (error) {
    next();
  }
};

module.exports = { protect, restrictTo, checkOwnership, optionalProtect };
