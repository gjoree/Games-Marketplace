require('./routes/leaderboardRewards')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const authRoutes = require('./routes/auth')
const sokobanRoutes = require('./routes/sokoban')
const leaderboardRoutes = require('./routes/leaderboard')
const onslaughtArenaRoutes = require('./routes/onslaught_arena')
const path = require('path')
const racerRoutes = require('./routes/racer')

const app = express()

// --- STATIC FILE SERVING (IMPORTANT: PLACE THIS EARLY) ---
app.use('/racer', express.static(path.join(__dirname, 'javascript-racer')))
app.use(
  '/onslaught-arena',
  express.static(path.join(__dirname, 'onslaught_arena/htdocs')),
)
app.use('/sokoban', express.static(path.join(__dirname, 'sokoban')))

// Optional shortcut: Serve common global assets if needed
app.use(express.static(path.join(__dirname, 'public'))) // For /common.js, /common.css, etc., if applicable

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: 'http://localhost:3300', // Frontend URL
    credentials: true,
  }),
)
app.use(bodyParser.json())
app.use(cookieParser())

// --- API ROUTES ---
app.use('/api/auth', authRoutes)
app.use('/api/sokoban', sokobanRoutes)
app.use('/api/onslaught', onslaughtArenaRoutes)
app.use('/api/racer', racerRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

// --- FALLBACK TO RACER ENTRYPOINT (HTML) ---
app.get('/racer', (req, res) => {
  res.sendFile(path.join(__dirname, 'javascript-racer', 'v4.final.html'))
})

// --- START SERVER ---
const PORT = 5059
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
