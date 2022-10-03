const Logger = require('./logger')

const requestLogger =  (request, response, next) => {
  Logger.info('Path: ', request.path)
  next()
}

module.exports = {
  requestLogger
}