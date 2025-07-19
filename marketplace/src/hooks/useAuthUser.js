import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useAuthUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/auth/me`,
          {
            withCredentials: true,
          },
        )
        setUser(res.data.user)
      } catch (err) {
        setUser(null) // Not logged in
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}
