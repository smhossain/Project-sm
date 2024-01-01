const asyncHandler = require('express-async-handler')
const AudioMetaData = require('../models/audioMetaDataModel')
const Surah = require('../models/surahModel')
const Tafseer = require('../models/tafseerModel')

// @desc    Create audio metadata
// @route   POST /api/audios
// @access  Private/Admin
const createAudioMetaData = asyncHandler(async (req, res) => {
  const { surah: surahId, partNumber, url, duration, tafseers } = req.body

  // Fetch the Surah document to get the name
  const surah = await Surah.findById(surahId)
  if (!surah) {
    res.status(404)
    throw new Error('Surah not found')
  }

  // Generate title and thumbnail
  const title = `${surah.name}-${partNumber}`
  const thumbnail = `${surah.name}.jpg`
  const artist = 'سيد مرتضى المهري'

  const audioMetaData = new AudioMetaData({
    surah: surahId,
    partNumber,
    url,
    title,
    thumbnail,
    artist,
    duration,
    tafseers
  })

  const createdAudioMetaData = await audioMetaData.save()

  // Update Surah document
  const surahToUpdate = await Surah.findById(createdAudioMetaData.surah)
  if (surahToUpdate) {
    surahToUpdate.audioFiles.push(createdAudioMetaData._id)
    await surahToUpdate.save()
  }

  // Update Tafseer documents
  for (const tafseerId of createdAudioMetaData.tafseers) {
    const tafseer = await Tafseer.findById(tafseerId)
    if (tafseer) {
      tafseer.audioFile = createdAudioMetaData._id
      tafseer.isAudioAssociated = true
      await tafseer.save()
    }
  }

  res.status(201).json(createdAudioMetaData)
})

// @desc    Get all audio metadata
// @route   GET /api/audiometadata
// @access  Private/Admin
const getAllAudioMetaData = asyncHandler(async (req, res) => {
  const audioMetaData = await AudioMetaData.find().populate('surah', 'name')
  res.status(200).json(audioMetaData)
})

// @desc    Get audio metadata by ID
// @route   GET /api/audiometadata/:id
// @access  Private/Admin
const getAudioMetaDataById = asyncHandler(async (req, res) => {
  const audioMetaData = await AudioMetaData.findById(req.params.id).populate(
    'surah',
    'name'
  )

  if (audioMetaData) {
    res.status(200).json(audioMetaData)
  } else {
    res.status(404)
    throw new Error('Audio metadata not found')
  }
})

const getAudioMetaDataBySurahId = asyncHandler(async (req, res) => {
  const audioMetaData = await AudioMetaData.find({ surah: req.params.surahId })
  res.status(200).json(audioMetaData)
})

// @desc    Update audio metadata
// @route   GET /api/audiometadata/next/number
// @access  Private/Admin
const getNextPartNumber = asyncHandler(async (req, res) => {
  const surahId = req.params.surahId

  const lastAudio = await AudioMetaData.findOne({ surah: surahId }).sort({
    partNumber: -1
  })

  const nextPartNumber = lastAudio ? lastAudio.partNumber + 1 : 1

  res.status(200).json({ nextPartNumber })
})

// @desc    Update audio metadata
// @route   PUT /api/audiometadata/:id
// @access  Private/Admin
const updateAudioMetaData = asyncHandler(async (req, res) => {
  const { partNumber, url, duration, tafseers } = req.body
  const audioMetaData = await AudioMetaData.findById(req.params.id)

  if (!audioMetaData) {
    res.status(404)
    throw new Error('Audio metadata not found')
  }

  // Update AudioMetaData
  audioMetaData.partNumber = partNumber || audioMetaData.partNumber
  audioMetaData.url = url || audioMetaData.url
  audioMetaData.duration = duration || audioMetaData.duration

  // Handle changes in associated tafseers
  const oldTafseers = audioMetaData.tafseers
  audioMetaData.tafseers = tafseers || audioMetaData.tafseers

  const updatedAudioMetaData = await audioMetaData.save()

  // Update Tafseer documents for removed associations
  const removedTafseers = oldTafseers.filter(
    (t) => !audioMetaData.tafseers.includes(t)
  )
  await Tafseer.updateMany(
    { _id: { $in: removedTafseers } },
    { $unset: { audioFile: '' }, isAudioAssociated: false }
  )

  // Update Tafseer documents for new associations
  await Tafseer.updateMany(
    { _id: { $in: audioMetaData.tafseers } },
    { audioFile: updatedAudioMetaData._id, isAudioAssociated: true }
  )

  res.status(200).json(updatedAudioMetaData)
})

// @desc    Delete audio metadata
// @route   DELETE /api/audiometadata/:id
// @access  Private/Admin
const deleteAudioMetaData = asyncHandler(async (req, res) => {
  const audioMetaData = await AudioMetaData.findById(req.params.id)

  if (!audioMetaData) {
    res.status(404)
    throw new Error('Audio metadata not found')
  }

  // Update Surah document to remove the reference
  await Surah.updateOne(
    { _id: audioMetaData.surah },
    { $pull: { audioFiles: audioMetaData._id } }
  )

  // Update Tafseer documents to remove the association
  await Tafseer.updateMany(
    { audioFile: audioMetaData._id },
    { $unset: { audioFile: '' }, $set: { isAudioAssociated: false } }
  )

  // Finally, remove the AudioMetaData
  await AudioMetaData.findByIdAndDelete(req.params.id)

  res.status(200).json({ message: 'Audio metadata removed' })
})

module.exports = {
  createAudioMetaData,
  getAllAudioMetaData,
  getAudioMetaDataById,
  getAudioMetaDataBySurahId,
  getNextPartNumber,
  updateAudioMetaData,
  deleteAudioMetaData
}
