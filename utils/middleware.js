const logger = require('./logger')
const morgan = require('morgan')

const requestLogger = morgan((tokens, req, res) => {
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

const unknowEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknow endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.info(error.message)
  next()
}


module.exports = {
  errorHandler,
  requestLogger,
  unknowEndpoint
}