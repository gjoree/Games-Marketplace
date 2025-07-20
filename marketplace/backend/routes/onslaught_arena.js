const express = require('express')
const router = express.Router()
const db = require('../db')

const validColumns = [
  'checkpoint_wave',
  'checkpoint_hero',
  'high_score',
  'h_sword_killed',
  'h_axe_killed',
  'h_fireball_killed',
  'overall_killed',
]

// GET current progress
router.get('/progress', async (req, res) => {
  const userId = req.cookies.userId
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const [rows] = await db.query(
    `SELECT ${validColumns.join(', ')} FROM GameProgress WHERE user_id = ?`,
    [userId],
  )

  res.json(rows[0] || {})
})

// POST: Save one or more keys dynamically
router.post('/save-progress', async (req, res) => {
  const userId = req.cookies.userId
  if (!userId) return res.status(401).json({ error: 'Unauthorized' })

  const data = req.body

  // Only accept whitelisted fields
  const validColumns = [
    'checkpoint_wave',
    'checkpoint_hero',
    'high_score',
    'h_sword_killed',
    'h_axe_killed',
    'h_fireball_killed',
    'overall_killed',
  ]

  const keys = Object.keys(data).filter((key) => validColumns.includes(key))
  if (keys.length === 0) {
    return res.status(400).json({ error: 'No valid keys provided' })
  }

  const fields = ['user_id', ...keys]
  const values = [
    userId,
    ...keys.map((k) =>
      k === 'checkpoint_hero' ? JSON.stringify(data[k]) : data[k],
    ),
  ]
  const placeholders = fields.map(() => '?').join(', ')

  // Handle per-field logic
  const updates = keys
    .map((k) => {
      if (k === 'high_score') {
        return `${k} = GREATEST(VALUES(${k}), ${k})`
      } else if (k === 'checkpoint_hero' || k === 'checkpoint_wave') {
        return `${k} = VALUES(${k})`
      } else {
        return `${k} = IFNULL(${k}, 0) + VALUES(${k})`
      }
    })
    .join(', ')

  try {
    await db.query(
      `
      INSERT INTO GameProgress (${fields.join(', ')})
      VALUES (${placeholders})
      ON DUPLICATE KEY UPDATE ${updates}
    `,
      values,
    )

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error:
        'Failed to save progress because table does not exist, which is expected.',
    })
  }
})

// POST: Clear specific key
router.post('/clear-progress', async (req, res) => {
  const userId = req.cookies.userId
  const { key } = req.body

  if (!userId || !key) {
    return res.status(400).json({ error: 'Missing userId or key' })
  }

  if (!validColumns.includes(key)) {
    return res.status(400).json({ error: 'Invalid key' })
  }

  try {
    await db.query(`UPDATE GameProgress SET ${key} = NULL WHERE user_id = ?`, [
      userId,
    ])
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to clear progress' })
  }
})

module.exports = router
