const mongoose = require('mongoose')

// The schema has text of the ayah, ayah number, surah which is a reference to Surah model, surahName,
// and isTafseerAssociated which is a flag that shows whether this ayah is associated with a tafseer document.

const ayahSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Please add the Ayah text']
    },
    ayahNo: {
      type: Number,
      required: [true, 'Please add the Ayah number']
    },
    surah: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please provide a valid Surah ID'],
      ref: 'Surah'
    },
    surahName: {
      type: String,
      required: [true, 'Please provide Surah name']
    },
    isTafseerAssociated: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

ayahSchema.index({ ayahNo: 1, surah: 1 }, { unique: true })

module.exports = mongoose.model('Ayah', ayahSchema)
