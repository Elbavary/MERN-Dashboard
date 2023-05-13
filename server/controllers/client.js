import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import ProductStat from '../models/ProductStat.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import getCountryISO3 from 'country-iso-2-to-3';

// @desc    Get products
// @route   GET /client/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  if (products) {
    const productsWithStats = await Promise.all(
      products.map(async product => {
        const stat = await ProductStat.find({ productId: product._id });
        return { ...product._doc, stat };
      })
    );
    res.status(200).json(productsWithStats);
  } else {
    res.status(404);
    throw new Error('Products not found');
  }
});

// @desc    Get customers
// @route   GET /client/customers
// @access  Public
export const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'user' }).select('-password');
  if (customers) {
    res.status(200).json(customers);
  } else {
    res.status(404);
    throw new Error('Customers not found');
  }
});

// @desc    Get transactions
// @route   GET /client/transactions
// @access  Public
export const getTransactions = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 20, sort = null, search = '' } = req.query;
  const generateSort = () => {
    const sortParsed = JSON.parse(sort);
    const sortFormatted = {
      [sortParsed.field]: (sortParsed.sort = 'asc' ? 1 : -1),
    };
    return sortFormatted;
  };

  const sortFormatted = Boolean(sort) ? generateSort() : {};

  const transactions = await Transaction.find({
    $or: [
      { cost: { $regex: new RegExp(search, 'i') } },
      { userId: { $regex: new RegExp(search, 'i') } },
    ],
  })
    .sort(sortFormatted)
    .skip(page * pageSize)
    .limit(pageSize);

  const total = await Transaction.countDocuments({
    $or: [
      { cost: { $regex: new RegExp(search, 'i') } },
      { userId: { $regex: new RegExp(search, 'i') } },
    ],
  });

  if (transactions) {
    res.status(200).json({
      transactions,
      total,
    });
  } else {
    res.status(404);
    throw new Error('Transactions not found');
  }
});

// @desc    Get geography
// @route   GET /client/geography
// @access  Public
export const getGeography = asyncHandler(async (req, res) => {
  const users = await User.find();

  const mappedLocations = users.reduce((acc, { country }) => {
    const countryISO3 = getCountryISO3(country);
    if (!acc[countryISO3]) {
      acc[countryISO3] = 0;
    }
    acc[countryISO3]++;
    return acc;
  }, {});

  const formattedLocations = Object.entries(mappedLocations).map(
    ([country, count]) => {
      return { id: country, value: count };
    }
  );
  if (formattedLocations) {
    res.status(200).json(formattedLocations);
  } else {
    res.status(404);
    throw new Error('Geography not found');
  }
});
