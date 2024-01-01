const express = require('express')
const router = express.Router()
const {
  addQuery,
  getLatestQueries,
  getUnAnsweredQueries,
  addAnswer,
  deleteQuery,
  getAllQueries
} = require('../controllers/queryController')
const { protect } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/isAdminMiddleware')

router.post('/', addQuery)
router.get('/all', getAllQueries)
router.get('/latest', getLatestQueries)
router.get('/unanswered', protect, isAdmin, getUnAnsweredQueries)
router.put('/:queryId', protect, isAdmin, addAnswer)
router.delete('/:queryId', protect, isAdmin, deleteQuery)

module.exports = router
