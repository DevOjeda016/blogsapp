const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  name: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (document, returnedDocument) => {
    returnedDocument.id = returnedDocument._id.toJSON()
    delete returnedDocument._id
    delete returnedDocument.__v
    delete returnedDocument.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)