const express = require('express')
const router = express.Router()
const {
  getSurasWithTafseers,
  getTafseersforSurah,
  getTafseersWithNoAudioForSurah,
  getTafseersByIds,
  getAvailableNumber,
  addTafseer,
  getAyahTafseer,
  updateTafseer,
  deleteTafseer,
  deleteTafseersOfSurah,
  searchTafseers
} = require('../controllers/tafseerController')
const { protect } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/isAdminMiddleware')

router.get('/', getSurasWithTafseers) // get all available Surahs with tafseers
router.get('/search', searchTafseers) // search tafseers
router.get('/:surahId', getTafseersforSurah) // get all tafseers of surahId
router.get('/:surahId/noaudio', getTafseersWithNoAudioForSurah) // get all tafseers of surahId
router.get('/surah/:ayahId', getAyahTafseer) // get tafseer of an ayah
router.get('/lastnumber/:surahId', protect, isAdmin, getAvailableNumber) // get available number for storing tafseer
router.post('/byIds', getTafseersByIds) // get tafseer(s) details by IDs
router.post('/', protect, isAdmin, addTafseer) // add one tafseer
// router.post('/:tafseerId', addTafseer) // add tafseer for an ayah of a surah
router.put('/:tafseerId', protect, isAdmin, updateTafseer) // update a tafseer
router.delete('/:tafseerId', protect, isAdmin, deleteTafseer) // delete a tafseer
router.delete('/remove/:surahId', protect, isAdmin, deleteTafseersOfSurah) // delete all tafseers of a surah

module.exports = router
