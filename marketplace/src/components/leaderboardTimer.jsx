import React, { useEffect, useState } from 'react'

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date()
      const nextMidnight = new Date()
      nextMidnight.setHours(24, 0, 0, 0) // today at 00:00 of the next day

      const diff = nextMidnight - now

      const hours = String(Math.floor(diff / 1000 / 60 / 60)).padStart(2, '0')
      const minutes = String(Math.floor((diff / 1000 / 60) % 60)).padStart(
        2,
        '0',
      )
      const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, '0')

      setTimeLeft(`${hours}:${minutes}:${seconds}`)
    }

    updateTimer() // initial call
    const interval = setInterval(updateTimer, 1000) // update every second

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='daily-reward-timer'>
      <strong>Next daily reward in:</strong> {timeLeft}
    </div>
  )
}

export default CountdownTimer
