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
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    console.log('🔐 POST /api/auth/login called')
    console.log('🧾 Request body:', req.body)
    const [user] = await pool.query('SELECT * FROM Users WHERE email = ?', [
      email,
    ])

    if (user.length === 0) {
      return res.status(400).json('Invalid credentials')
    }

    // Compare the password
    const validPassword = await bcrypt.compare(password, user[0].password)
    if (!validPassword) {
      console.log('🔐 POST /api/auth/login called')
      console.log('🧾 Request body:', req.body)
      return res.status(400).json('Invalid credentials')
    }

    const token = user[0].user_id

    res.json({ token })
  } catch (err) {
    console.log('🔐 POST /api/auth/login called')
    console.log('🧾 Request body:', req.body)
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
