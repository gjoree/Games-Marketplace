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
            Compete for the top spots on the leaderboard! The 3 best players of
            each game are awarded coins: 300 for 1st, 200 for 2nd, and 100 for
            3rd place. Update your stats to climb higher and earn more rewards!
          </p>
          <ul className='text-md text-gray-700 text-center mb-12 list-disc list-inside'>
            <li>Sokoban: Earn coins for passing each level.</li>
            <li>Top Racer: Get coins when you beat your best lap time.</li>
            <li>Onslaught Arena: Receive coins for passing each wave.</li>
          </ul>
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
