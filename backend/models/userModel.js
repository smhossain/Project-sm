const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name']
    },
    email: {
      type: String,
      required: [true, 'Please add a valid email address'],
      unique: [true, 'The email address already exists']
    },
    password: {
      type: String,
      required: [true, 'Please add a password']
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    profilePicture: {
      type: String,
      default: '' // Default to an empty string or a path to a default image
    },
    lastLogin: {
      type: Date,
      default: Date.now
    },
    loginHistory: [
      {
        loginAt: {
          type: Date,
          default: Date.now
        },
        loginIP: String
      }
    ],
    queriesAsked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Query'
      }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)
