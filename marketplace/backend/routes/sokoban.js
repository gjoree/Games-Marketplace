const express = require('express')
const router = express.Router()
const db = require('../db') // Your mysql2 connection

// Get current user's max level
router.get('/progress', async (req, res) => {
  console.log('Cookies:', req.cookies)
  const userId = req.cookies.userId

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const [rows] = await db.query(
      'SELECT maxLevel_Sokoban FROM Users WHERE user_id = ?',
      [userId],
    )

    if (rows.length > 0) {
      res.json({ level: rows[0].maxLevel_Sokoban })
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// Update level and coins when level is completed
router.post('/complete-level', async (req, res) => {
  const userId = req.cookies.userId // Securely get the user from cookie
  const { level } = req.body
  console.log('User ID:', userId, 'Level:', level)

  if (!userId || typeof level !== 'number') {
    return res.status(400).json({ error: 'Invalid input' })
  }

  try {
    const [rows] = await db.query(
      'SELECT maxLevel_Sokoban, Coins FROM Users WHERE user_id = ?',
      [userId],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { maxLevel_Sokoban, Coins } = rows[0]
    const newCoins = Coins + 60 // Fixed reward for completing a level
    const earnedCoins = 60 // Fixed reward for completing a level

    // Only update if it's a new level
    if (level > maxLevel_Sokoban) {
      await db.query(
        `UPDATE Users 
     SET maxLevel_Sokoban = ?, 
         Coins = ?, 
         coins_from_sokoban = coins_from_sokoban + ? 
     WHERE user_id = ?`,
        [level, newCoins, earnedCoins, userId],
      )
    }

    res.json({ success: true, newLevel: level, newCoins })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update user data' })
  }
})

// POST /api/sokoban/reset
router.post('/reset', async (req, res) => {
  const userId = req.cookies.userId
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  try {
    await db.query('UPDATE Users SET maxLevel_Sokoban = 0 WHERE user_id = ?', [
      userId,
    ])
    res.json({ success: true })
  } catch (err) {
    console.error('Failed to reset Sokoban progress:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

module.exports = router
