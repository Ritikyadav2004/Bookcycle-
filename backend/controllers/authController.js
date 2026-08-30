const authService = require("../services/authService");
const { sendSuccess } = require("../utils/response");
const AppError = require("../utils/appError");

// Helper to set HTTP-Only Cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
  const cookieOptionsAccess = {
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  const cookieOptionsRefresh = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  res.cookie("access_token", accessToken, cookieOptionsAccess);
  res.cookie("refresh_token", refreshToken, cookieOptionsRefresh);
};

const clearTokenCookies = (res) => {
  res.clearCookie("access_token", { httpOnly: true, sameSite: "strict" });
  res.clearCookie("refresh_token", { httpOnly: true, sameSite: "strict" });
};

const register = async (req, res, next) => {
  try {
    const { name, email, mobile, password, role, shopName } = req.body;
    const { user } = await authService.registerUser({
      name,
      email,
      mobile,
      password,
      role,
      shopName,
    });

    const jwt = require("jsonwebtoken");
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "your_development_jwt_secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "15m" }
    );

    return sendSuccess(res, "Registration successful.", {
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser({
      email,
      password,
    });

    setTokenCookies(res, accessToken, refreshToken);

    return sendSuccess(res, "Login successful", {
      token: accessToken, // support both bearer token and cookies
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginAdmin({
      email,
      password,
    });

    setTokenCookies(res, accessToken, refreshToken);

    return sendSuccess(res, "Admin login successful", {
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    // Read from cookies or request body
    const token = req.cookies.refresh_token || req.body.refreshToken;
    if (!token) {
      return next(new AppError("Refresh token is required", 400));
    }

    const { accessToken, refreshToken: newRefreshToken } = await authService.rotateRefreshToken(token);

    setTokenCookies(res, accessToken, newRefreshToken);

    return sendSuccess(res, "Tokens refreshed successfully", {
      token: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refresh_token || req.body.refreshToken;
    if (token) {
      await authService.logoutUser(token);
    }

    clearTokenCookies(res);

    return sendSuccess(res, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

const forgot = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    const resetToken = await authService.forgotPassword(email);

    return sendSuccess(res, "Password reset link sent to your email", {
      // return in development to allow easy verification without credentials
      resetToken: process.env.NODE_ENV !== "production" ? resetToken : undefined,
    });
  } catch (error) {
    next(error);
  }
};

const reset = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return next(new AppError("Token and password are required", 400));
    }

    await authService.resetPassword(token, password);

    return sendSuccess(res, "Password reset successful");
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const token = req.query.token || req.body.token;
    if (!token) {
      return next(new AppError("Verification token is required", 400));
    }

    await authService.verifyEmail(token);

    return sendSuccess(res, "Email verified successfully");
  } catch (error) {
    next(error);
  }
};

const change = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);

    clearTokenCookies(res);

    return sendSuccess(res, "Password changed successfully. Please log in again.");
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email, mobile, city } = req.body;
    
    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        throw new AppError("Email is already taken", 400);
      }
    }
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (mobile) updateData.mobile = mobile;
    if (city) updateData.city = city;
    
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });
    
    return sendSuccess(res, "Profile updated successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user is attached via protect middleware
    return sendSuccess(res, "Current user retrieved successfully", {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile,
        role: req.user.role,
        emailVerified: req.user.emailVerified,
        sellerVerificationStatus: req.user.sellerVerificationStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  refresh,
  logout,
  forgot,
  reset,
  verify,
  change,
  getMe,
  updateProfile,
};
