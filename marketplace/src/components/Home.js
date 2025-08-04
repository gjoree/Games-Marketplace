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
            Welcome back!{' '}
          </p>
          <p className='text-md text-gray-700 text-center mb-4'>
            {' '}
            In the latest update, we added new features to enhance your gaming
            experience. We added coins rewards for completing levels in games
            like Sokoban and Racer, and improved the Marketplace with new items
            and upgrades.{' '}
          </p>
          <p className='text-md text-gray-700 text-center mb-4'>
            Check out the latest upgrades available for purchase! Already
            existing players progress was reset and were awarded with 1000 coins
            to get you started!{' '}
          </p>
          <p className='text-md text-gray-700 text-center mb-4'>
            The goal of this new release is to see who is going to be the first
            to reach the 50th wave of Onslaught Arena! and become the ultimate
            champion of Gamer's Legion! Get rewarded with coins for your
            achievements in all the games and use them to upgrade your stats in
            the Marketplace.{' '}
          </p>
          <p className='text-md text-gray-700 text-center mb-4'>
            {' '}
            For the winner, we have a special prize: a unique trophy that will
            be displayed on your profile! Good luck and have fun! May the best
            gamer win!
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
