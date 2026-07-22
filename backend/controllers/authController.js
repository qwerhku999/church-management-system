const authService = require('../services/authService');
const { successResponse, errorResponse } = require('../utils/helpers');
const logger = require('../utils/logger');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return successResponse(res, 'Registration successful.', result, 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const result = await authService.login(email, password, ipAddress, userAgent);
    return successResponse(res, 'Login successful.', result);
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await authService.logout(req.user._id, refreshToken);
    return successResponse(res, 'Logout successful.');
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return errorResponse(res, 'Refresh token is required.', {}, 400);
    }
    const tokens = await authService.refreshAccessToken(refreshToken);
    return successResponse(res, 'Token refreshed successfully.', tokens);
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    // In production, send email with reset link
    // Here we return the token for testing
    const message = 'If an account exists with that email, a password reset link has been sent.';
    if (result) {
      logger.info(`Password reset token for ${email}: ${result.resetToken}`);
      return successResponse(res, message, {
        resetToken: result.resetToken, // Remove in production
      });
    }
    return successResponse(res, message);
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    return successResponse(res, 'Password reset successfully. Please login with your new password.');
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(req.user._id, currentPassword, newPassword);
    return successResponse(res, 'Password changed successfully. Please login again.');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    return successResponse(res, 'Profile retrieved successfully.', { user: req.user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const allowedFields = ['firstName', 'lastName', 'phone', 'avatar'];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });
    return successResponse(res, 'Profile updated successfully.', { user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
};
