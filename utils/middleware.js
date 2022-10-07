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
  } else if (error.name ==='JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }
  else {
    Logger.error(error.message)
  }
  next(error)
}


const tokenExtractor = (request, response, next) => {

  const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7)
    }
    return null
  }

  request.token = getTokenFrom(request)

  next()
}

module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor
}