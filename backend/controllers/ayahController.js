const asyncHandler = require('express-async-handler')
const Ayah = require('../models/ayahModel')
const Surah = require('../models/surahModel')

// @desc    Add an Ayah or array of Ayahs for a Surah
// @route   POST /api/surahs/:surahId/ayahs
// @access  private
const addAyah = asyncHandler(async (req, res) => {
  // Handle multiple Ayahs insertion
  if (Array.isArray(req.body)) {
    // Check if Surah exists (assuming all Ayahs belong to the same Surah)
    const surahId = req.body[0]?.surah
    const surahExists = await Surah.findById(surahId)
    if (!surahExists) {
      return res.status(404).json({ message: 'Surah not found' })
    }

    // Validate and prepare ayahs for insertion
    const ayahsToInsert = req.body.filter(
      (item) => item.text && item.ayahNo && item.surah && item.surahName
    )

    // Check for existing Ayahs
    const existingAyahNumbers = new Set(
      (
        await Ayah.find({
          surah: surahId,
          ayahNo: { $in: ayahsToInsert.map((item) => item.ayahNo) }
        })
      ).map((ayah) => ayah.ayahNo)
    )

    // Filter out existing Ayahs
    const newAyahs = ayahsToInsert.filter(
      (item) => !existingAyahNumbers.has(item.ayahNo)
    )

    // Insert new Ayahs
    if (newAyahs.length > 0) {
      const insertedAyahs = await Ayah.insertMany(newAyahs)
      return res.status(201).json({ results: insertedAyahs })
    } else {
      return res.status(200).json({ message: 'No new Ayahs to add' })
    }
  }
  // Handle single Ayah insertion
  else {
    const { text, ayahNo, surah, surahName } = req.body

    if (!text || !ayahNo || !surah || !surahName) {
      return res.status(400).json({ message: 'Please include all fields' })
    }

    // Check if Ayah exists
    const ayahExists = await Ayah.findOne({ text, surah })
    if (ayahExists) {
      return res.status(400).json({ message: 'Ayah already exists' })
    }

    // Check if Surah exists
    const surahExists = await Surah.findById(surah)
    if (!surahExists) {
      return res.status(401).json({ message: 'Surah not found' })
    }

    const ayah = await Ayah.create({
      text,
      ayahNo,
      surah,
      surahName
    })

    if (ayah) {
      return res.status(201).json(ayah)
    } else {
      return res.status(400).json({ message: 'Invalid Ayah data' })
    }
  }
})

// @desc    Get the Ayahs for a Surah with no tafseer associated
// @route   GET /api/surahs/:surahId/ayahs/no/tafseer
// @access  public
const getNoTafseerAyahs = asyncHandler(async (req, res) => {
  const ayahs = await Ayah.find({
    surah: req.params.surahId,
    isTafseerAssociated: false
  }).sort('ayahNo')

  const count = ayahs.length

  if (count === 0) {
    return res.status(200).json({
      message: 'No Ayah Available to use',
      results: [],
      count: 0
    })
  }

  res.status(200).json({
    results: ayahs,
    count: count
  })
})

// @desc    Get an Ayah for a Surah
// @route   GET /api/surahs/:surahId/ayahs/:ayahId
// @access  public
const getAyah = asyncHandler(async (req, res) => {
  const ayah = await Ayah.findById(req.params.ayahId)

  if (!ayah) {
    res.status(404)
    throw new Error('No Ayah found')
  }

  res.status(200).json(ayah)
})

// @desc    Get Ayahs with IDs in req.query
// @route   GET /api/surahs/:surahId/ayahs/multi
// @access  public
const getMultipleAyahs = asyncHandler(async (req, res) => {
  const ayahs = await Ayah.find({ _id: { $in: req.query } }).sort('ayahNo')

  // Check if the array is empty
  if (ayahs.length === 0) {
    return res.status(200).json({ message: 'No Ayahs found', ayahs: [] })
  }

  res.status(200).json(ayahs)
})

