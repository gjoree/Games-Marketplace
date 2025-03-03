import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is already logged in (e.g., on page refresh)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sign-up function
  const signup = async (username, email, password) => {
    const data = await auth.signup(username, email, password);
    setUser(data);
  };

  // Login function
  const login = async (email, password) => {
    const data = await auth.login(email, password);
    setUser(data);
  };

  // Logout function
  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);