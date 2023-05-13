import { set, connect } from 'mongoose';

set('strictQuery', false);

const connectDB = async () => {
  try {
    const connectServer = await connect(process.env.MONGO_URI);

    console.log(
      `MongoDB connected: ${connectServer.connection.host}`.cyan.underline
    );
  } catch (err) {
    console.error(`Error: ${err.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