// @desc    Get Ayahs of a Surah
// @route   GET /api/surahs/:surahId/ayahs
// @access  public
const getAyahsOfSurah = asyncHandler(async (req, res) => {
  const surah = await Surah.findById(req.params.surahId)

  if (!surah) {
    res.status(404)
    throw new Error('No Surah found')
  }

  // Validate and parse the 'page' parameter
  const page = parseInt(req.query.page)
  if (isNaN(page) || page < 1) {
    res.status(400).json({ error: 'Invalid page parameter' })
    return
  }

  // Validate and parse the 'limit' parameter
  const limit = parseInt(req.query.limit)
  if (isNaN(limit) || limit < 1) {
    res.status(400).json({ error: 'Invalid limit parameter' })
    return
  }

  const results = {}

  if (page && limit) {
    // with pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const count = await Ayah.countDocuments({
      surah: req.params.surahId
    }).exec()

    results.count = count
    results.pageCount = Math.ceil(count / limit)

    // if (count === 0) {
    //   res.status(404)
    //   throw new Error('No Ayahs found')
    // }

    if (endIndex < count) {
      results.next = {
        page: page + 1,
        limit: limit
      }
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      }
    }

    // Changes here: Handle empty results
    const ayahs = await Ayah.find({ surah: req.params.surahId })
      .sort('ayahNo')
      .limit(limit)
      .skip(startIndex)
      .exec()

    if (ayahs.length === 0) {
      return res.status(200).json({
        message: 'No Ayahs found for the specified Surah',
        results: [],
        count: 0
      })
    } else {
      results.results = ayahs
    }

    res.status(200).json(results)
  } else {
    // with no pagination
    const ayahs = await Ayah.find({ surah: req.params.surahId }).sort('ayahNo')

    if (ayahs.length === 0) {
      results.results = [] // Empty array
      res.status(200).json(results)
      return
    }

    results.results = ayahs
    res.status(200).json(results)
  }
})

// @desc    Update an Ayah
// @route   PUT /api/surahs/:surahId/ayahs/:ayahId
// @access  private
const updateAyah = asyncHandler(async (req, res) => {
  const ayah = await Ayah.findById(req.params.ayahId)

  if (!req.body.text || !req.body.ayahNo) {
    return res.status(400).json({ message: 'Required fields are missing' })
  }

  if (!ayah) {
    res.status(404)
    throw new Error('No Ayah found')
  }

  const updatedAyah = await Ayah.findByIdAndUpdate(
    req.params.ayahId,
    req.body,
    { new: true }
  )

  res.status(200).json(updatedAyah)
})

// @desc    Update Multiple Ayahs
// @route   PUT /api/surahs/:surahId/ayahs/multi
// @access  private
const updateAyahsMulti = asyncHandler(async (req, res) => {
  const ids = req.body.map(({ _id }) => {
    return { _id }
  })

  const update = req.body[0].isTafseerAssociated

  const results = await Ayah.updateMany(
    { _id: { $in: ids } },
    { isTafseerAssociated: update }
  )
  res.status(201).json(results)
})

// @desc    Delete an Ayah
// @route   DELETE /api/surahs/:surahId/ayahs/:ayahId
// @access  private
const deleteAyah = asyncHandler(async (req, res) => {
  const ayah = await Ayah.findById(req.params.ayahId)

  if (!ayah) {
    res.status(404)
    throw new Error('No Ayah found')
  }

  await Ayah.findByIdAndDelete(req.params.ayahId)

  res.status(200).json({ _id: req.params.ayahId })
})

// @desc    Delete Ayahs of a Surah
// @route   DELETE /api/surahs/:surahId/ayahs/
// @access  private
const deleteAyahsOfSurah = asyncHandler(async (req, res) => {
  const result = await Ayah.deleteMany({ surah: req.params.surahId })

  res.send(result)
})

module.exports = {
  addAyah,
  getAyah,
  getAyahsOfSurah,
  getMultipleAyahs,
  getNoTafseerAyahs,
  updateAyah,
  updateAyahsMulti,
  deleteAyah,
  deleteAyahsOfSurah
}
