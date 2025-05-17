import { createContext, useContext, useState } from 'react';
import api from '../services/api'; // Import your Axios instance

// Create the UserContext
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// UserProvider component to wrap the app and provide user data
export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null); // Default is null until login
  const [error, setError] = useState('');

  // Login function to authenticate and set userId
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials); // Call login API
      setUserId(response.data.userId); // Set the userId from the response
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid username or password'); // Set error message
    }
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, login, error }}>
      {children}
    </UserContext.Provider>
  );
};