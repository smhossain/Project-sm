const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500
  res.status(statusCode)

  // Log the error if in production, as the stack trace won't be sent to the client
  if (process.env.NODE_ENV === 'production') {
    console.error(err)
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
}

module.exports = { errorHandler }
