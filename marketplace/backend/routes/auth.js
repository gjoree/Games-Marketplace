const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../db')
const router = express.Router()

// Sign-up
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
    )

    const [newUser] = await pool.query(
      'SELECT * FROM Users WHERE user_id = ?',
      [result.insertId],
    )

    res.json(newUser[0])
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Login
const ONE_DAY = 24 * 60 * 60 * 1000 // 1 day in milliseconds

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    console.log('🔐 POST /api/auth/login called')
    const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [
      email,
    ])

    if (user.length === 0) {
      return res.status(400).json('Invalid credentials')
    }

    const validPassword = await bcrypt.compare(password, user[0].password)
    if (!validPassword) {
      return res.status(400).json('Invalid credentials')
    }

    const userId = user[0].user_id

    // Set user_id as a cookie
    res.cookie('userId', userId, {
      httpOnly: true, // Cannot be accessed via JS (prevents XSS)
      secure: false, // Set to true if using HTTPS
      sameSite: 'lax', // Lax or strict or none
      maxAge: ONE_DAY, // Cookie expiration
    })

    res.json({ message: 'Login successful' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

router.post('/logout', (req, res) => {
  res.clearCookie('userId', {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: 'lax',
  })
  res.json({ message: 'Logged out successfully' })
})

router.get('/me', async (req, res) => {
  const userId = req.cookies.userId
  if (!userId) {
    return res.status(401).json({ message: 'Not logged in' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT user_id, email FROM Users WHERE user_id = ?',
      [userId],
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({ user: rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server error')
  }
})

module.exports = router
