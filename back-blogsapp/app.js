const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')


logger.info('connecting to MongoDB')

mongoose.set('strictQuery', false)

mongoose.connect(config.MONGO_DB)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('connection to MongoDB failed', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

//TODO production build of FrontEnd
//app.use(express.static('dist'))
//*Default Path (temporally)
app.get('/', (request, response) => {
  response.end('<h1>Hello world</h1>')
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknowEndpoint)
app.use(middleware.errorHandler)

module.exports = app





