import asyncHandler from 'express-async-handler';
import OverallStat from '../models/OverallStat.js';

// @desc    Get sales
// @route   GET /sales/sales
// @access  Public
export const getSales = asyncHandler(async (req, res) => {
  const overallStat = await OverallStat.find();
  if (overallStat) {
    res.status(200).json(overallStat[0]);
  } else {
    res.status(404);
    throw new Error('OverallStat not found');
  }
});
