const asyncHandler = require('express-async-handler')
const Query = require('../models/queryModel')
const Tag = require('../models/tagModel')

// @desc    Add a Query
// @route   POST /api/queries
// @access  public
const addQuery = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    user,
    question,
    answer,
    mainTag,
    isPublishable,
    language
  } = req.body

  if (!name || !question || !mainTag) {
    res.status(400)
    throw new Error('Please include all fields')
  }

  // Find if Query exists
  const queryExists = await Query.findOne({ question })
  if (queryExists) {
    res.status(400)
    throw new Error('Query already exists')
  }

  const query = await Query.create({
    name,
    email,
    question,
    mainTag,
    user,
    answer,
    isPublishable,
    language
  })

  if (query) {
    // After creating the query, increment usage count for main tag
    if (query.mainTag) {
      await Tag.findByIdAndUpdate(query.mainTag, { $inc: { usageCount: 1 } })
    }
    res.status(201).json(query)
  } else {
    res.status(400)
    throw new Error('Invalid Query data')
  }
})

// @desc    Get multiple queries
// @route   GET /api/queries/latest
// @access  public
const getLatestQueries = asyncHandler(async (req, res) => {
  const lang = req.query.lang
  const latestQueries = await Query.find({
    answer: { $ne: null },
    isPublishable: true,
    language: lang
  })
    .sort({ _id: -1 })
    .limit(6)

  if (latestQueries.length === 0) {
    return res.status(200).json({ message: 'No queries found' })
  }

  res.status(200).json(latestQueries)
})

// @desc    Get all queries paginated with Atlas Search
// @route   GET /api/queries
// @access  public
const getAllQueries = asyncHandler(async (req, res) => {
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

  const isPublishable = req.query.pub === 'true' // will be true if pub=true, false otherwise
  const language = req.query.lang || 'ar'

  // Extract filters from request
  const filters = req.query.filters
    ? JSON.parse(decodeURIComponent(req.query.filters))
    : {}

  let baseMatchConditions = {
    language: language,
    ...(isPublishable && { answer: { $ne: null }, isPublishable: true })
  }

  const ObjectId = require('mongoose').Types.ObjectId
  // Add filters to baseMatchConditions if any
  // Add filters to baseMatchConditions if any
  if (filters.mainTag && filters.mainTag._id) {
    baseMatchConditions['mainTag'] = new ObjectId(filters.mainTag._id)
  }

  // If there's a filter for `tags`, and it is an array with at least one tag
  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    baseMatchConditions['tags'] = {
      $in: filters.tags.map((tag) => new ObjectId(tag))
    }
  }

  // Extract search term from request
  const searchTerm = req.query.search
  const startIndex = (page - 1) * limit

  let aggregationPipeline = []

  // If a search term is provided, use it in the first stage of the aggregation pipeline
  if (searchTerm) {
    aggregationPipeline.push({
      $search: {
        index: 'query_search', // Replace with the name of your Atlas Search index
        compound: {
          should: [
            {
              autocomplete: {
                query: searchTerm,
                path: 'question', // Specify the field to autocomplete in
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 3
                }
              }
            },
            {
              autocomplete: {
                query: searchTerm,
                path: 'answer', // Specify the field to autocomplete in
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 3
                }
              }
            }
          ]
        }
      }
    })
  }

  // Add base match conditions after the $search stage
  if (Object.keys(baseMatchConditions).length > 0) {
    aggregationPipeline.push({ $match: baseMatchConditions })
  }

  // Continue with sorting and pagination
  aggregationPipeline.push(
    // Sort by _id if not searching, by score if searching
    ...(!searchTerm ? [{ $sort: { _id: -1 } }] : []),
    // Pagination using $facet to handle total count and page data
    {
      $facet: {
        metadata: [{ $count: 'total' }],
        data: [{ $skip: startIndex }, { $limit: limit }]
      }
    }
  )

  // Execute the aggregation pipeline
  const result = await Query.aggregate(aggregationPipeline)

  // Construct the results based on the aggregation response
  const metadata = result[0].metadata
  const count = metadata.length > 0 ? metadata[0].total : 0
  const queries = result[0].data

  // Prepare the response object
  const results = {
    count: count,
    pageCount: Math.ceil(count / limit),
    results: queries
  }

  // Include navigation links if applicable
  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  if (startIndex + limit < count) {
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  // Check if there are no queries found
  if (count === 0) {
    res.status(200).json({ message: 'No Queries found', results: [], count: 0 })
    return
  }

  // Send the successful response
  res.status(200).json(results)
})

