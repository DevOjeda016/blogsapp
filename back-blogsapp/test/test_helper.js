const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'Test for node',
    author: 'Daniel Ojeda Luna',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 2
  },
  {
    title: 'React patterns',
    author: 'Edsger W. Dijkstra',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 2
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 12
  }
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'OpenAI lays out its for-profit transition plans',
    author: 'Kyle Wiggers',
    url: 'https://techcrunch.com/2024/12/27/openai-lays-out-its-for-profit-transition-plans/',
    likes: 0
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const hasIdProperty = (blogs) => {
  return blogs.every(blog => blog.hasOwnProperty('id'))
}

module.exports = {
  initialBlogs, nonExistingId, hasIdProperty
}