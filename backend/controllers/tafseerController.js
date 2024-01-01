const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const Tafseer = require('../models/tafseerModel')
const Ayah = require('../models/ayahModel')

// @desc    Get the available Surahs with Tafseer
// @route   GET /api/tafseers/:surahId
// @access  public
const getSurasWithTafseers = asyncHandler(async (req, res) => {
  const tafseers = await Tafseer.distinct('surah')

  if (!tafseers) {
    res.status(404)
    throw new Error('No Tafseer found')
  }

  res.status(200).json(tafseers)
})

// @desc    Get Tafseer(s) by ID(s)
// @route   POST /api/tafseers/byIds
// @access  Public/Private (depends on your application's needs)
const getTafseersByIds = asyncHandler(async (req, res) => {
  const { ids } = req.body // Extract 'ids' from request body

  // Validate if 'ids' are provided and is an array
  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ message: 'No Tafseer IDs provided or invalid format' })
  }

  // Validate each ID in the array
  for (const id of ids) {
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid Tafseer ID provided' })
    }
  }

  // Find Tafseers by IDs
  const tafseers = await Tafseer.find({ _id: { $in: ids } })

  // Check if Tafseers were found
  if (!tafseers || tafseers.length === 0) {
    return res.status(404).json({ message: 'No Tafseer found' })
  }

  res.status(200).json(tafseers)
})

// @desc    Get tafseers for a Surah with isAudioAssociated = false
// @route   GET /api/tafseers/:surahId/noaudio
// @access  Public/Private (depends on your application's needs)
const getTafseersWithNoAudioForSurah = asyncHandler(async (req, res) => {
  const surahId = req.params.surahId

  // Count the total tafseers with isAudioAssociated = false for the surah
  const count = await Tafseer.countDocuments({
    surah: surahId,
    isAudioAssociated: false
  })

  // Get the tafseers with isAudioAssociated = false for the surah
  const tafseers = await Tafseer.find({
    surah: surahId,
    isAudioAssociated: false
  }).sort({ number: 1 }) // Sorted by 'number' field

  const results = {
    results: tafseers,
    count: count
  }

  res.status(200).json(results)
})

// @desc    Add a tafseer document
// @route   POST /api/tafseers/
// @access  private
const addTafseer = asyncHandler(async (req, res) => {
  const {
    text,
    surah,
    number,
    ayahs,
    references,
    audioFile,
    audioStartTime,
    audioEndTime
  } = req.body

  if (!text || !surah || !ayahs || !number) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Prepare the data for the new Tafseer with processed text and references
  const newTafseerData = {
    text,
    references,
    surah,
    number,
    ayahs
  }

  // Add optional fields only if they are provided
  if (audioFile) newTafseerData.audioFile = audioFile
  if (audioStartTime) newTafseerData.audioStartTime = audioStartTime
  if (audioEndTime) newTafseerData.audioEndTime = audioEndTime

  // Check if a Tafseer with the same text and surah already exists
  const tafseerExists = await Tafseer.findOne({ text, surah })
  if (tafseerExists) {
    res.status(400)
    throw new Error('Tafseer already exists')
  }

  // Create the Tafseer
  const tafseer = await Tafseer.create(newTafseerData)

  if (tafseer) {
    // Extract ayah IDs from the ayahs array
    const ayahIds = ayahs.map((ayah) => ayah._id)

    // Update Ayah model
    await Ayah.updateMany(
      { _id: { $in: ayahIds } },
      { $set: { isTafseerAssociated: true } }
    )

    res.status(201).json(tafseer)
  } else {
    res.status(400)
    throw new Error('Invalid Tafseer data')
  }
})

// @desc    Get Tafseers for a Surah
// @route   GET /api/tafseers/:surahId
// @access  public
const getTafseersforSurah = asyncHandler(async (req, res) => {
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

  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const results = {}
  let count = 0

  count = await Tafseer.countDocuments()
    .all('surah', req.params.surahId)
    .sort({ number: 'asc' })

  results.count = count
  if (count === 0) {
    res
      .status(200)
      .json({ message: 'No Tafseers found', results: [], count: 0 }) // return 200 OK with a message
    return
  }

  results.pageCount = Math.ceil(count / limit)

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

  let tafseers = []

  tafseers = await Tafseer.find()
    .all('surah', req.params.surahId)
    .limit(limit)
    .skip(startIndex)
    .sort({ number: 'asc' })

  results.results = tafseers

  res.status(200).json(results)
})

