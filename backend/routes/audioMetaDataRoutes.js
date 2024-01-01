const express = require('express')
const router = express.Router()
const {
  createAudioMetaData,
  getAllAudioMetaData,
  getAudioMetaDataById,
  getAudioMetaDataBySurahId,
  getNextPartNumber,
  updateAudioMetaData,
  deleteAudioMetaData
} = require('../controllers/audioMetaDataController')
const { protect } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/isAdminMiddleware')

router.get('/', getAllAudioMetaData)
router.get('/next/:surahId', protect, isAdmin, getNextPartNumber)
router.get('/:id', getAudioMetaDataById)
router.get('/surah/:surahId', getAudioMetaDataBySurahId)
router.post('/', protect, isAdmin, createAudioMetaData)
router.put('/:id', protect, isAdmin, updateAudioMetaData)
router.delete('/:id', protect, isAdmin, deleteAudioMetaData)

module.exports = router
