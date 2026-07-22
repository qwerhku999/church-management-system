const Ministry = require('../models/Ministry');
const { successResponse, paginatedResponse, getPaginationParams, getSortParams, buildSearchFilter } = require('../utils/helpers');

const getMinistries = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const sort = getSortParams(req.query);
    const filter = {};

    if (req.query.search) Object.assign(filter, buildSearchFilter(req.query.search, ['name', 'description']));
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const [ministries, total] = await Promise.all([
      Ministry.find(filter)
        .populate('leader', 'firstName lastName email')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Ministry.countDocuments(filter),
    ]);

    return paginatedResponse(res, 'Ministries retrieved successfully.', ministries, {
      total, page, limit, pages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

const getMinistry = async (req, res, next) => {
  try {
    const ministry = await Ministry.findById(req.params.id)
      .populate('leader', 'firstName lastName email')
      .populate('coLeaders', 'firstName lastName email')
      .populate('members.member', 'firstName lastName email memberNumber');
    if (!ministry) return res.status(404).json({ success: false, message: 'Ministry not found.' });
    return successResponse(res, 'Ministry retrieved successfully.', { ministry });
  } catch (error) {
    next(error);
  }
};

const createMinistry = async (req, res, next) => {
  try {
    if (req.file) req.body.image = `/uploads/images/${req.file.filename}`;
    const ministry = await Ministry.create({ ...req.body, createdBy: req.user._id });
    return successResponse(res, 'Ministry created successfully.', { ministry }, 201);
  } catch (error) {
    next(error);
  }
};

const updateMinistry = async (req, res, next) => {
  try {
    if (req.file) req.body.image = `/uploads/images/${req.file.filename}`;
    const ministry = await Ministry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ministry) return res.status(404).json({ success: false, message: 'Ministry not found.' });
    return successResponse(res, 'Ministry updated successfully.', { ministry });
  } catch (error) {
    next(error);
  }
};

const deleteMinistry = async (req, res, next) => {
  try {
    const ministry = await Ministry.findByIdAndDelete(req.params.id);
    if (!ministry) return res.status(404).json({ success: false, message: 'Ministry not found.' });
    return successResponse(res, 'Ministry deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const addMember = async (req, res, next) => {
  try {
    const { memberId, role } = req.body;
    const ministry = await Ministry.findById(req.params.id);
    if (!ministry) return res.status(404).json({ success: false, message: 'Ministry not found.' });
    const exists = ministry.members.some((m) => m.member.toString() === memberId);
    if (exists) return res.status(409).json({ success: false, message: 'Member already in ministry.' });
    ministry.members.push({ member: memberId, role: role || 'member' });
    await ministry.save();
    return successResponse(res, 'Member added to ministry.', { ministry });
  } catch (error) {
    next(error);
  }
};

const removeMember = async (req, res, next) => {
  try {
    const ministry = await Ministry.findById(req.params.id);
    if (!ministry) return res.status(404).json({ success: false, message: 'Ministry not found.' });
    ministry.members = ministry.members.filter((m) => m.member.toString() !== req.params.memberId);
    await ministry.save();
    return successResponse(res, 'Member removed from ministry.', { ministry });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMinistries, getMinistry, createMinistry, updateMinistry, deleteMinistry, addMember, removeMember };
