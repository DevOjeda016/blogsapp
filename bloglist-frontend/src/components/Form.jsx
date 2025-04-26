import { useState } from "react"
import loginService from '../services/login'

const Form = ({ onLogin, setNotification }) => {
  const [username, setUsername] = useState(null)
  const [password, setPassword] = useState('')

  const handleSubmit = async evt => {
    evt.preventDefault()
    if (username === '' || password === '') {
      setNotification('error', 'All fields are required')
      return
    }
    try {
      const user = await loginService.login({
        username,
        password
      })
      onLogin(user)
      window.localStorage.setItem('user', JSON.stringify(user))
    } catch (e) {
      setNotification('error', 'wrong credentials')
    }
  }

  return (
    <form onSubmit={(evt) => handleSubmit(evt)}>
      <div className="container">
        <div className="form-control">
          <label htmlFor="username">Usuario</label>
          <input
            type="text"
            name="username"
            id="username"
            autoComplete="username"
            aria-label="Usuario"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            name="password"
            id="password"
            aria-label="contraseña"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-submit"
          aria-label="Iniciar sesión"
        >
          Log in
        </button>
      </div>
    </form>
  )
}

export default Form