// @desc    Get unanswered queries
// @route   GET /api/queries/unanswered
// @access  private
const getUnAnsweredQueries = asyncHandler(async (req, res) => {
  const count = await Query.countDocuments({ answer: null }).sort({ _id: -1 })
  const unansweredQueries = await Query.find({ answer: null }).sort({ _id: -1 })

  if (unansweredQueries.length === 0) {
    res.status(200).json({ message: 'No queries found' })
  }

  const results = {}
  results.count = count
  results.results = unansweredQueries

  res.status(200).json(results)
})

// @desc    Add answer to a query
// @route   PUT /api/queries
// @access  private
const addAnswer = asyncHandler(async (req, res) => {
  const { queryId } = req.params
  const { answer, mainTag, tags, isPublishable, answeredBy, answerDate } =
    req.body

  const query = await Query.findById(queryId).populate('tags')

  if (!query) {
    res.status(404)
    throw new Error('No query found')
  }

  // Decrement usage count for the old mainTag if it's being changed
  if (mainTag && query.mainTag.toString() !== mainTag) {
    await Tag.findByIdAndUpdate(query.mainTag, { $inc: { usageCount: -1 } })
    await Tag.findByIdAndUpdate(mainTag, { $inc: { usageCount: 1 } })
    query.mainTag = mainTag
  }

  // Handle subtags
  if (Array.isArray(tags)) {
    const oldTags = query.tags.map((tag) => tag._id.toString())
    const newTags = tags.filter((tagId) => !oldTags.includes(tagId))
    const removedTags = oldTags.filter((tagId) => !tags.includes(tagId))

    // Increment usage count for new tags
    if (newTags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: newTags } },
        { $inc: { usageCount: 1 } }
      )
    }

    // Decrement usage count for removed tags
    if (removedTags.length > 0) {
      const tagsToUpdate = await Tag.find({ _id: { $in: removedTags } })
      for (const tag of tagsToUpdate) {
        if (tag.usageCount > 0) {
          await Tag.findByIdAndUpdate(tag._id, { $inc: { usageCount: -1 } })
        }
      }
    }

    query.tags = tags
  }

  // Update answer and log edit history if the answer has been edited
  if (answer && query.answer !== answer) {
    // Log the edit in the history only if there was a pre-existing answer
    if (query.answer) {
      query.editHistory = query.editHistory || [] // Ensure the array exists
      query.editHistory.push({
        editedBy: answeredBy,
        editDate: new Date(),
        previousAnswer: query.answer
      })
    }

    // Update the answer
    query.answer = answer
  }
  if (typeof isPublishable !== 'undefined') {
    query.isPublishable = isPublishable
  }

  if (answeredBy) {
    query.answeredBy = answeredBy
  }

  if (answerDate) {
    query.answerDate = answerDate
  }

  await query.save()
  res.status(200).json(query)
})

// @desc    Delete a Query
// @route   DELETE /api/queries/:queryId/
// @access  private
const deleteQuery = asyncHandler(async (req, res) => {
  const query = await Query.findById(req.params.queryId)

  if (!query) {
    res.status(404)
    throw new Error('No query found')
  }

  // Decrement usage count for associated tags before deleting the query
  if (query.tags && query.tags.length > 0) {
    await Tag.updateMany(
      { _id: { $in: query.tags } },
      { $inc: { usageCount: -1 } }
    )
  }

  await Query.findByIdAndDelete(req.params.queryId)

  res.status(200).json({ _id: query._id })
})

module.exports = {
  addQuery,
  getLatestQueries,
  getUnAnsweredQueries,
  getAllQueries,
  addAnswer,
  deleteQuery
}
