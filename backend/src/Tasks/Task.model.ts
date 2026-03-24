import mongoose from 'mongoose';

export const TaskModel = mongoose.model(
  'Task',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
      // required: true,
    },
    client: {
      type: String,
    },
    path: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
    priority: {
      type: String,
      enum: ['200', '400', '600', '800', '1000'],
    },
    subtasks: [
      {
        content: { type: String },
      },
    ],

    status: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    participants: {
      type: Array,
    },
  }),
);
