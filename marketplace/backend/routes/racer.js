const express = require('express')
const router = express.Router()
const db = require('../db')

// GET /api/racer/upgrades
router.get('/upgrades', async (req, res) => {
  const userId = req.cookies.userId
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Get coin balance
    const [[userRow]] = await db.query(
      `SELECT Coins FROM Users WHERE user_id = ?`,
      [userId],
    )
    const coins = userRow?.Coins || 0

    // Try to fetch upgrade row
    let [rows] = await db.query(
      `SELECT 
        speed_level,
        acceleration_level,
        braking_level,
        fog_density_level,
        draw_distance_level
      FROM RacerUpgrades
      WHERE user_id = ?`,
      [userId],
    )

    // If no row found, insert defaults and re-fetch
    if (rows.length === 0) {
      await db.query(
        `INSERT INTO RacerUpgrades (
          user_id, speed_level, acceleration_level, braking_level,
          fog_density_level, draw_distance_level
        ) VALUES (?, 1, 1, 1, 1, 1)`,
        [userId],
      )

      const [newRows] = await db.query(
        `SELECT 
          speed_level,
          acceleration_level,
          braking_level,
          fog_density_level,
          draw_distance_level
        FROM RacerUpgrades
        WHERE user_id = ?`,
        [userId],
      )

      rows = newRows
    }

    const upgrades = rows[0]

    res.json({
      success: true,
      coins,
      upgrades,
    })
  } catch (err) {
    console.error('Failed to fetch Racer upgrades:', err)
    res.status(500).json({ error: 'Database error' })
  }
})

// POST /api/racer/upgrade
router.post('/upgrade', async (req, res) => {
  const userId = req.cookies.userId
  const { statKey } = req.body

  if (!userId || !statKey) {
    return res.status(400).json({ error: 'Missing userId or statKey' })
  }

  // Define allowed upgrades and their configs
  const upgradeConfig = {
    speed: { column: 'speed_level', maxLevel: 6, costPerLevel: 100 },
    acceleration: {
      column: 'acceleration_level',
      maxLevel: 6,
      costPerLevel: 100,
    },
    braking: { column: 'braking_level', maxLevel: 6, costPerLevel: 100 },
    fog_density: {
      column: 'fog_density_level',
      maxLevel: 6,
      costPerLevel: 100,
    },
    draw_distance: {
      column: 'draw_distance_level',
      maxLevel: 6,
      costPerLevel: 100,
    },
  }

  const config = upgradeConfig[statKey]
  if (!config) {
    return res.status(400).json({ error: 'Invalid stat key' })
  }

  try {
    // Get current coins and stat level
    const [[user]] = await db.query(
      `SELECT coins FROM Users WHERE user_id = ?`,
      [userId],
    )
    const [[upgradeRow]] = await db.query(
      `SELECT ${config.column} FROM RacerUpgrades WHERE user_id = ?`,
      [userId],
    )

    if (!user) return res.status(404).json({ error: 'User not found' })

    const currentLevel = upgradeRow?.[config.column] || 1
    if (currentLevel >= config.maxLevel) {
      return res.status(400).json({ error: 'Stat is already maxed out' })
    }

    if (user.coins < config.costPerLevel) {
      return res.status(400).json({ error: 'Not enough coins' })
    }

    // Deduct coins
    await db.query(`UPDATE Users SET coins = coins - ? WHERE user_id = ?`, [
      config.costPerLevel,
      userId,
    ])

    // Upgrade stat
    await db.query(
      `UPDATE RacerUpgrades SET ${config.column} = ${config.column} + 1 WHERE user_id = ?`,
      [userId],
    )

    // Return updated values
    const [[updatedUser]] = await db.query(
      `SELECT coins FROM Users WHERE user_id = ?`,
      [userId],
    )
    const [[updatedUpgrades]] = await db.query(
      `SELECT 
        speed_level,
        acceleration_level,
        braking_level,
        fog_density_level,
        draw_distance_level
      FROM RacerUpgrades WHERE user_id = ?`,
      [userId],
    )

    res.json({
      success: true,
      coins: updatedUser.coins,
      upgrades: updatedUpgrades,
    })
  } catch (err) {
    console.error('Failed to upgrade Racer stat:', err)
    res.status(500).json({ error: 'Failed to upgrade stat' })
  }
})

module.exports = router
