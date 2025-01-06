const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find()
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const newBlog = request.body
  if (!newBlog.hasOwnProperty('likes')) {
    newBlog.likes = 0
  }
  const blog = new Blog(newBlog)
  const savedBlog= await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const blog = request.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' })
  }

  if (!blog.title || !blog.author || !blog.url) {
    return response.status(400).json({ error: 'missing required fields' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    blog,
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    return response.status(404).json({ message: 'resource not found' })
  }

  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' })
  }

  const deletedBlog = await Blog.findByIdAndDelete(id)

  if (!deletedBlog) {
    return response.status(404).json({ message: 'resource not found' })
  }

  response.status(204).end()
})


module.exports = blogsRouter