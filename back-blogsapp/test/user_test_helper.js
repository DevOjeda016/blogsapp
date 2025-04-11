const User = require('../models/user')
const initialUsers = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'Dani016*'
  },
  {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }
]

const nonExistingId = async () => {
  const user = new User({
    username: 'willremovethissoon',
    name: 'Will Remove',
    password: 'Carlitos123'
  })
  await user.save()
  await user.remove()
  return user._id.toString()
}

const usersInDb = async () => {
  const users = await User.find()
  return users.map(user => user.toJSON())
}

module.exports = {
  initialUsers,
  nonExistingId,
  usersInDb
}