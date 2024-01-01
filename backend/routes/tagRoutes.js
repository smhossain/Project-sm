const express = require('express')
const router = express.Router()
const {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
  getAllTagsWithSubTags,
  getMainTags,
  getSubTagsForTag
} = require('../controllers/tagController')
const { protect } = require('../middleware/authMiddleware')
const { isAdmin } = require('../middleware/isAdminMiddleware')

// Route to CREATE a new tag
router.post('/', protect, isAdmin, create)

// Route to READ all tags
router.get('/', findAll)

// Route to fetch only the main tags
router.get('/main', getMainTags)

// Route to fetch all tags including sub-tags
router.get('/all-with-subtags', getAllTagsWithSubTags)

// Route to READ a single tag by ID
router.get('/:id', findById)

// Route to UPDATE a tag by ID
router.put('/:id', protect, isAdmin, updateById)

// Route to DELETE a tag by ID
router.delete('/:id', protect, isAdmin, deleteById)

// Route to get subtags of tag
router.get('/:id/subtags', getSubTagsForTag)

module.exports = router
