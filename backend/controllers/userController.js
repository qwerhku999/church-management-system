const User = require('../models/User');
const { successResponse, paginatedResponse, getPaginationParams, getSortParams, buildSearchFilter } = require('../utils/helpers');

const getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const sort = getSortParams(req.query);
    const filter = {};

    if (req.query.search) Object.assign(filter, buildSearchFilter(req.query.search, ['firstName', 'lastName', 'email']));
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password -refreshTokens -passwordResetToken -passwordResetExpires')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Users retrieved.', users, {
      total, page, limit, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshTokens -passwordResetToken -passwordResetExpires')
      .populate('linkedMember', 'firstName lastName memberNumber');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return successResponse(res, 'User retrieved.', { user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email already registered.' });
    const user = await User.create(req.body);
    return successResponse(res, 'User created successfully.', { user: user.toSafeObject() }, 201);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const restrictedFields = ['password', 'refreshTokens', 'passwordResetToken', 'passwordResetExpires'];
    restrictedFields.forEach((f) => delete req.body[f]);

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password -refreshTokens -passwordResetToken -passwordResetExpires');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return successResponse(res, 'User updated.', { user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return successResponse(res, 'User deleted.');
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    return successResponse(res, `User ${user.isActive ? 'activated' : 'deactivated'}.`, { user: user.toSafeObject() });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['super_admin', 'admin', 'pastor', 'secretary', 'treasurer', 'finance_officer', 'ministry_leader', 'volunteer', 'member'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true })
      .select('-password -refreshTokens');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    return successResponse(res, 'User role updated.', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, toggleUserStatus, updateUserRole };
