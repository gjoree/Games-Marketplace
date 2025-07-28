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

router.get('/upgrades', async (req, res) => {
  const userId = req.cookies.userId

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Fetch upgrades
    let [rows] = await db.query(
      `SELECT 
        hero_health_level,
        hero_speed_level,
        sword_firingRate_level,
        sword_speed_level,
        sword_damage_level,
        knife_firingRate_level,
        knife_speed_level,
        knife_damage_level,
        spear_firingRate_level,
        spear_speed_level,
        spear_damage_level,
        fireball_firingRate_level,
        fireball_speed_level,
        fireball_damage_level,
        axe_firingRate_level,
        axe_speed_level,
        axe_damage_level,
        fire_sword_firingRate_level,
        fire_sword_speed_level,
        fire_sword_damage_level,
        fire_knife_firingRate_level,
        fire_knife_speed_level,
        fire_knife_damage_level,
        firebomb_firingRate_level,
        firebomb_speed_level,
        firebomb_damage_level
      FROM UserUpgrades
      WHERE user_id = ?`,
      [userId],
    )

    // If no upgrades exist, create default entry
    if (rows.length === 0) {
      await db.query(
        `INSERT INTO UserUpgrades (
          user_id,
          hero_health_level,
          hero_speed_level,
          sword_firingRate_level,
          sword_speed_level,
          sword_damage_level,
          knife_firingRate_level,
          knife_speed_level,
          knife_damage_level,
          spear_firingRate_level,
          spear_speed_level,
          spear_damage_level,
          fireball_firingRate_level,
          fireball_speed_level,
          fireball_damage_level,
          axe_firingRate_level,
          axe_speed_level,
          axe_damage_level,
          fire_sword_firingRate_level,
          fire_sword_speed_level,
          fire_sword_damage_level,
          fire_knife_firingRate_level,
          fire_knife_speed_level,
          fire_knife_damage_level,
          firebomb_firingRate_level,
          firebomb_speed_level,
          firebomb_damage_level
        ) VALUES (?, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1)`,
        [userId],
      )

      const [newRows] = await db.query(
        `SELECT * FROM UserUpgrades WHERE user_id = ?`,
        [userId],
      )
      rows = newRows
    }

    const row = rows[0]

    // Fetch coin balance
    const [[user]] = await db.query(
      `SELECT coins FROM Users WHERE user_id = ?`,
      [userId],
    )

    // Map DB upgrades to FE keys
    const upgradeData = {
      coins: user?.coins ?? 0,
      upgrades: {
        'hero.health': row.hero_health_level,
        'hero.speed': row.hero_speed_level,

        'sword.firingRate': row.sword_firingRate_level,
        'sword.speed': row.sword_speed_level,
        'sword.damage': row.sword_damage_level,

        'knife.firingRate': row.knife_firingRate_level,
        'knife.speed': row.knife_speed_level,
        'knife.damage': row.knife_damage_level,

        'spear.firingRate': row.spear_firingRate_level,
        'spear.speed': row.spear_speed_level,
        'spear.damage': row.spear_damage_level,

        'fireball.firingRate': row.fireball_firingRate_level,
        'fireball.speed': row.fireball_speed_level,
        'fireball.damage': row.fireball_damage_level,

        'axe.firingRate': row.axe_firingRate_level,
        'axe.speed': row.axe_speed_level,
        'axe.damage': row.axe_damage_level,

        'fire_sword.firingRate': row.fire_sword_firingRate_level,
        'fire_sword.speed': row.fire_sword_speed_level,
        'fire_sword.damage': row.fire_sword_damage_level,

        'fire_knife.firingRate': row.fire_knife_firingRate_level,
        'fire_knife.speed': row.fire_knife_speed_level,
        'fire_knife.damage': row.fire_knife_damage_level,

        'firebomb.firingRate': row.firebomb_firingRate_level,
        'firebomb.speed': row.firebomb_speed_level,
        'firebomb.damage': row.firebomb_damage_level,
      },
    }

    res.json(upgradeData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

// POST: Upgrade a specific stat (e.g., hero_health, h_sword_damage)
router.post('/upgrade', async (req, res) => {
  const userId = req.cookies.userId
  const { statKey } = req.body

  if (!userId || !statKey) {
    return res.status(400).json({ error: 'Missing userId or statKey' })
  }

  // Upgrade config
  //TODO: make costPerLevel dynamic based on level
  const upgradeConfig = {
    hero_health: { maxLevel: 6, costPerLevel: 100 },
    hero_speed: { maxLevel: 8, costPerLevel: 100 },
    sword_damage: { maxLevel: 6, costPerLevel: 100 },
    sword_speed: { maxLevel: 11, costPerLevel: 100 },
    sword_firingRate: { maxLevel: 21, costPerLevel: 100 },
    knife_damage: { maxLevel: 3, costPerLevel: 100 },
    knife_speed: { maxLevel: 11, costPerLevel: 100 },
    knife_firingRate: { maxLevel: 11, costPerLevel: 100 },
    spear_damage: { maxLevel: 6, costPerLevel: 100 },
    spear_speed: { maxLevel: 21, costPerLevel: 100 },
    spear_firingRate: { maxLevel: 11, costPerLevel: 100 },
    fireball_damage: { maxLevel: 4, costPerLevel: 100 },
    fireball_speed: { maxLevel: 11, costPerLevel: 100 },
    fireball_firingRate: { maxLevel: 11, costPerLevel: 100 },
    axe_damage: { maxLevel: 6, costPerLevel: 100 },
    axe_speed: { maxLevel: 11, costPerLevel: 100 },
    axe_firingRate: { maxLevel: 11, costPerLevel: 100 },
    fire_sword_damage: { maxLevel: 6, costPerLevel: 100 },
    fire_sword_speed: { maxLevel: 11, costPerLevel: 100 },
    fire_sword_firingRate: { maxLevel: 11, costPerLevel: 100 },
    fire_knife_damage: { maxLevel: 6, costPerLevel: 100 },
    fire_knife_speed: { maxLevel: 11, costPerLevel: 100 },
    fire_knife_firingRate: { maxLevel: 11, costPerLevel: 100 },
    firebomb_damage: { maxLevel: 3, costPerLevel: 100 },
    firebomb_speed: { maxLevel: 11, costPerLevel: 100 },
    firebomb_firingRate: { maxLevel: 11, costPerLevel: 100 },
  }

  const config = upgradeConfig[statKey]
  if (!config) {
    return res.status(400).json({ error: 'Invalid stat key' })
  }

  try {
    // Get current coin balance and stat level
    const [[user]] = await db.query(
      `SELECT coins FROM Users WHERE user_id = ?`,
      [userId],
    )
    const [[progress]] = await db.query(
      `SELECT ${statKey}_level FROM UserUpgrades WHERE user_id = ?`,
      [userId],
    )

    if (!user) return res.status(404).json({ error: 'User not found' })

    const currentLevel = progress?.[`${statKey}_level`] || 1

    if (currentLevel >= config.maxLevel) {
      return res.status(400).json({ error: 'Stat is already maxed out' })
    }

    if (user.coins < config.costPerLevel) {
      return res.status(400).json({ error: 'Not enough coins' })
    }

    // Upgrade: deduct coins + increment level
    await db.query(`UPDATE Users SET coins = coins - ? WHERE user_id = ?`, [
      config.costPerLevel,
      userId,
    ])
    await db.query(
      `INSERT INTO UserUpgrades (user_id, ${statKey}_level)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE ${statKey}_level = ${statKey}_level + 1`,
      [userId, currentLevel + 1],
    )

    const [[updatedUser]] = await db.query(
      `SELECT coins FROM Users WHERE user_id = ?`,
      [userId],
    )
    const [[updatedUpgrades]] = await db.query(
      `SELECT * FROM UserUpgrades WHERE user_id = ?`,
      [userId],
    )

    res.json({
      success: true,
      coins: updatedUser.coins,
      upgrades: updatedUpgrades,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to upgrade stat' })
  }
})

// Add coins to user's account
router.post('/reward-coins', async (req, res) => {
  const userId = req.cookies.userId
  const { coins } = req.body

  if (!userId || typeof coins !== 'number' || coins <= 0) {
    return res.status(400).json({ error: 'Missing or invalid userId/coins' })
  }

  try {
    await db.query(`UPDATE Users SET coins = coins + ? WHERE user_id = ?`, [
      coins,
      userId,
    ])

    const [[user]] = await db.query(
      `SELECT coins FROM Users WHERE user_id = ?`,
      [userId],
    )

    res.json({ success: true, coins: user.coins })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to update coins' })
  }
})

module.exports = router
