import axios from 'axios'

const API_URL = `${process.env.REACT_APP_API}/api/auth`

const signup = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/signup`, {
    username,
    email,
    password,
  })
  return response.data
}

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password })
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

const logout = () => {
  localStorage.removeItem('user')
}

// eslint-disable-next-line
export default { signup, login, logout }