// @desc    Get Tafseer for an Ayah
// @route   GET /api/tafseers/surah/:ayahId
// @access  public
const getAyahTafseer = asyncHandler(async (req, res) => {
  const tafseer = await Tafseer.find({ ayah: req.params.ayahId })

  if (!tafseer) {
    res.status(404)
    throw new Error('No Tafseer found')
  }

  res.status(200).json(tafseer)
})

// @desc    Update a Tafseer
// @route   PUT /api/tafseers/:tafseerId/
// @access  private
const updateTafseer = asyncHandler(async (req, res) => {
  const tafseer = await Tafseer.findById(req.params.tafseerId)

  if (!tafseer) {
    res.status(404)
    throw new Error('No Tafseer found')
  }

  const updatedTafseer = await Tafseer.findByIdAndUpdate(
    req.params.tafseerId,
    req.body,
    { new: true }
  )

  res.status(200).json(updatedTafseer)
})

// @desc    Delete a Surah
// @route   DELETE /api/tafseers/:tafseerId/
// @access  private
const deleteTafseer = asyncHandler(async (req, res) => {
  const tafseer = await Tafseer.findById(req.params.tafseerId)

  if (!tafseer) {
    res.status(404)
    throw new Error('No Tafseer found')
  }

  await Tafseer.findByIdAndDelete(req.params.tafseerId)

  res.status(200).json({ _id: tafseer._id })
})

// @desc    Delete all tafseers of a surah
// @route   DELETE /api/tafseers/surah/:surahId/
// @access  private
const deleteTafseersOfSurah = asyncHandler(async (req, res) => {
  const tafseer = await Tafseer.findOne({ surah: req.params.surahId })

  if (!tafseer) {
    res.status(404)
    throw new Error('No Tafseer found')
  }

  const result = await Tafseer.deleteMany({ surah: req.params.surahId })

  res.send(result)
})

// @desc    Get the last number for tafseer, add one and send to client
// @route   GET /api/tafseers/lastNumber/:surahId/
// @access  private
const getAvailableNumber = asyncHandler(async (req, res) => {
  try {
    const surahId = req.params.surahId
    const lastTafseerPart = await Tafseer.findOne({ surah: surahId })
      .sort({ number: -1 }) // Sort by number in descending order
      .limit(1) // Get only the last (highest number) document

    // If there is no tafseer part yet, start with 1, otherwise increment by 1
    const lastNumber = lastTafseerPart ? lastTafseerPart.number + 1 : 1

    res.status(200).json({ lastNumber: lastNumber })
  } catch (error) {
    res.status(500)
    throw new Error('An error occurred')
  }
})

// @desc    Search Tafseers
// @route   GET /api/tafseers/search
// @access  public
const searchTafseers = asyncHandler(async (req, res) => {
  const { query, surahId } = req.query

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' })
  }

  const pipeline = [
    {
      $search: {
        index: 'tafseer_search',
        compound: {
          should: [
            {
              autocomplete: {
                query: query,
                path: 'text',
                fuzzy: { maxEdits: 2, prefixLength: 3 }
              }
            },
            {
              autocomplete: {
                query: query,
                path: 'ayahs.text',
                fuzzy: { maxEdits: 2, prefixLength: 3 }
              }
            }
          ]
        }
      }
    },
    surahId
      ? {
          $match: { surah: new mongoose.Types.ObjectId(surahId) }
        }
      : null,
    { $limit: 10 },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
        results: { $push: '$$ROOT' }
      }
    },
    {
      $project: {
        score: { $meta: 'searchScore' },
        _id: 0,
        count: 1,
        results: 1
      }
    }
  ].filter(Boolean)

  try {
    const [result] = await Tafseer.aggregate(pipeline)

    if (!result) {
      return res.status(200).json({ count: 0, results: [] })
    }

    res.status(200).json(result)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: 'Server error while searching for Tafseers' })
  }
})

module.exports = {
  getSurasWithTafseers,
  getTafseersforSurah,
  getTafseersByIds,
  getTafseersWithNoAudioForSurah,
  addTafseer,
  getAyahTafseer,
  getAvailableNumber,
  deleteTafseer,
  deleteTafseersOfSurah,
  updateTafseer,
  searchTafseers
}
