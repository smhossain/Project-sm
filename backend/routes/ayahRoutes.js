const express = require('express')
const router = express.Router({ mergeParams: true })
const {
  addAyah,
  getAyah,
  getAyahsOfSurah,
  getMultipleAyahs,
  getNoTafseerAyahs,
  updateAyah,
  updateAyahsMulti,
  deleteAyah,
  deleteAyahsOfSurah
} = require('../controllers/ayahController')
const { protect } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/isAdminMiddleware')

router.post('/', protect, isAdmin, addAyah)
router.get('/', getAyahsOfSurah)
router.get('/multi', getMultipleAyahs)
router.get('/:ayahId', getAyah)
router.get('/no/tafseer', getNoTafseerAyahs)
router.put('/multi', protect, isAdmin, updateAyahsMulti)
router.put('/:ayahId', protect, isAdmin, updateAyah)
router.delete('/:ayahId', protect, isAdmin, deleteAyah)
router.delete('/', protect, isAdmin, deleteAyahsOfSurah)

module.exports = router
