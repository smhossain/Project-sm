const mongoose = require('mongoose')

const querySchema = mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please add a question']
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ],
    mainTag: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag',
      required: true
    },
    answer: {
      type: String
    },
    language: {
      type: String,
      enum: ['ar', 'en'], // Define supported languages
      required: [true, 'Please specify the language']
    },
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    isPublishable: {
      type: Boolean,
      required: [true, 'Please add isPublishable field']
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answerDate: {
      type: Date
    },
    editHistory: [
      {
        editedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        editDate: {
          type: Date
        },
        previousAnswer: {
          type: String
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Query', querySchema)
