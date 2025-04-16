const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find().populate('user', { blogs: 0 })
  response.status(200).json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body
  const user = request.user

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

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

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const id = request.params.id
  const user = request.user

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' })
  }

  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).json({ message: 'resource not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({
      error: 'Current user doesn\'t have permissions to delete this blog'
    })
  }

  await Blog.findByIdAndDelete(id)
  console.log(user)
  user.blogs = user.blogs.filter(blogId => blogId.toString() !== id)

  response.status(204).end()
})


module.exports = blogsRouter