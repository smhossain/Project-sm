const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const { errorHandler } = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const PORT = process.env.PORT || 5000

// Connect to DB
connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to S. Mortadha API'
  })
})

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/surahs', require('./routes/surahRoutes'))
app.use('/api/queries', require('./routes/queryRoutes'))
app.use('/api/tafseers', require('./routes/tafseerRoutes'))
app.use('/api/tags', require('./routes/tagRoutes'))
app.use('/api/audios', require('./routes/audioMetaDataRoutes'))
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
