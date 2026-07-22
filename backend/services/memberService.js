const Member = require('../models/Member');
const { getPaginationParams, getSortParams, buildSearchFilter } = require('../utils/helpers');

const getMembers = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const sort = getSortParams(query);

  const filter = {};

  if (query.search) {
    const searchFilter = buildSearchFilter(query.search, ['firstName', 'lastName', 'email', 'phone', 'memberNumber']);
    Object.assign(filter, searchFilter);
  }

  if (query.status) filter.membershipStatus = query.status;
  if (query.gender) filter.gender = query.gender;
  if (query.ministry) filter.ministries = query.ministry;
  if (query.maritalStatus) filter.maritalStatus = query.maritalStatus;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const [members, total] = await Promise.all([
    Member.find(filter)
      .populate('ministries', 'name')
      .populate('addedBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Member.countDocuments(filter),
  ]);

  return {
    members,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getMemberById = async (id) => {
  const member = await Member.findById(id)
    .populate('ministries', 'name category')
    .populate('addedBy', 'firstName lastName email')
    .populate('linkedUser', 'firstName lastName email role');
  if (!member) {
    const error = new Error('Member not found.');
    error.statusCode = 404;
    throw error;
  }
  return member;
};

const createMember = async (memberData, userId) => {
  const member = await Member.create({ ...memberData, addedBy: userId });
  return member;
};

const updateMember = async (id, updateData) => {
  const member = await Member.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('ministries', 'name');
  if (!member) {
    const error = new Error('Member not found.');
    error.statusCode = 404;
    throw error;
  }
  return member;
};

const deleteMember = async (id) => {
  const member = await Member.findByIdAndDelete(id);
  if (!member) {
    const error = new Error('Member not found.');
    error.statusCode = 404;
    throw error;
  }
  return member;
};

const getMemberStats = async () => {
  const [total, active, inactive, pending, newThisMonth] = await Promise.all([
    Member.countDocuments(),
    Member.countDocuments({ membershipStatus: 'active' }),
    Member.countDocuments({ membershipStatus: 'inactive' }),
    Member.countDocuments({ membershipStatus: 'pending' }),
    Member.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
    }),
  ]);

  const genderDistribution = await Member.aggregate([
    { $group: { _id: '$gender', count: { $sum: 1 } } },
  ]);

  return { total, active, inactive, pending, newThisMonth, genderDistribution };
};

module.exports = { getMembers, getMemberById, createMember, updateMember, deleteMember, getMemberStats };
