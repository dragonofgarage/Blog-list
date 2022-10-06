const Logger = require('./logger')

const requestLogger =  (request, response, next) => {
  Logger.info('Path: ', request.path)
  next()
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else {
    Logger.error(error.message)
  }
  next(error)
}

module.exports = {
  requestLogger,
  errorHandler
}