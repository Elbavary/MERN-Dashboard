import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import OverallStat from '../models/OverallStat.js';
import Transaction from '../models/Transaction.js';

// @desc    Get users
// @route   GET /general/users
// @access  Public
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get dashboard information
// @route   GET /general/dashboard
// @access  Public
export const getDashboardStats = asyncHandler(async (req, res) => {
  // hardcoded values depends on the data in my database
  const currentMonth = 'November';
  const currentYear = 2021;
  const currentDay = '2021-11-15';

  /* Recent Transactions */
  const transactions = await Transaction.find()
    .limit(50)
    .sort({ createdOn: -1 });

  /* Overall Stats */
  const overallStat = await OverallStat.find({ year: currentYear });

  const {
    totalCustomers,
    yearlyTotalSoldUnits,
    yearlySalesTotal,
    monthlyData,
    salesByCategory,
  } = overallStat[0];

  const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
    return month === currentMonth;
  });

  const todayStats = overallStat[0].dailyData.find(({ date }) => {
    return date === currentDay;
  });

  res.status(200).json({
    totalCustomers,
    yearlyTotalSoldUnits,
    yearlySalesTotal,
    monthlyData,
    salesByCategory,
    thisMonthStats,
    todayStats,
    transactions,
  });
});
