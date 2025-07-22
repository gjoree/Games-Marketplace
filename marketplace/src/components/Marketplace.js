import { useEffect, useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'

const GAMES = [
  {
    id: 'onslaught',
    name: 'Onslaught! Arena',
    thumbnail: 'https://www.typinggames.zone/web/game-thumbnails/arena2.png',
  },
  {
    id: 'sokoban',
    name: 'Sokoban',
    thumbnail:
      'https://play-lh.googleusercontent.com/IVTpt37tHBQ5u7SOzD4y7OCipsq2xRkDv1h-qYKO_Mab_MLFsPFOXpuVJpjfATyMDRQ=w526-h296-rw',
  },
]

const UPGRADE_CATEGORIES = {
  onslaught: [
    {
      label: 'Hero',
      upgrades: [
        {
          stat: 'hero.health',
          label: 'Health',
          icon: '/images/health_icon.png',
        },
        { stat: 'hero.speed', label: 'Speed', icon: '/images/speed_icon.png' },
      ],
    },
    {
      label: 'Sword',
      upgrades: [
        {
          stat: 'sword.damage',
          label: 'Damage',
          icon: '/images/damage_icon.png',
        },
        { stat: 'sword.speed', label: 'Speed', icon: '/images/speed_icon.png' },
        {
          stat: 'sword.firingRate',
          label: 'Fire Rate',
          icon: '/images/firerate_icon.png',
        },
      ],
    },
    {
      label: 'Fireball',
      upgrades: [
        {
          stat: 'fireball.damage',
          label: 'Damage',
          icon: '/images/damage_icon.png',
        },
        {
          stat: 'fireball.speed',
          label: 'Speed',
          icon: '/images/speed_icon.png',
        },
        {
          stat: 'fireball.firingRate',
          label: 'Fire Rate',
          icon: '/images/firerate_icon.png',
        },
      ],
    },
    // Add more categories if needed
  ],
  sokoban: [
    {
      label: 'Player',
      upgrades: [
        {
          stat: 'player.pushPower',
          label: 'Push Power',
          icon: '/images/push_icon.png',
        },
        {
          stat: 'player.moveSpeed',
          label: 'Move Speed',
          icon: '/images/speed_icon.png',
        },
      ],
    },
  ],
}

const Marketplace = () => {
  const { user } = useAuthUser()
  const [selectedGame, setSelectedGame] = useState(null)
  const [upgrades, setUpgrades] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && selectedGame) {
      setLoading(true)
      fetch('/api/upgrades?game=' + selectedGame, { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          setUpgrades(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to fetch upgrades:', err)
          setLoading(false)
        })
    }
  }, [user, selectedGame])

  const handleUpgrade = async (stat) => {
    try {
      const res = await fetch('/api/upgrades/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stat, game: selectedGame }),
      })
      const data = await res.json()
      if (data.success) {
        setUpgrades((prev) => ({
          ...prev,
          [stat]: data.newLevel,
        }))
      } else {
        alert(data.error || 'Upgrade failed.')
      }
    } catch (err) {
      console.error('Upgrade failed:', err)
    }
  }

  if (!user) {
    return (
      <div className='page-content'>
        <h1>Marketplace</h1>
        <p>Discover and shop for unique items in our marketplace.</p>
      </div>
    )
  }

  return (
    <div className='page-content'>
      <h1>Welcome to the Marketplace</h1>
      {!selectedGame ? (
        <>
          <p>Select a game to upgrade stats:</p>
          <div className='game-selection'>
            {GAMES.map((game) => (
              <div
                key={game.id}
                className='game-thumbnail'
                onClick={() => setSelectedGame(game.id)}
              >
                <img src={game.thumbnail} alt={game.name} />
                <p>{game.name}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button className='back-button' onClick={() => setSelectedGame(null)}>
            ← Back to Game Selection
          </button>
          <h2>Upgrades for {GAMES.find((g) => g.id === selectedGame).name}</h2>
          {loading ? (
            <p>Loading upgrades...</p>
          ) : (
            <div className='upgrade-menu'>
              {UPGRADE_CATEGORIES[selectedGame].map((category) => (
                <div key={category.label} className='upgrade-category'>
                  <h3>{category.label}</h3>
                  <div className='upgrade-options'>
                    {category.upgrades.map((upgrade) => (
                      <div key={upgrade.stat} className='upgrade-item'>
                        <img src={upgrade.icon} alt={upgrade.label} />
                        <span>{upgrade.label}</span>
                        <p>Level: {upgrades[upgrade.stat] ?? 1}</p>
                        <button onClick={() => handleUpgrade(upgrade.stat)}>
                          Upgrade
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Marketplace
