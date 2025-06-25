import React from 'react'

const Games = () => {
  return (
    <div className='page-content'>
      <h1>Games</h1>
      <p>Play our exciting game below:</p>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem',
          width: '140%',
          marginLeft: '-20%',
        }}
      >
        <iframe
          src='http://localhost:5059/sokoban'
          title='Sokoban Game'
        ></iframe>
      </div>
    </div>
  )
}

export default Games
