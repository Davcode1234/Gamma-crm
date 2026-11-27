import mongoose from 'mongoose';

// One document per counter, e.g. { _id: 'MK-2611', seq: 14 }.
// The counter name is the _id, so MongoDB guarantees that each name
// exists only once.
export const CounterModel = mongoose.model(
  'Counter',
  new mongoose.Schema(
    {
      _id: {
        type: String,
        required: true,
      },
      seq: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    { versionKey: false },
  ),
);
