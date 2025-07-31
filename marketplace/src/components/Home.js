import useAuthUser from '../hooks/useAuthUser'

const Home = () => {
  const { user } = useAuthUser()
  return (
    <div className='page-content'>
      {user ? (
        <>
          <h1 className='text-4xl md:text-5xl font-bold text-center mt-0 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea]'>
            Welcome to Gamer's Legion
          </h1>
          <p className='text-lg text-gray-600 text-center mb-6'>
            Be sure to play our games and check out the Marketplace for awesome
            upgrades of stats!
          </p>
          <p className='text-md text-gray-700 text-center mb-4'>
            For this demo and trial version, please dedicate some time,
            approximately an hour to each game, to experience the games and
            provide feedback if possible.
          </p>
        </>
      ) : (
        <>
          <h1 className='text-4xl md:text-5xl font-bold text-center mt-0 mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-[#6200ea]'>
            Welcome to Gamer's Legion
          </h1>
          <p className='text-lg text-gray-600 text-center mb-6'>
            Explore our amazing games and checkout the Marketplace!
          </p>
        </>
      )}
    </div>
  )
}

export default Home
