const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Member:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         membershipStatus:
 *           type: string
 *           enum: [active, inactive, pending, transferred, deceased]
 */
const memberSchema = new mongoose.Schema({
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
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    trim: true,
  },
  alternatePhone: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer_not_to_say'],
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed', 'separated'],
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'US' },
  },
  membershipStatus: {
    type: String,
    enum: ['active', 'inactive', 'pending', 'transferred', 'deceased'],
    default: 'active',
  },
  membershipDate: {
    type: Date,
    default: Date.now,
  },
  membershipType: {
    type: String,
    enum: ['regular', 'associate', 'honorary'],
    default: 'regular',
  },
  memberNumber: {
    type: String,
    unique: true,
    sparse: true,
  },
  baptismDate: {
    type: Date,
  },
  salvationDate: {
    type: Date,
  },
  occupation: {
    type: String,
    trim: true,
  },
  employer: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String,
  },
  ministries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ministry',
  }],
  groups: [{
    type: String,
    trim: true,
  }],
  skills: [{
    type: String,
    trim: true,
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters'],
  },
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  linkedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

memberSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

memberSchema.virtual('age').get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
});

memberSchema.pre('save', async function (next) {
  if (!this.memberNumber) {
    const count = await mongoose.model('Member').countDocuments();
    this.memberNumber = `MF${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

memberSchema.index({ firstName: 1, lastName: 1 });
memberSchema.index({ email: 1 });
memberSchema.index({ membershipStatus: 1 });
memberSchema.index({ memberNumber: 1 });
memberSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Member', memberSchema);
