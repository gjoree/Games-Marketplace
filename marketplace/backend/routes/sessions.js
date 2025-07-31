const express = require('express')
const router = express.Router()
const db = require('../db')

router.post('/start', async (req, res) => {
  const userId = req.cookies.userId
  const { game } = req.body

  if (!userId || !game)
    return res.status(400).json({ error: 'Missing userId or game name' })

  try {
    await db.query(
      'INSERT INTO GameSessions (user_id, game_name, start_time) VALUES (?, ?, NOW())',
      [userId, game],
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Failed to start session:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

router.post('/end', async (req, res) => {
  const userId = req.cookies.userId
  const { game } = req.body

  if (!userId || !game)
    return res.status(400).json({ error: 'Missing userId or game name' })

  try {
    // Update the latest session that has no end_time
    await db.query(
      `UPDATE GameSessions 
       SET end_time = NOW()
       WHERE user_id = ? AND game_name = ? AND end_time IS NULL
       ORDER BY start_time DESC
       LIMIT 1`,
      [userId, game],
    )

    res.json({ success: true })
  } catch (err) {
    console.error('Failed to end session:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

module.exports = router
