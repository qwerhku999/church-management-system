const Member = require('../models/Member');
const Visitor = require('../models/Visitor');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');
const PrayerRequest = require('../models/PrayerRequest');
const Ministry = require('../models/Ministry');
const Finance = require('../models/Finance');

const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalMembers,
    activeMembers,
    newMembersThisMonth,
    totalVisitors,
    newVisitorsThisMonth,
    totalDonationsMonth,
    totalDonationsLastMonth,
    upcomingEvents,
    activePrayerRequests,
    activeMinistries,
    recentDonations,
    attendanceTrend,
    donationTrend,
    memberGrowth,
  ] = await Promise.all([
    Member.countDocuments(),
    Member.countDocuments({ membershipStatus: 'active' }),
    Member.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Visitor.countDocuments(),
    Visitor.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Donation.aggregate([
      { $match: { donationDate: { $gte: startOfMonth }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Donation.aggregate([
      { $match: { donationDate: { $gte: lastMonth, $lte: endOfLastMonth }, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Event.find({ startDate: { $gte: now }, status: 'published' })
      .sort({ startDate: 1 })
      .limit(5)
      .populate('organizer', 'firstName lastName')
      .lean(),
    PrayerRequest.countDocuments({ status: { $in: ['pending', 'active'] } }),
    Ministry.countDocuments({ status: 'active' }),
    Donation.find({ status: 'completed' })
      .sort({ donationDate: -1 })
      .limit(5)
      .populate('donor', 'firstName lastName')
      .lean(),
    Attendance.aggregate([
      { $match: { date: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, week: { $week: '$date' } },
          avgAttendance: { $avg: '$totalCount' },
          totalCount: { $sum: '$totalCount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
      { $limit: 12 },
    ]),
    Donation.aggregate([
      { $match: { donationDate: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }, status: 'completed' } },
      {
        $group: {
          _id: { year: { $year: '$donationDate' }, month: { $month: '$donationDate' } },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Member.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]),
  ]);

  const thisMonthDonations = totalDonationsMonth[0]?.total || 0;
  const lastMonthDonations = totalDonationsLastMonth[0]?.total || 0;
  const donationGrowth = lastMonthDonations > 0
    ? ((thisMonthDonations - lastMonthDonations) / lastMonthDonations) * 100
    : 0;

  return {
    stats: {
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      totalVisitors,
      newVisitorsThisMonth,
      donationsThisMonth: thisMonthDonations,
      donationGrowth: donationGrowth.toFixed(1),
      upcomingEventsCount: upcomingEvents.length,
      activePrayerRequests,
      activeMinistries,
    },
    upcomingEvents,
    recentDonations,
    charts: {
      attendanceTrend,
      donationTrend,
      memberGrowth,
    },
  };
};

module.exports = { getDashboardStats };
