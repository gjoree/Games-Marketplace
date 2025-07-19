import useAuthUser from '../hooks/useAuthUser'

const Marketplace = () => {
  const { user } = useAuthUser()
  return (
    <div className='page-content'>
      {user ? (
        <>
          <h1>Welcome to the Marketplace</h1>
          <p>Explore and purchase items from our marketplace.</p>
        </>
      ) : (
        <>
          <h1>Marketplace</h1>
          <p>Discover and shop for unique items in our marketplace.</p>
        </>
      )}
    </div>
  )
}

export default Marketplace
