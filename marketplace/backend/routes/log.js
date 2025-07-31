const express = require('express')
const router = express.Router()
const db = require('../db')

// POST /api/log/event
router.post('/event', async (req, res) => {
  const userId = req.cookies.userId
  const { game, eventType, eventDetail, coinsEarned = 0 } = req.body

  if (!userId || !game || !eventType) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    await db.query(
      `INSERT INTO GameEvents (user_id, game, event_type, event_detail, coins_earned) VALUES (?, ?, ?, ?, ?)`,
      [userId, game, eventType, eventDetail, coinsEarned],
    )
    res.json({ success: true })
  } catch (err) {
    console.error('Failed to log game event:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

module.exports = router
