const Donation = require('../models/Donation');
const { getPaginationParams, getSortParams } = require('../utils/helpers');

const getDonations = async (query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const sort = getSortParams(query);

  const filter = {};
  if (query.category) filter.category = query.category;
  if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;
  if (query.status) filter.status = query.status;
  if (query.donor) filter.donor = query.donor;
  if (query.startDate || query.endDate) {
    filter.donationDate = {};
    if (query.startDate) filter.donationDate.$gte = new Date(query.startDate);
    if (query.endDate) filter.donationDate.$lte = new Date(query.endDate);
  }

  const [donations, total] = await Promise.all([
    Donation.find(filter)
      .populate('donor', 'firstName lastName email memberNumber')
      .populate('recordedBy', 'firstName lastName')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Donation.countDocuments(filter),
  ]);

  const totals = await Donation.aggregate([
    { $match: filter },
    { $group: { _id: null, totalAmount: { $sum: '$amount' }, count: { $sum: 1 } } },
  ]);

  return {
    donations,
    pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    summary: totals[0] || { totalAmount: 0, count: 0 },
  };
};

const getDonationById = async (id) => {
  const donation = await Donation.findById(id)
    .populate('donor', 'firstName lastName email memberNumber')
    .populate('recordedBy', 'firstName lastName email')
    .populate('event', 'title startDate');
  if (!donation) {
    const error = new Error('Donation not found.');
    error.statusCode = 404;
    throw error;
  }
  return donation;
};

const createDonation = async (donationData, userId) => {
  const donation = await Donation.create({ ...donationData, recordedBy: userId });
  return donation;
};

const updateDonation = async (id, updateData) => {
  const donation = await Donation.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!donation) {
    const error = new Error('Donation not found.');
    error.statusCode = 404;
    throw error;
  }
  return donation;
};

const deleteDonation = async (id) => {
  const donation = await Donation.findByIdAndDelete(id);
  if (!donation) {
    const error = new Error('Donation not found.');
    error.statusCode = 404;
    throw error;
  }
  return donation;
};

const getDonationSummary = async (period) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const [monthly, yearly, byCategory, byMethod] = await Promise.all([
    Donation.aggregate([
      { $match: { donationDate: { $gte: startOfMonth }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Donation.aggregate([
      { $match: { donationDate: { $gte: startOfYear }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]),
    Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
  ]);

  return {
    monthly: monthly[0] || { total: 0, count: 0 },
    yearly: yearly[0] || { total: 0, count: 0 },
    byCategory,
    byMethod,
  };
};

const getMonthlyTrend = async (months = 12) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return Donation.aggregate([
    { $match: { donationDate: { $gte: startDate }, status: 'completed' } },
    {
      $group: {
        _id: {
          year: { $year: '$donationDate' },
          month: { $month: '$donationDate' },
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
};

module.exports = {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationSummary,
  getMonthlyTrend,
};
