const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res) => {
  try {
    const [sokoban] = await db.query(`
      SELECT username, maxLevel_Sokoban AS stat
      FROM Users
      ORDER BY maxLevel_Sokoban DESC
      LIMIT 3
    `)

    const [racer] = await db.query(`
      SELECT u.username, rs.best_lap_time AS stat
      FROM RacerStats rs
      JOIN Users u ON rs.user_id = u.user_id
      ORDER BY rs.best_lap_time ASC
      LIMIT 3
    `)

    const [arena] = await db.query(`
      SELECT u.username, g.high_score AS stat
      FROM GameProgress g
      JOIN Users u ON g.user_id = u.user_id
      ORDER BY g.high_score DESC
      LIMIT 3
    `)

    res.json({ sokoban, racer, arena })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Leaderboard fetch error' })
  }
})

module.exports = router
