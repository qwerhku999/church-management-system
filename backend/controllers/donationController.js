const donationService = require('../services/donationService');
const { successResponse, paginatedResponse } = require('../utils/helpers');

const getDonations = async (req, res, next) => {
  try {
    const { donations, pagination, summary } = await donationService.getDonations(req.query);
    return res.status(200).json({
      success: true,
      message: 'Donations retrieved successfully.',
      data: donations,
      pagination,
      summary,
    });
  } catch (error) {
    next(error);
  }
};

const getDonation = async (req, res, next) => {
  try {
    const donation = await donationService.getDonationById(req.params.id);
    return successResponse(res, 'Donation retrieved successfully.', { donation });
  } catch (error) {
    next(error);
  }
};

const createDonation = async (req, res, next) => {
  try {
    const donation = await donationService.createDonation(req.body, req.user._id);
    return successResponse(res, 'Donation recorded successfully.', { donation }, 201);
  } catch (error) {
    next(error);
  }
};

const updateDonation = async (req, res, next) => {
  try {
    const donation = await donationService.updateDonation(req.params.id, req.body);
    return successResponse(res, 'Donation updated successfully.', { donation });
  } catch (error) {
    next(error);
  }
};

const deleteDonation = async (req, res, next) => {
  try {
    await donationService.deleteDonation(req.params.id);
    return successResponse(res, 'Donation deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const getDonationSummary = async (req, res, next) => {
  try {
    const summary = await donationService.getDonationSummary(req.query.period);
    return successResponse(res, 'Donation summary retrieved.', { summary });
  } catch (error) {
    next(error);
  }
};

const getMonthlyTrend = async (req, res, next) => {
  try {
    const months = parseInt(req.query.months) || 12;
    const trend = await donationService.getMonthlyTrend(months);
    return successResponse(res, 'Monthly trend retrieved.', { trend });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDonations, getDonation, createDonation, updateDonation, deleteDonation, getDonationSummary, getMonthlyTrend };
