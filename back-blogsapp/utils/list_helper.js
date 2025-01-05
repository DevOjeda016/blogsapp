const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  const initialValue = 0
  const reducer = (acc, blog) => acc + blog.likes
  return blogs.reduce(reducer, initialValue)
}

const favoriteBlogs = blogs => {
  if (!Array.isArray(blogs) || blogs.length === 0) return []

  const maxLikes = Math.max(...blogs.map(blog => blog.likes))

  return blogs.filter(blog => blog.likes === maxLikes)
}


const mostBlog = blogs => {
  if (!Array.isArray(blogs) || blogs.length === 0) return []

  const authorCounts = _.countBy(blogs, 'author')
  const maxBlogs = _.maxBy(Object.values(authorCounts))

  const topAuthors = Object.entries(authorCounts)
    .filter(([, count]) => count === maxBlogs)
    .map(([author, count]) => ({ author, blogs: count }))

  return topAuthors
}

const mostLikes = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return []

  // Agrupar blogs por autor
  const groupedBlogs = _.groupBy(blogs, 'author')

  // Calcular la suma de likes por autor
  const likesByAuthor = _.map(groupedBlogs, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes'),
  }))

  // Encontrar el número máximo de likes
  const maxLikes = _.maxBy(likesByAuthor, 'likes')?.likes || 0

  // Filtrar autores con el número máximo de likes
  return _.filter(likesByAuthor, ({ likes }) => likes === maxLikes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlogs,
  mostBlog,
  mostLikes
}