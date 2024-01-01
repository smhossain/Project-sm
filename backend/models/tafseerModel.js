const mongoose = require('mongoose')

const tafseerSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add a text for tafseer']
    },
    surah: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a valid Surah ID'],
      ref: 'Surah'
    },
    number: {
      type: Number,
      required: [true, 'Please provide a number for the tafseer']
    },
    ayahs: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: 'Ayah'
        },
        ayahNo: {
          type: Number
        },
        text: {
          type: String,
          required: [true, 'Please provide a text for Ayah']
        }
      }
    ],
    references: [
      {
        refNumber: Number,
        text: String
      }
    ],
    audioFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AudioMetadata',
      required: false
    },
    audioStartTime: {
      type: Number
    },
    audioEndTime: {
      type: Number
    },
    isAudioAssociated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

tafseerSchema.index({ surah: 1, number: 1 }, { unique: true })

module.exports = mongoose.model('Tafseer', tafseerSchema)
