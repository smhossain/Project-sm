const mongoose = require('mongoose')

const surahSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a Surah name'],
      unique: [true, 'A Surah with the same name already exists']
    },
    section: [
      {
        type: [Number],
        required: [true, 'Please add the sections that the Surah belongs to']
      }
    ],
    noOfAyahs: {
      type: Number,
      required: [true, 'Please provide the number of Ayahs']
    },
    number: {
      type: Number,
      required: [true, 'Please add the number of Surah']
    },
    about: {
      type: String
    },
    revelationPeriod: {
      type: String,
      required: false
    },
    audioFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AudioMetadata' }]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Surah', surahSchema)
