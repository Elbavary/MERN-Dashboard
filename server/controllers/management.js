import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

// @desc    Get admins
// @route   GET /management/admins
// @access  Public
export const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: 'admin' }).select('-password');
  if (admins) {
    res.status(200).json(admins);
  } else {
    res.status(404);
    throw new Error('Admins not found');
  }
});

// @desc    Get user performance
// @route   GET /management/performance/:id
// @access  Public
export const getUserPerformance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const userWithStats = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: 'affiliatestats',
        localField: '_id',
        foreignField: 'userId',
        as: 'affiliateStats',
      },
    },
    { $unwind: '$affiliateStats' },
  ]);

  const salesTransactions = await Promise.all(
    userWithStats[0].affiliateStats.affiliateSales.map(id => {
      return Transaction.findById(id);
    })
  );

  const filteredSalesTransactions = salesTransactions.filter(
    transaction => transaction !== null
  );

  if (userWithStats) {
    res.status(200).json({
      user: userWithStats[0],
      sales: filteredSalesTransactions,
    });
  } else {
    res.status(404);
    throw new Error('User Performance not found');
  }
});
