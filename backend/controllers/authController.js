const asyncHandler = require('../middleware/asyncHandler')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  })
}

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please provide name, email and password')
  }

  const existing = await User.findOne({ email })
  if (existing) {
    res.status(400)
    throw new Error('User with that email already exists')
  }

  const user = await User.create({ name, email, password })

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  })
})

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  const user = await User.findOne({ email })
  if (!user) {
    res.status(404)
    throw new Error('No user found with this email! Please SignUp')
  }

  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  })
})
