const express = require('express')
const router = express.Router()
const {
  addSurah,
  getSurah,
  getSurahName,
  getSurahs,
  getAllSurahs,
  updateSurah,
  deleteSurah
} = require('../controllers/surahController')
const { protect } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/isAdminMiddleware')
const ayahRouter = require('./ayahRoutes')

// Re-route to ayah router
router.use('/:surahId/ayahs', ayahRouter)

router.post('/', protect, isAdmin, addSurah)
router.post('/tsurahs', getSurahs) // get surahs with _id(s) in req.body
router.get('/:surahId', getSurah)
router.get('/name/:surahId', getSurahName)
router.get('/', getAllSurahs)
router.put('/:surahId', protect, isAdmin, updateSurah)
router.delete('/:surahId', protect, isAdmin, deleteSurah)

module.exports = router
