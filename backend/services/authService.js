const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/refreshToken");
const AppError = require("../utils/appError");

// JWT Helpers
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "your_development_jwt_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
  );
};

const generateAndStoreRefreshToken = async (user) => {
  const token = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  await RefreshToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
  });

  return token;
};

// Core Business Logic
const registerUser = async (userData) => {
  const { name, email, mobile, password, role, shopName } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email is already registered", 400);
  }

  // Set default verification status for seller
  const sellerVerificationStatus = role === "seller" ? "pending" : "unverified";

  // Generate email verification token
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await User.create({
    name,
    email,
    mobile,
    password,
    role: role || "buyer",
    shopName: role === "seller" ? shopName : "",
    sellerVerificationStatus,
    emailVerified: true,
    emailVerificationToken: crypto.createHash("sha256").update(verificationToken).digest("hex"),
    emailVerificationExpires: verificationExpires,
  });

  // Log verification link for Phase 3/dev verification
  console.log(`[Email Verification Link for ${email}]: http://localhost:5000/api/auth/verify-email?token=${verificationToken}`);

  return { user, verificationToken };
};

const loginUser = async ({ email, password }) => {
  // Find user and select password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("This email is not registered. Please sign up first.", 404);
  }

  // Check if account status is active
  if (user.accountStatus !== "active") {
    throw new AppError(`Your account is ${user.accountStatus}.`, 403);
  }

  // Compare passwords
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateAndStoreRefreshToken(user);

  return { user, accessToken, refreshToken };
};

const loginAdmin = async ({ email, password }) => {
  const user = await User.findOne({ email, role: "admin" }).select("+password");
  if (!user) {
    throw new AppError("Invalid admin credentials", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid admin credentials", 401);
  }

  user.lastLogin = new Date();
  await user.save();

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateAndStoreRefreshToken(user);

  return { user, accessToken, refreshToken };
};

const rotateRefreshToken = async (oldToken) => {
  const oldHash = crypto.createHash("sha256").update(oldToken).digest("hex");
  const storedToken = await RefreshToken.findOne({ tokenHash: oldHash });

  if (!storedToken) {
    throw new AppError("Invalid refresh token", 401);
  }

  // Check if token has been revoked previously (potential replay attack!)
  if (storedToken.revokedAt) {
    // Terminate all sessions for the user
    await RefreshToken.deleteMany({ user: storedToken.user });
    throw new AppError("Token reuse detected! Sessions terminated.", 401);
  }

  // Check expiration
  if (new Date() > storedToken.expiresAt) {
    await RefreshToken.deleteOne({ _id: storedToken._id });
    throw new AppError("Refresh token expired", 401);
  }

  // Revoke old token
  storedToken.revokedAt = new Date();
  await storedToken.save();

  const user = await User.findById(storedToken.user);
  if (!user || user.accountStatus !== "active") {
    throw new AppError("User not found or suspended", 401);
  }

  // Generate new tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = await generateAndStoreRefreshToken(user);

  return { accessToken, refreshToken };
};

const logoutUser = async (token) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  await RefreshToken.deleteOne({ tokenHash: hash });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("There is no user with that email address", 404);
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  await user.save();

  // Log link to console for Phase 3/dev verification
  console.log(`[Password Reset Link for ${email}]: http://localhost:3000/reset-password?token=${resetToken}`);

  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Token is invalid or has expired", 400);
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  // Invalidate all refresh tokens for user since password changed
  await RefreshToken.deleteMany({ user: user._id });

  return user;
};

const verifyEmail = async (token) => {
  const hash = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hash,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new AppError("Verification token is invalid or has expired", 400);
  }

  user.emailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Incorrect current password", 400);
  }

  user.password = newPassword;
  await user.save();

  // Invalidate active refresh tokens
  await RefreshToken.deleteMany({ user: userId });
};

module.exports = {
  registerUser,
  loginUser,
  loginAdmin,
  rotateRefreshToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  generateAccessToken,
  generateAndStoreRefreshToken,
};
