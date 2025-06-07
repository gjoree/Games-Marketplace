import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Marketplace from './components/Marketplace'
import Games from './components/Games'
import { FaHome, FaCoins, FaSignInAlt } from 'react-icons/fa'
import { GiAk47U } from 'react-icons/gi'
import { CiLogout } from 'react-icons/ci'
import axios from 'axios'

import './App.css'

const App = () => {
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignUp, setSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const toggleLogin = () => {
    setLoginOpen(!isLoginOpen)
    setSignUp(false) // Reset to Login form when pop-up is opened
    setError('') // Clear any previous errors
  }

  const toggleSignUp = () => {
    setSignUp(!isSignUp)
    setError('') // Clear any previous errors
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/auth/login`,
        { email, password },
      )
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data)) // Save user data in localStorage
        toggleLogin() // Close the pop-up
        window.location.reload() // Refresh the page to update the UI
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/auth/signup`,
        { username, email, password },
      )
      if (response.data) {
        alert('Sign-up successful! Please log in.')
        toggleSignUp() // Switch back to the Login form
      }
    } catch (err) {
      setError('Sign-up failed. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user') // Remove user data from localStorage
    window.location.reload() // Refresh the page to update the UI
  }

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <Router>
      <div className='app'>
        <nav className='navbar'>
          <div className='navbar-container'>
            <Link to='/' className='navbar-logo'>
              Gamer's Legion
            </Link>
            <ul className='navbar-menu'>
              <li>
                <Link to='/' className='navbar-link'>
                  <FaHome /> Home
                </Link>
              </li>
              <li>
                <Link to='/marketplace' className='navbar-link'>
                  <FaCoins /> Marketplace
                </Link>
              </li>
              <li>
                <Link to='/games' className='navbar-link'>
                  <GiAk47U /> Games
                </Link>
              </li>
              <li>
                {user ? (
                  <Link to='#' className='navbar-link' onClick={handleLogout}>
                    <CiLogout /> Logout
                  </Link>
                ) : (
                  <Link to='#' className='navbar-link' onClick={toggleLogin}>
                    <FaSignInAlt /> Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </nav>

        {/* Login/Sign Up Pop-up */}
        {isLoginOpen && (
          <div className='login-popup'>
            <div className='login-content'>
              <h2>{isSignUp ? 'Create an Account' : 'Welcome Back!'}</h2>
              <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                {isSignUp && (
                  <input
                    type='text'
                    placeholder='Username'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                )}
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className='error-message'>{error}</p>}
                <button type='submit'>{isSignUp ? 'Sign Up' : 'Login'}</button>
              </form>
              <p>
                {isSignUp
                  ? 'Already have an account? '
                  : 'Don’t have an account? '}
                <button className='signup-toggle' onClick={toggleSignUp}>
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </p>
              <button className='close-popup' onClick={toggleLogin}>
                &times;
              </button>
            </div>
          </div>
        )}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/marketplace' element={<Marketplace />} />
          <Route path='/games' element={<Games />} />
        </Routes>

        <footer className='footer'>
          <p>© 2025 Gamer's Legion. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
