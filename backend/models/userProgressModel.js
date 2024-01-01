const mongoose = require('mongoose')

const userProgressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    audioMetadata: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AudioMetadata',
      required: true
    },
    progress: {
      type: Number, // Duration in seconds that the user has listened to
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('UserProgress', userProgressSchema)
