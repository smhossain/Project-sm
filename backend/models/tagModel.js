const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tagSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    language: {
      type: String,
      required: true,
      enum: ['en', 'ar']
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
      default: null
    },
    usageCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag
