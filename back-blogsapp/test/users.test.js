const { test, beforeEach, after } = require('node:test')
const assert  = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./user_test_helper')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const api = supertest(app)
const salts = 10

beforeEach(async () => {
  await User.deleteMany()
  const userObjects = helper.initialUsers
    .map(user => {
      user.passwordHash = bcrypt.hashSync(user.password, salts)
      delete user.password
      return new User(user)
    })

  const promiseArray = userObjects.map(user => user.save())
  await Promise.all(promiseArray)
})

test('users are returned as json', async () => {
  const users = await helper.usersInDb()
  const response = await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, users.length)
})

after(async() => {
  await mongoose.connection.close()
})

