const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const assert = require('node:assert')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('GET /api/blogs: returns blogs as JSON', async () => {
  const initialBlogs = helper.initialBlogs
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('GET /api/blogs: each blog contains an id property', async () => {
  const response = await api.get('/api/blogs')
  assert(helper.hasIdProperty(response.body))
})

describe('POST /api/blogs: adding a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'This is a new note',
      author: 'Daniel Ojeda Luna',
      url: 'https://fullstackopen/es/test/',
      likes: 12
    }

    const responseSavedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const initialBlogs = helper.initialBlogs
    const responseAllBlogs = await api.get('/api/blogs')

    assert.strictEqual(responseAllBlogs.body.length, initialBlogs.length + 1)
    assert(responseAllBlogs.body.some(blog => blog.id === responseSavedBlog.body.id))
  })

  test('preserves the likes property if provided', async () => {
    const newBlog = {
      title: 'This is a new note',
      author: 'Daniel Ojeda Luna',
      url: 'https://fullstackopen/es/test/',
      likes: 12
    }

    const responseSavedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(responseSavedBlog.body.likes, 12)
  })

  test('sets likes to 0 by default if not provided', async () => {
    const newBlog = {
      title: 'This is a new note',
      author: 'Daniel Ojeda Luna',
      url: 'https://fullstackopen/es/test/'
    }

    const responseSavedBlog = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(responseSavedBlog.body.likes, 0)
  })

  test('fails with status 400 if required fields are missing', async () => {
    const newBlog = { likes: 12 }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const responseAllBlogs = await api.get('/api/blogs')
    assert.strictEqual(responseAllBlogs.body.length, helper.initialBlogs.length)
  })
})

describe('PUT /api/blogs: updating a blog', () => {
  test('fails with status 400 for invalid ID format', async () => {
    const invalidId = (await helper.nonExistingId()).substring(0, 23)

    const updatedBlog = {
      title: 'This is a new note',
      author: 'Daniel Ojeda Luna',
      url: 'https://fullstackopen/es/test/',
      likes: 13
    }

    const response = await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlog)
      .expect(400)

    assert.strictEqual(response.body.error, 'Invalid ID format')
  })

  test('succeeds with valid data and ID', async () => {
    const initialBlogs = (await api.get('/api/blogs/')).body
    const blogToUpdate = initialBlogs[0]
    const updatedBlog = {
      title: 'This is a new note',
      author: 'Daniel Ojeda Luna',
      url: 'https://fullstackopen/es/test/',
      likes: 13
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    assert.strictEqual(response.body.likes, 13)
  })

  test('fails with status 400 if required fields are missing', async () => {
    const initialBlogs = (await api.get('/api/blogs/')).body
    const blogToUpdate = initialBlogs[0]
    const updatedBlog = { likes: 13 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(400)

    assert.strictEqual(response.body.error, 'missing required fields')
  })

  test('fails with status 404 if resource does not exist', async () => {
    const id = await helper.nonExistingId()

    const updatedBlog = {
      title: 'This is a new note',
      author: 'Daniel Ojeda Luna',
      url: 'https://fullstackopen/es/test/',
      likes: 13
    }

    const response = await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(404)

    assert.strictEqual(response.body.message, 'resource not found')
  })
})

describe('DELETE /api/blogs: deleting a blog', () => {
  test('fails with status 400 for invalid ID format', async () => {
    const invalidId = (await helper.nonExistingId()).substring(0, 23)

    const response = await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)

    assert.strictEqual(response.body.error, 'Invalid ID format')
  })

  test('succeeds with valid ID', async () => {
    const initialBlogs = (await api.get('/api/blogs/')).body
    const blogToDelete = initialBlogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const finalBlogs = (await api.get('/api/blogs/')).body
    assert.strictEqual(finalBlogs.length, initialBlogs.length - 1)
  })

  test('fails with status 404 if resource does not exist', async () => {
    const id = await helper.nonExistingId()

    const response = await api
      .delete(`/api/blogs/${id}`)
      .expect(404)

    assert.strictEqual(response.body.message, 'resource not found')
  })
})

after(async () => {
  mongoose.connection.close()
})