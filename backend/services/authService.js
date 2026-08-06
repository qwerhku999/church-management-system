const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const PUBLIC_REGISTRATION_ROLES = ['member', 'volunteer'];

const getPublicRegistrationRole = (requestedRole) => {
  if (PUBLIC_REGISTRATION_ROLES.includes(requestedRole)) {
    return requestedRole;
  }

  return 'member';
};

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

const register = async (userData) => {
  const { firstName, lastName, email, password, role } = userData;
  const normalizedEmail = email.toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('Email already registered.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    firstName,
    lastName,
    email: normalizedEmail,
    password,
    role: getPublicRegistrationRole(role),
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return {
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  };
};

const login = async (email, password, ipAddress, userAgent) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select('+password +refreshTokens');

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Account is deactivated. Please contact admin.');
    error.statusCode = 403;
    throw error;
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  if (user.refreshTokens.length >= 5) {
    user.refreshTokens.shift();
  }

  user.refreshTokens.push({ token: refreshToken });
  user.lastLogin = new Date();
  await user.save();

  await AuditLog.create({
    user: user._id,
    userEmail: user.email,
    userRole: user.role,
    action: 'LOGIN',
    resource: 'auth',
    description: 'User logged in',
    ipAddress,
    userAgent,
    success: true,
  });

  return {
    user: user.toSafeObject(),
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshTokens');

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 401;
      throw error;
    }

    const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      const error = new Error('Refresh token is invalid or expired.');
      error.statusCode = 401;
      throw error;
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    user.refreshTokens.push({ token: newRefreshToken });
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    if (err.statusCode) throw err;
    const error = new Error('Invalid refresh token.');
    error.statusCode = 401;
    throw error;
  }
};

const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId).select('+refreshTokens');
  if (user && refreshToken) {
    user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
    await user.save();
  }
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  return { user, resetToken };
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    const error = new Error('Password reset token is invalid or has expired.');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    const error = new Error('Current password is incorrect.');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.refreshTokens = [];
  await user.save();

  return user;
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  generateAccessToken,
  generateRefreshToken,
};
