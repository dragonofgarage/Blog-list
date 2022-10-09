const Logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

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

//get token from request
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

const userExtractor = async (request, response, next) => {  //Dealing with the indentify of user from token
  try {
    if(request.token)
    {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if(!decodedToken.id){
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      request.user = await User.findById(decodedToken.id)
    }
  } catch (error) {
    next(error)
  }

  next()
}



module.exports = {
  requestLogger,
  errorHandler,
  tokenExtractor,
  userExtractor
}