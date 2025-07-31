import React, { useEffect, useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import CountdownTimer from './leaderboardTimer'

const Leaderboard = () => {
  const { user } = useAuthUser()
  const [leaderboard, setLeaderboard] = useState({})

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API}/api/leaderboard`,
          {
            credentials: 'include',
          },
        )
        const data = await res.json()
        setLeaderboard(data)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
      }
    }

    fetchLeaderboard()
  }, [])

  const gameNames = {
    sokoban: 'Sokoban',
    racer: 'Top Racer',
    arena: 'Arena Onslaught!',
  }

  const formatStat = (game, stat) => {
    if (game === 'sokoban') {
      return Number(stat) + 1
    } else if (game === 'racer') {
      const totalSeconds = Number(stat)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = (totalSeconds % 60).toFixed(2).padStart(5, '0')
      return `${minutes}:${seconds}`
    } else {
      return stat
    }
  }

  const getStatLabel = (game) => {
    if (game === 'sokoban') return 'Level'
    if (game === 'racer') return 'Best Lap (s)'
    return 'High Score'
  }

  return (
    <div className='min-h-screen bg-white text-gray-900 font-sans pt-16'>
      {user ? (
        <>
          <div className='container mx-auto px-4 py-12'>
            <h1
              className='text-4xl md:text-5xl font-bold text-center pt-12 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea] leading-tight z-10'
              style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
            >
              Gamer's Legion Leaderboard
            </h1>
            <p className='text-lg text-gray-600 text-center mb-12'>
              Celebrate the top players in our gaming universe!
            </p>
            <CountdownTimer />
            <div className='grid gap-12 md:grid-cols-3'>
              {['sokoban', 'racer', 'arena'].map((game) => (
                <div
                  key={game}
                  className='leaderboard-section bg-gray-100 rounded-xl p-6 shadow-lg'
                >
                  <h2 className='text-2xl font-semibold text-center mb-6 text-[#6200ea]'>
                    {gameNames[game]} Top Players
                  </h2>
                  <div className='podium-container flex justify-center items-end space-x-4'>
                    {leaderboard[game]?.slice(0, 3).map((player, index) => (
                      <div
                        key={player.username}
                        className={`podium-step flex flex-col items-center justify-end w-1/3 ${
                          index === 0 ? 'h-48' : index === 1 ? 'h-36' : 'h-24'
                        } ${
                          index === 0
                            ? 'bg-[#6200ea]'
                            : index === 1
                            ? 'bg-gray-300'
                            : 'bg-gray-400'
                        } rounded-t-lg shadow-md`}
                      >
                        <div className='text-center pt-4'>
                          <span className='text-lg md:text-xl font-bold block'>
                            {index + 1}º
                          </span>
                          <span className='text-base md:text-lg font-medium block'>
                            {player.username}
                          </span>
                          <div className='mt-2 p-2 bg-white rounded'>
                            <p className='text-sm text-gray-600'>
                              {getStatLabel(game)}:{' '}
                              <span className='font-bold'>
                                {formatStat(game, player.stat)}
                              </span>
                            </p>
                            <p className='text-sm text-gray-600'>
                              Rank:{' '}
                              <span className='font-bold'>{index + 1}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className='container mx-auto px-4 py-12'>
          <h1
            className='text-4xl md:text-5xl font-bold text-center pt-12 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea] leading-tight z-10'
            style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
          >
            Gamer's Legion Leaderboard
          </h1>
          <p className='text-lg text-gray-600 text-center mb-12'>
            Celebrate the top players in our gaming universe!
          </p>
          <p className='text-center text-gray-700'>
            Please log in to view the leaderboard and see how you rank against
            other players.
          </p>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
