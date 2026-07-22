const Finance = require('../models/Finance');
const { successResponse, paginatedResponse, getPaginationParams, getSortParams } = require('../utils/helpers');

const getTransactions = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    const filter = {};

    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.account) filter.account = req.query.account;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.ministry) filter.ministry = req.query.ministry;
    if (req.query.startDate || req.query.endDate) {
      filter.date = {};
      if (req.query.startDate) filter.date.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.date.$lte = new Date(req.query.endDate);
    }

    const [transactions, total] = await Promise.all([
      Finance.find(filter)
        .populate('createdBy', 'firstName lastName')
        .populate('approvedBy', 'firstName lastName')
        .populate('ministry', 'name')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      Finance.countDocuments(filter),
    ]);

    const summary = await Finance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully.',
      data: transactions,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
      summary,
    });
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Finance.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('approvedBy', 'firstName lastName')
      .populate('ministry', 'name');
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    return successResponse(res, 'Transaction retrieved.', { transaction });
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    if (req.file) req.body.receiptUrl = `/uploads/files/${req.file.filename}`;
    const transaction = await Finance.create({ ...req.body, createdBy: req.user._id });
    return successResponse(res, 'Transaction created successfully.', { transaction }, 201);
  } catch (error) {
    next(error);
  }
};

const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Finance.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    return successResponse(res, 'Transaction updated successfully.', { transaction });
  } catch (error) {
    next(error);
  }
};

const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Finance.findByIdAndDelete(req.params.id);
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    return successResponse(res, 'Transaction deleted successfully.');
  } catch (error) {
    next(error);
  }
};

const approveTransaction = async (req, res, next) => {
  try {
    const transaction = await Finance.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user._id, approvedAt: new Date() },
      { new: true }
    );
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found.' });
    return successResponse(res, 'Transaction approved.', { transaction });
  } catch (error) {
    next(error);
  }
};

const getFinancialSummary = async (req, res, next) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const [income, expenses, byAccount, monthlyBreakdown] = await Promise.all([
      Finance.aggregate([
        { $match: { type: 'income', date: { $gte: startOfYear }, status: { $ne: 'rejected' } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Finance.aggregate([
        { $match: { type: 'expense', date: { $gte: startOfYear }, status: { $ne: 'rejected' } } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Finance.aggregate([
        { $match: { date: { $gte: startOfYear } } },
        { $group: { _id: { account: '$account', type: '$type' }, total: { $sum: '$amount' } } },
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
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpenses = expenses[0]?.total || 0;

    return successResponse(res, 'Financial summary retrieved.', {
      summary: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        byAccount,
        monthlyBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTransactions, getTransaction, createTransaction, updateTransaction, deleteTransaction, approveTransaction, getFinancialSummary };
