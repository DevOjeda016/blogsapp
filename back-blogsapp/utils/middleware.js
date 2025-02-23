const logger = require('./logger')
const morgan = require('morgan')

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
  }
  next(error)
}


module.exports = {
  errorHandler,
  requestLogger,
  unknowEndpoint
}