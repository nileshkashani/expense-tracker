const mongoose = require('mongoose')


const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    console.error(
      'MongoDB connection string is not set. Copy .env.example to .env and set MONGO_URI.'
    )
    process.exit(1)
  }


  try {
    const conn = await mongoose.connect(mongoUri)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
