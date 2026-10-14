import mongoose from 'mongoose';

export const ReckoningTaskModel = mongoose.model(
  'ReckoningTask',
  new mongoose.Schema({
    searchID: {
      type: Number,
    },
    idOfAssignedStudioTask: {
      type: String,
    },
    client: {
      type: String,
    },
    clientPerson: {
      type: String,
    },
    title: {
      type: String,
    },

    description: {
      type: String,
    },

    comment: {
      type: String,
    },

    isSettled: Boolean,

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

    printWhat: {
      type: String,
    },

    printWhere: {
      type: String,
    },

    participants: [
      {
        _id: {
          type: String,
        },
        isVisible: {
          type: Boolean,
        },
        name: {
          type: String,
        },
        lastname: {
          type: String,
        },
        img: {
          type: String,
        },

        months: [
          {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            hours: [
              {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                hourNum: Number,
                isWeekend: Boolean,
                dayIndex: Number,
              },
            ],
            createdAt: {
              type: Date,
            },
            addedToRecko: {
              type: Date,
            },
            comment: {
              type: String,
            },
          },
        ],
      },
    ],

    startDate: {
      type: Date,
      required: true,
    },
    // deadline: {
    //   type: String,
    // },
  }),
);
