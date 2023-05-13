import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 5,
      max: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 20,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    city: String,
    state: String,
    country: String,
    occupation: String,
    phoneNumber: String,
    transactions: Array,
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'admin',
    },
  },
  { timestamps: true }
);

const User = model('User', UserSchema);
export default User;
