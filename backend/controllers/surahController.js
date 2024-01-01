const asyncHandler = require('express-async-handler')
const Surah = require('../models/surahModel')
const Ayah = require('../models/ayahModel')
const Tafseer = require('../models/tafseerModel')

// @desc    Add a Surah
// @route   POST /api/surahs
// @access  private
const addSurah = asyncHandler(async (req, res) => {
  const { name, section, noOfAyahs, number, about } = req.body

  if (!name || !section || !noOfAyahs || !number) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if Surah exists
  const surahExists = await Surah.findOne({ name })
  if (surahExists) {
    res.status(400)
    throw new Error('Surah already exists')
  }

  const surah = await Surah.create({
    name,
    section,
    noOfAyahs,
    number,
    about
  })

  if (surah) {
    res.status(201).json(surah)
  } else {
    res.status(400)
    throw new Error('Invalid Surah data')
  }
})

// @desc    Get a Surah
// @route   GET /api/surahs/:surahId
// @access  public
const getSurah = asyncHandler(async (req, res) => {
  const surah = await Surah.findById(req.params.surahId)

  if (!surah) {
    res.status(401)
    throw new Error('No Surah found')
  }

  res.status(200).json(surah)
})

// @desc    Get the name of a Surah
// @route   GET /api/surahs/name/:surahId
// @access  public
const getSurahName = asyncHandler(async (req, res) => {
  const { name } = await Surah.findById(req.params.surahId)

  if (!name) {
    res.status(401)
    throw new Error('No Surah found')
  }

  res.status(200).json({ name: name })
})

// @desc    Get a group of Surahs with _id
// @route   POST /api/surahs/tsurah
// @access  public
const getSurahs = asyncHandler(async (req, res) => {
  const surahs = await Surah.find({ _id: { $in: req.body } }).sort({
    number: 1,
    section: 1
  })

  if (!surahs) {
    res.status(401)
    throw new Error('No Surah found')
  }

  res.status(200).json(surahs)
})

// @desc    Get all Surahs
// @route   GET /api/surahs/
// @access  public
const getAllSurahs = asyncHandler(async (req, res) => {
  const surahs = await Surah.find({}).sort({ number: 1 })

  if (!surahs) {
    res.status(401)
    throw new Error('No Surah found')
  }

  res.status(200).json(surahs)
})

// @desc    Update a Surah
// @route   PUT /api/surahs/:surahId/
// @access  private
const updateSurah = asyncHandler(async (req, res) => {
  const surah = await Surah.findById(req.params.surahId)

  if (!surah) {
    res.status(404)
    throw new Error('No surah found')
  }

  const updatedSurah = await Surah.findByIdAndUpdate(
    req.params.surahId,
    req.body,
    { new: true }
  )

  res.status(200).json(updatedSurah)
})

// @desc    Delete a Surah
// @route   DELETE /api/surahs/:surahId/
// @access  private
const deleteSurah = asyncHandler(async (req, res) => {
  const surahId = req.params.surahId
  const surah = await Surah.findById(surahId)

  if (!surah) {
    res.status(404)
    throw new Error('No surah found')
  }

  // Delete associated Ayahs
  const ayahDeleteResult = await Ayah.deleteMany({ surah: surahId })
  if (!ayahDeleteResult) {
    res.status(500)
    throw new Error('Error deleting associated Ayahs')
  }

  // Delete associated Tafseers
  const tafseerDeleteResult = await Tafseer.deleteMany({ surah: surahId })
  if (!tafseerDeleteResult) {
    res.status(500)
    throw new Error('Error deleting associated Tafseers')
  }

  // Finally, delete the Surah
  await Surah.findByIdAndDelete(surahId)

  res.status(200).json({ _id: surahId })
})

module.exports = {
  addSurah,
  getSurah,
  getSurahName,
  getSurahs,
  getAllSurahs,
  updateSurah,
  deleteSurah
}
