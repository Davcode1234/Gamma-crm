import mongoose from 'mongoose';

export const StudioTaskModel = mongoose.model(
  'StudioTask',
  new mongoose.Schema({
    searchID: {
      type: Number,
      required: true,
      // unique: true,
    },
    reckoTaskID: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    client: {
      type: String,
      required: true,
    },
    clientPerson: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    author: {
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
      password: {
        type: String,
      },
      job: {
        type: String,
      },
      img: {
        type: String,
      },
    },
    // For Example Druk, Szwalnia, Mulimedia, social media
    taskType: {
      type: String,
    },
    participants: [
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
    description: {
      type: String,
    },
    subtasks: [
      {
        content: { type: String },
        done: { type: Boolean },
        _id: { type: String },
      },
    ],
    startDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
  }),
);
