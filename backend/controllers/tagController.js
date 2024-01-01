const asyncHandler = require('express-async-handler')
const Tag = require('../models/tagModel')

// CREATE a new tag
const create = asyncHandler(async (req, res) => {
  const tag = new Tag(req.body)
  await tag.save()
  res.status(200).json({ success: true, data: tag })
})

// READ all tags
const findAll = asyncHandler(async (req, res) => {
  const language = req.query.lang || 'ar' // Default to Arabic if no language is provided
  const tags = await Tag.find({ language })
  res.status(200).json({ success: true, data: tags })
})

// READ a single tag by ID
const findById = asyncHandler(async (req, res) => {
  const tag = await Tag.findById(req.params.id)
  if (!tag) {
    res.status(404)
    throw new Error('Tag not found')
  }
  res.status(200).json({ success: true, data: tag })
})

// UPDATE a tag by ID
const updateById = asyncHandler(async (req, res) => {
  const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  if (!tag) {
    res.status(404)
    throw new Error('Tag not found')
  }
  res.status(200).json({ success: true, data: tag })
})

// DELETE a tag by ID
const deleteById = asyncHandler(async (req, res) => {
  try {
    const tagId = req.params.id
    const tagToDelete = await Tag.findById(tagId)

    if (!tagToDelete) {
      console.error(`Tag not found with ID: ${tagId}`)
      return res.status(404).json({ message: 'Tag not found' })
    }

    if (!tagToDelete.parentId) {
      // If it's a main tag, delete all its subtags
      await Tag.deleteMany({ parentId: tagId })
    }

    // Delete the main tag
    await Tag.findByIdAndDelete(tagId)

    res.status(200).json({ success: true, data: {} })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Fetch only the main tags
const getMainTags = asyncHandler(async (req, res) => {
  const mainTags = await Tag.find({ parentId: null }).sort({
    name: 1
  })
  res.json(mainTags)
})

// Fetch all tags including their parent's data
const getAllTagsWithSubTags = asyncHandler(async (req, res) => {
  const language = req.query.lang || 'ar' // Default to Arabic if no language is provided

  const mainTags = await Tag.find({ parentId: null, language }).sort({
    name: 1
  })

  const populatedTags = await Promise.all(
    mainTags.map(async (mainTag) => {
      const subTags = await Tag.find({ parentId: mainTag._id, language })
      return {
        ...mainTag._doc,
        subTags
      }
    })
  )

  res.status(200).json({ success: true, data: populatedTags })
})

// Fetch subtags for a specific main tag by ID
const getSubTagsForTag = asyncHandler(async (req, res) => {
  const mainTagId = req.params.id
  const subTags = await Tag.find({ parentId: mainTagId }).sort({
    name: 1
  })

  if (!subTags.length) {
    return res
      .status(200)
      .json({ message: 'No subtags found for this main tag' })
  }

  res.status(200).json({ success: true, mainTagId, data: subTags })
})

module.exports = {
  create,
  findAll,
  findById,
  updateById,
  deleteById,
  getMainTags,
  getAllTagsWithSubTags,
  getSubTagsForTag
}
