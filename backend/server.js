const path = require('path')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const connectDB = require('./config/db')
const expenseRoutes = require('./routes/expenseRoutes')
const authRoutes = require('./routes/authRoutes')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
})
