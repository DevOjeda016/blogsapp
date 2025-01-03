require('dotenv').config()
const PORT = process.env.PORT
const MONGO_DB = process.env.NODE_ENV === 'test'
  ? process.env.MONGO_DB
  : process.env.MONGO_TEST_DB


module.exports = {
  PORT,
  MONGO_DB
}
