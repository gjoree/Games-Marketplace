const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const path = require('path')

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/sokoban', express.static(path.join(__dirname, 'sokoban')))

// Start server
const PORT = 5059
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
