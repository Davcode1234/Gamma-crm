import mongoose from 'mongoose';

export const CompanyModel = mongoose.model(
  'Company',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    nip: {
      type: String,
    },
    address: {
      type: String,
    },
    website: {
      type: String,
    },
    clientPerson: [
      {
        name: { type: String },
        company: { type: String },
        email: { type: String },
        phone: { type: String },
      },
    ],
    hourRate: String,
    teamMembers: [
      {
        _id: {
          type: String,
        },
        name: {
          type: String,
        },
        lastname: {
          type: String,
        },
        email: {
          type: String,
        },
        phone: {
          type: Number,
        },
        job: {
          type: String,
        },
        img: {
          type: String,
        },
      },
    ],
    keyWords: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    activeTasks: {
      type: Number,
    },
  }),
);
