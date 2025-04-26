import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Form from './components/Form'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({})

  //state notification
  const [type, setType] = useState('')
  const [message, setMessage] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleLogin = user => {
    setIsLoggedIn(true)
    setUser(user)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('user')
    setUser({})
    setIsLoggedIn(false)
  }

  const createNewBlog = async e => {
    e.preventDefault()
    if (title === '' || author === '' || url === '') {
      setNotification('info', 'All fields are required')
      return;
    }
    try {
      const blog = { title, author, url }
      const blogSaved = await blogService.createBlog(blog)
      setBlogs(prevBlogs => [...prevBlogs, blogSaved])
      setNotification('success', `${(blogSaved?.title || 'Blog')} has been created!!`)
    } catch(error) {
      // axios error handling
      const errorMessage = error.response?.data?.error || 'Something went wrong'
      setNotification('error', errorMessage)
    }
  }

  const setNotification = (type, message) => {
    setType(type)
    setMessage(message)
    setTimeout(() => {
      setType('')
      setMessage('')
    }, 5000)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    fetchBlogs()
  }, [])


  useEffect(() => {
    const userLogged = window.localStorage.getItem('user')
    if (userLogged) {
      const user = JSON.parse(userLogged)
      if (user.token && user.username) {
        setUser(user)
        setIsLoggedIn(true)
        blogService.setToken(user.token)
      }
    }
  }, [])

  return (
    isLoggedIn ? (
      <>
        <h2>blogs</h2>
        <Notification type={type} message={message}/>
        <p style={{ display: "inline-block" }}>{user.name} logged in</p>
        <button
          type="button"
          onClick={handleLogout}
        >
          logout
        </button>
        <h3>Create new</h3>
        <form onSubmit={e => createNewBlog(e)}>
          <div className="container">
            <div className="classfrom">
              <label htmlFor="title">title</label>
              <input type="text" name="title" id="title" onChange={e => setTitle(e.target.value)}/>
            </div>
            <div className="classfrom">
              <label htmlFor="author">author</label>
              <input type="text" name="author" id="author" onChange={e => setAuthor(e.target.value)} />
            </div>
            <div className="classfrom">
              <label htmlFor="url">url</label>
              <input type="url" name="url" id="url" onChange={e => setUrl(e.target.value)}/>
            </div>
            <button type="submit">create</button>
          </div>
        </form>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </>
    ) : (
      <>
        <h2>Log in to application</h2>
        <Notification type={type} message={message}/>
        <Form onLogin={handleLogin} setNotification={setNotification} />
      </>
    )
  );

}

export default App