import dotenv from 'dotenv';
import colors from 'colors';
import {
  dataProduct,
  dataProductStat,
  dataTransaction,
  dataOverallStat,
  dataAffiliateStat,
  dataUser,
} from './data/index.js';
import User from './models/User.js';
import Product from './models/Product.js';
import ProductStat from './models/ProductStat.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await ProductStat.deleteMany();
    await Transaction.deleteMany();
    await OverallStat.deleteMany();
    await AffiliateStat.deleteMany();

    await User.insertMany(dataUser);
    await Product.insertMany(dataProduct);
    await ProductStat.insertMany(dataProductStat);
    await Transaction.insertMany(dataTransaction);
    await OverallStat.insertMany(dataOverallStat);
    await AffiliateStat.insertMany(dataAffiliateStat);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await ProductStat.deleteMany();
    await Transaction.deleteMany();
    await OverallStat.deleteMany();
    await AffiliateStat.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
