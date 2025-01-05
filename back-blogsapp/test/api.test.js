const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  const notes = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  console.log(notes)
})

after(async () => {
  mongoose.connection.close()
})