const config = require('./utils/config')
const logger = require('./utils/logger')
const app = require('./app')
const PORT = config.PORT

app.listen(PORT, () => {
  logger.info(`Conection has been successed on PORT ${PORT}\nhttp://localhost:${PORT}`)
})