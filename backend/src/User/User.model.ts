import mongoose from 'mongoose';
const rolesEnum = ['admin', 'grafik', 'marketing', 'client'] as const;

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
    color: {
      type: String,
      match: [/^#[0-9a-fA-F]{6}$/, 'Color must be a hex value like #1D4ED8'],
    },
    roles: {
      type: [String],
      enum: rolesEnum,
      default: ['grafik'],
      required: true,
    },
    // Only for the 'client' role: _id of the company the client belongs to.
    company: {
      type: String,
    },
  }),
);
