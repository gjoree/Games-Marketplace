const cron = require('node-cron')
const db = require('./db')

const rewardAmounts = [300, 200, 100]

// Runs once a day at midnight (server time)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log('🏁 Starting leaderboard rewards...')

    const games = [
      {
        name: 'sokoban',
        query:
          'SELECT user_id FROM Users ORDER BY maxLevel_Sokoban DESC LIMIT 3',
      },
      {
        name: 'racer',
        query:
          'SELECT user_id FROM RacerStats ORDER BY best_lap_time ASC LIMIT 3',
      },
      {
        name: 'arena',
        query:
          'SELECT user_id FROM GameProgress ORDER BY high_score DESC LIMIT 3',
      },
    ]

    for (const game of games) {
      const [rows] = await db.query(game.query)

      for (let i = 0; i < rows.length; i++) {
        const userId = rows[i].id || rows[i].user_id
        const coins = rewardAmounts[i]
        const today = new Date().toISOString().split('T')[0] // yyyy-mm-dd

        // Check if reward already given today
        const [log] = await db.query(
          `SELECT * FROM DailyRewardsLog WHERE user_id = ? AND game = ? AND reward_date = ?`,
          [userId, game.name, today],
        )

        if (log.length === 0) {
          // Award coins
          await db.query(
            `UPDATE Users SET coins = coins + ? WHERE user_id = ?`,
            [coins, userId],
          )

          // Log the reward
          await db.query(
            `INSERT INTO DailyRewardsLog (user_id, game, reward_amount, reward_date) VALUES (?, ?, ?, ?)`,
            [userId, game.name, coins, today],
          )

          console.log(
            `🎉 Awarded ${coins} coins to user ${userId} for ${game.name}`,
          )
        } else {
          console.log(
            `⏭ Already rewarded user ${userId} for ${game.name} today`,
          )
        }
      }
    }

    console.log('✅ Leaderboard rewards distributed')
  } catch (err) {
    console.error('❌ Error during leaderboard rewards:', err)
  }
})
