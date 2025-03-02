import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Marketplace from './components/Marketplace';
import Games from './components/Games';
import { FaHome, FaCoins, FaSignInAlt } from 'react-icons/fa';
import { GiAk47U } from "react-icons/gi";

import './App.css';

const App = () => {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignUp, setSignUp] = useState(false);

  const toggleLogin = () => {
    setLoginOpen(!isLoginOpen);
    setSignUp(false); // Reset to Login form when pop-up is opened
  };

  const toggleSignUp = () => {
    setSignUp(!isSignUp);
  };

  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo">
              Gamer's Legion
            </Link>
            <ul className="navbar-menu">
              <li>
                <Link to="/" className="navbar-link">
                <FaHome /> Home
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="navbar-link">
                <FaCoins /> Marketplace
                </Link>
              </li>
              <li>
                <Link to="/games" className="navbar-link">
                <GiAk47U /> Games
                </Link>
              </li>
              <li>
                <Link to="#" className="navbar-link" onClick={toggleLogin}>
                <FaSignInAlt /> Login
                </Link>
              </li>
            </ul>
          </div>
        </nav>

      {/* Login/Sign Up Pop-up */}
        {isLoginOpen && (
          <div className="login-popup">
            <div className="login-content">
              <h2>{isSignUp ? 'Create an Account' : 'Welcome Back!'}</h2>
              <form>
                {isSignUp && <input type="text" placeholder="Full Name" required />}
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
              </form>
              <p>
                {isSignUp ? 'Already have an account? ' : 'Don’t have an account? '}
                <button className="signup-toggle" onClick={toggleSignUp}>
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </p>
              <button className="close-popup" onClick={toggleLogin}>
                &times;
              </button>
            </div>
          </div>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/games" element={<Games />} />
        </Routes>

        <footer className="footer">
          <p>© 2025 Gamer's Legion. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;