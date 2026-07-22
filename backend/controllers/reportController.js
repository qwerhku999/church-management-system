const Member = require('../models/Member');
const Donation = require('../models/Donation');
const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const Finance = require('../models/Finance');
const Visitor = require('../models/Visitor');
const { successResponse } = require('../utils/helpers');

const getMemberReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [
      total,
      byStatus,
      byGender,
      byMaritalStatus,
      growthByMonth,
      byMinistry,
    ] = await Promise.all([
      Member.countDocuments(filter),
      Member.aggregate([{ $match: filter }, { $group: { _id: '$membershipStatus', count: { $sum: 1 } } }]),
      Member.aggregate([{ $match: filter }, { $group: { _id: '$gender', count: { $sum: 1 } } }]),
      Member.aggregate([{ $match: filter }, { $group: { _id: '$maritalStatus', count: { $sum: 1 } } }]),
      Member.aggregate([
        { $match: filter },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Member.aggregate([
        { $unwind: '$ministries' },
        { $group: { _id: '$ministries', count: { $sum: 1 } } },
        { $lookup: { from: 'ministries', localField: '_id', foreignField: '_id', as: 'ministry' } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    return successResponse(res, 'Member report generated.', {
      report: { total, byStatus, byGender, byMaritalStatus, growthByMonth, byMinistry },
    });
  } catch (error) {
    next(error);
  }
};

const getDonationReport = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = 'month' } = req.query;
    const filter = { status: 'completed' };
    if (startDate || endDate) {
      filter.donationDate = {};
      if (startDate) filter.donationDate.$gte = new Date(startDate);
      if (endDate) filter.donationDate.$lte = new Date(endDate);
    }

    const [byCategory, byMethod, byMonth, topDonors, total] = await Promise.all([
      Donation.aggregate([
        { $match: filter },
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Donation.aggregate([
        { $match: filter },
        { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      ]),
      Donation.aggregate([
        { $match: filter },
        {
          $group: {
            _id: { year: { $year: '$donationDate' }, month: { $month: '$donationDate' } },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Donation.aggregate([
        { $match: { ...filter, isAnonymous: false } },
        { $group: { _id: '$donor', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'members', localField: '_id', foreignField: '_id', as: 'donor' } },
      ]),
      Donation.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 }, avg: { $avg: '$amount' } } },
      ]),
    ]);

    return successResponse(res, 'Donation report generated.', {
      report: { byCategory, byMethod, byMonth, topDonors, total: total[0] || { total: 0, count: 0, avg: 0 } },
    });
  } catch (error) {
    next(error);
  }
};

const getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const [byServiceType, trend, averages] = await Promise.all([
      Attendance.aggregate([
        { $match: filter },
        { $group: { _id: '$serviceType', avgCount: { $avg: '$totalCount' }, maxCount: { $max: '$totalCount' }, sessions: { $sum: 1 } } },
      ]),
      Attendance.find(filter).sort({ date: 1 }).select('date totalCount memberCount visitorCount serviceType'),
      Attendance.aggregate([
        { $match: filter },
        { $group: { _id: null, avgTotal: { $avg: '$totalCount' }, avgMembers: { $avg: '$memberCount' }, avgVisitors: { $avg: '$visitorCount' } } },
      ]),
    ]);

    return successResponse(res, 'Attendance report generated.', {
      report: { byServiceType, trend, averages: averages[0] || {} },
    });
  } catch (error) {
    next(error);
  }
};

const getFinanceReport = async (req, res, next) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const [incomeByCategory, expenseByCategory, monthlyFlow, accountBalances] = await Promise.all([
      Finance.aggregate([
        { $match: { type: 'income', date: { $gte: startOfYear } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
      ]),
      Finance.aggregate([
        { $match: { type: 'expense', date: { $gte: startOfYear } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } },
      ]),
      Finance.aggregate([
        { $match: { date: { $gte: startOfYear } } },
        {
          $group: {
            _id: { month: { $month: '$date' }, type: '$type' },
            total: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.month': 1 } },
      ]),
      Finance.aggregate([
        { $group: { _id: '$account', income: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } }, expenses: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } } } },
      ]),
    ]);

    return successResponse(res, 'Finance report generated.', {
      report: { incomeByCategory, expenseByCategory, monthlyFlow, accountBalances },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMemberReport, getDonationReport, getAttendanceReport, getFinanceReport };
