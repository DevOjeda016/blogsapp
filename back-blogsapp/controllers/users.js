const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcryptjs')

usersRouter.get('/', async (request, response) => {
  const users = await User.find().populate('blogs', { user: 0})
  response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (password < 3) {
    return response.status(400).status({ error: 'password must be 3 or more characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    passwordHash,
    name
  })

  const savedNote = await user.save()
  response.status(201).json(savedNote)
})

module.exports = usersRouter