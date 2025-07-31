import useAuthUser from '../hooks/useAuthUser'

const Games = () => {
  const { user } = useAuthUser()
  const games = [
    {
      id: 'sokoban',
      title: 'Sokoban',
      thumbnail:
        'https://play-lh.googleusercontent.com/IVTpt37tHBQ5u7SOzD4y7OCipsq2xRkDv1h-qYKO_Mab_MLFsPFOXpuVJpjfATyMDRQ=w526-h296-rw',
      url: `${process.env.REACT_APP_API}/sokoban`,
    },
    {
      id: 'racer',
      title: 'Top Racer',
      thumbnail: 'https://img.youtube.com/vi/Y92aG3YagXU/hqdefault.jpg',
      url: `${process.env.REACT_APP_API}/racer/v4.final.html`,
    },
    {
      id: 'onslaught',
      title: 'Onslaught Arena',
      thumbnail: 'https://www.typinggames.zone/web/game-thumbnails/arena2.png',
      url: `${process.env.REACT_APP_API}/onslaught-arena`,
    },
  ]

  const handleThumbnailClick = (url) => {
    // Redirect in the current tab:
    window.location.href = url
  }

  return (
    <div className='page-content'>
      {user ? (
        <>
          <h1 className='text-4xl md:text-5xl font-bold text-center mt-0 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea]'>
            Games
          </h1>
          <p className='text-lg text-gray-600 text-center mb-12'>
            Click on a game to play:
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginTop: '2rem',
            }}
          >
            {games.map((game) => (
              <div
                key={game.id}
                style={{ textAlign: 'center', cursor: 'pointer' }}
                onClick={() => handleThumbnailClick(game.url)}
              >
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  style={{ width: '300px', height: '200px' }}
                />
                <p>{game.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h1 className='text-4xl md:text-5xl font-bold text-center mt-0 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea]'>
            Games
          </h1>
          <p>
            Discover the amazing games we have to offer by logging in or signing
            up.
          </p>
        </>
      )}
    </div>
  )
}

export default Games
