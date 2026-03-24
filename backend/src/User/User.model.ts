import mongoose from 'mongoose';
const rolesEnum = ['admin', 'grafik', 'marketing'] as const;

export const UserModel = mongoose.model(
  'User',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    job: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    roles: {
      type: [String],
      enum: rolesEnum,
      default: ['grafik'],
      required: true,
    },
  }),
);
