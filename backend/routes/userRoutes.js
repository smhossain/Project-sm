const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getMe,
  getUserById,
  requestPasswordReset,
  resetPassword
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/isAdminMiddleware')

router.get('/:userId', protect, isAdmin, getUserById)
router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.post('/request-reset', requestPasswordReset)
router.put('/reset-password/:resetToken', resetPassword)

module.exports = router
