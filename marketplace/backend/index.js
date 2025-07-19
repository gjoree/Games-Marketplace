const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const sokobanRoutes = require('./routes/sokoban')
const path = require('path')

const app = express()

// Middleware
app.use(
  cors({
    origin: 'http://localhost:3300', // 👈 your frontend's origin
    credentials: true,
  }),
)
app.use(bodyParser.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/sokoban', sokobanRoutes)
app.use('/sokoban', express.static(path.join(__dirname, 'sokoban')))
app.get('/racer', (req, res) => {
  res.sendFile(path.join(__dirname, 'javascript-racer', 'v4.final.html'))
})

// Serve static assets like JS/CSS/images from the racer folder
app.use('/racer', express.static(path.join(__dirname, 'javascript-racer')))
app.use(
  '/onslaught-arena',
  express.static(path.join(__dirname, 'onslaught_arena/htdocs')),
)

// Start server
const PORT = 5059
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
