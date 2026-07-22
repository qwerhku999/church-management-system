const memberService = require('../services/memberService');
const { successResponse, errorResponse, paginatedResponse } = require('../utils/helpers');

const getMembers = async (req, res, next) => {
  try {
    const { members, pagination } = await memberService.getMembers(req.query);
    return paginatedResponse(res, 'Members retrieved successfully.', members, pagination);
  } catch (error) {
    next(error);
  }
};

const getMember = async (req, res, next) => {
  try {
    const member = await memberService.getMemberById(req.params.id);
    return successResponse(res, 'Member retrieved successfully.', { member });
  } catch (error) {
    next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.avatar = `/uploads/images/${req.file.filename}`;
    }
    const member = await memberService.createMember(req.body, req.user._id);
    return successResponse(res, 'Member created successfully.', { member }, 201);
  } catch (error) {
    next(error);
  }
};

const updateMember = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.avatar = `/uploads/images/${req.file.filename}`;
    }
    const member = await memberService.updateMember(req.params.id, req.body);
    return successResponse(res, 'Member updated successfully.', { member });
  } catch (error) {
    next(error);
  }
};

const deleteMember = async (req, res, next) => {
  try {
    await memberService.deleteMember(req.params.id);
    return successResponse(res, 'Member deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const getMemberStats = async (req, res, next) => {
  try {
    const stats = await memberService.getMemberStats();
    return successResponse(res, 'Member statistics retrieved.', { stats });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMembers, getMember, createMember, updateMember, deleteMember, getMemberStats };
