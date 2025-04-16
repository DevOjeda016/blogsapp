const logger = require('./logger')
const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = process.env.NODE_ENV !== 'test'
  ? morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      JSON.stringify(req.body),
    ].join(' ')
  })
  : (request, response, next) => next()

const unknowEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if(error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const token = request.token
  
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(404).json({ error: 'user not found' })
  }

  request.user = user
  next()
}

module.exports = {
  errorHandler,
  requestLogger,
  unknowEndpoint,
  tokenExtractor,
  userExtractor
}