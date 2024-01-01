const asyncHandler = require('express-async-handler')

const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403)
    throw new Error('Not authorized as an admin')
  }
})

module.exports = { isAdmin }
