const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')

logger.info('connecting to MongoDB')

mongoose.connect(config.mongoUrl)
  .then(result => {
    logger.info('connected to MongoDB', config.mongoUrl)
  })
  .catch((error) => {
    logger.error('failled to connect to MongoDB: ', error.message)
  })

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)
app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)


module.exports = app