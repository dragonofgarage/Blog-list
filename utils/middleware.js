const Logger = require('./logger')

const requestLogger =  (request, response, next) => {
  Logger.info('Path: ', request.path)
  next()
}

const errorHandler = (error, request, response, next) => {
  Logger.error(error.message)
  next(error)
}

module.exports = {
  requestLogger,
  errorHandler
}