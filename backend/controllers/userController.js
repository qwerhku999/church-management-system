const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const {
  successResponse,
  paginatedResponse,
  getPaginationParams,
  getSortParams,
  buildSearchFilter,
} = require('../utils/helpers');

const VALID_ROLES = [
  'super_admin',
  'admin',
  'pastor',
  'secretary',
  'treasurer',
  'finance_officer',
  'ministry_leader',
  'volunteer',
  'member',
];

const getUsers = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const sort = getSortParams(req.query);
    const filter = {};

    if (req.query.search) {
      Object.assign(
        filter,
        buildSearchFilter(req.query.search, [
          'firstName',
          'lastName',
          'email',
        ])
      );
    }

    if (req.query.role) filter.role = req.query.role;

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(
          '-password -refreshTokens -passwordResetToken -passwordResetExpires'
        )
        .sort(sort)
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Users retrieved.', users, {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select(
        '-password -refreshTokens -passwordResetToken -passwordResetExpires'
      )
      .populate('linkedMember', 'firstName lastName memberNumber');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return successResponse(res, 'User retrieved.', { user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      email: req.body.email?.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered.',
      });
    }

    const userData = {
      ...req.body,
      email: req.body.email?.toLowerCase(),
    };

    /*
     * Only Super Admin can choose an elevated role
     * during account creation.
     *
     * Admin-created accounts default to member.
     */
    if (req.user.role !== 'super_admin') {
      userData.role = 'member';
    }

    if (!VALID_ROLES.includes(userData.role)) {
      userData.role = 'member';
    }

    const user = await User.create(userData);

    await AuditLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'CREATE',
      resource: 'user',
      resourceId: user._id.toString(),
      description: `Created user account for ${user.email}`,
      changes: {
        after: {
          role: user.role,
          isActive: user.isActive,
        },
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return successResponse(
      res,
      'User created successfully.',
      { user: user.toSafeObject() },
      201
    );
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    /*
     * Role changes must ONLY happen through PATCH /:id/role.
     * This prevents someone from bypassing role protection
     * through PUT /:id.
     */
    delete req.body.role;
    delete req.body.password;
    delete req.body.refreshTokens;
    delete req.body.passwordResetToken;
    delete req.body.passwordResetExpires;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).select(
      '-password -refreshTokens -passwordResetToken -passwordResetExpires'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    return successResponse(res, 'User updated.', { user });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account.',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    /*
     * Never allow the last Super Admin to be deleted.
     */
    if (user.role === 'super_admin') {
      const superAdminCount = await User.countDocuments({
        role: 'super_admin',
        isActive: true,
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last active Super Admin.',
        });
      }
    }

    await User.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'DELETE',
      resource: 'user',
      resourceId: user._id.toString(),
      description: `Deleted user account ${user.email}`,
      changes: {
        before: {
          role: user.role,
          isActive: user.isActive,
        },
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return successResponse(res, 'User deleted.');
  } catch (error) {
    next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    /*
     * Never allow the last active Super Admin to be deactivated.
     */
    if (user.role === 'super_admin' && user.isActive) {
      const superAdminCount = await User.countDocuments({
        role: 'super_admin',
        isActive: true,
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'Cannot deactivate the last active Super Admin.',
        });
      }
    }

    const oldStatus = user.isActive;

    user.isActive = !user.isActive;
    await user.save();

    await AuditLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'STATUS_CHANGE',
      resource: 'user',
      resourceId: user._id.toString(),
      description: `User ${user.email} was ${user.isActive ? 'activated' : 'deactivated'
        }`,
      changes: {
        before: {
          isActive: oldStatus,
        },
        after: {
          isActive: user.isActive,
        },
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return successResponse(
      res,
      `User ${user.isActive ? 'activated' : 'deactivated'}.`,
      { user: user.toSafeObject() }
    );
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    /*
     * This is an extra backend safety check.
     * The route will also be protected so only Super Admin
     * can reach this controller.
     */
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only Super Admin can change user roles.',
      });
    }

    const { role } = req.body;

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role.',
      });
    }

    /*
     * Super Admin cannot accidentally remove their own
     * Super Admin privileges.
     */
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role.',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    const previousRole = user.role;

    /*
     * Prevent unnecessary role changes.
     */
    if (previousRole === role) {
      return successResponse(
        res,
        'User already has this role.',
        {
          user: user.toSafeObject(),
        }
      );
    }

    /*
     * Prevent removing the final active Super Admin.
     */
    if (
      previousRole === 'super_admin' &&
      role !== 'super_admin'
    ) {
      const superAdminCount = await User.countDocuments({
        role: 'super_admin',
        isActive: true,
      });

      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message:
            'Cannot remove the role from the last active Super Admin.',
        });
      }
    }

    user.role = role;
    await user.save();

    await AuditLog.create({
      user: req.user._id,
      userEmail: req.user.email,
      userRole: req.user.role,
      action: 'ROLE_CHANGE',
      resource: 'user',
      resourceId: user._id.toString(),
      description: `Changed ${user.email} role from ${previousRole} to ${role}`,
      changes: {
        before: {
          role: previousRole,
        },
        after: {
          role,
        },
      },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      success: true,
    });

    return successResponse(
      res,
      'User role updated successfully.',
      {
        user: user.toSafeObject(),
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  updateUserRole,
};