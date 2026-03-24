import mongoose from 'mongoose';

export const ClientModel = mongoose.model(
  'Client',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    notes: [
      {
        text: {
          type: String,
        },
        date: {
          type: Date,
        },
        author: {
          type: String,
        },
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      },
    ],
  }),
);
