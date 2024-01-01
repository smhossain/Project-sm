const mongoose = require('mongoose')

const audioMetaDataSchema = mongoose.Schema(
  {
    surah: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Surah',
      required: true
    },
    partNumber: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    artist: {
      type: String,
      required: false
    },
    thumbnail: {
      type: String,
      required: false
    },
    duration: {
      type: Number, // Duration in seconds
      required: true
    },
    tafseers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tafseer' }]
  },
  {
    timestamps: true
  }
)

// Compound index for surah and partNumber
audioMetaDataSchema.index({ surah: 1, partNumber: 1 }, { unique: true })

module.exports = mongoose.model('AudioMetaData', audioMetaDataSchema)
