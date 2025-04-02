import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token');
      if (token) {
        try {
          // Set default auth header for API calls
          axios.defaults.headers.Authorization = `Bearer ${token}`;
          
          // You can validate the token with a backend call if needed
          // const { data } = await axios.get('/api/user');
          // setUser(data);
          
          // For demo purposes, we'll just use the token data
          setUser({ token });
        } catch (error) {
          Cookies.remove('token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    
    loadUserFromCookies();
  }, []);

  const login = async (email, password) => {
    try {
      // For demo purposes, we're not making a real API call
      // In production, replace with actual API call
      // const { data } = await axios.post('/api/login', { email, password });
      
      // Demo login logic
      if (email === 'admin@example.com' && password === 'password') {
        const token = 'demo-token-' + Math.random().toString(36).substring(2);
        Cookies.set('token', token, { expires: 7 });
        axios.defaults.headers.Authorization = `Bearer ${token}`;
        setUser({ email, token });
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    delete axios.defaults.headers.Authorization;
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 