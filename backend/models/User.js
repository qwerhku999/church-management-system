const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [super_admin, admin, pastor, secretary, treasurer, ministry_leader, member]
 *         isActive:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 */

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: [
        'super_admin',
        'admin',
        'pastor',
        'secretary',
        'treasurer',
        'ministry_leader',
        'member',
      ],
      default: 'member',
    },

    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    refreshTokens: [
      {
        token: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    permissions: [
      {
        type: String,
      },
    ],

    linkedMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// ===============================
// Virtual Fields
// ===============================

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});


// ===============================
// Password Encryption
// ===============================

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});


// ===============================
// Compare Password
// ===============================

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


// ===============================
// Safe User Object
// ===============================

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.refreshTokens;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;

  return obj;
};


// ===============================
// Indexes
// ===============================

// Keep indexes declared in one place only
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });


module.exports = mongoose.model('User', userSchema);