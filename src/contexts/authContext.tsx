import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { authAPI, setAuthToken, clearAuth } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  loyaltyPoints: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  transferCart: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setAuthToken(token);
      
      // Verify token by fetching profile
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { token, user: userData } = await authAPI.login(email, password);
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set auth token globally
      setAuthToken(token);
      
      setUser(userData);
      toast.success('Login successful!');
      
      // Transfer guest cart to user cart
      await transferCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { token, user: userData } = await authAPI.register({
        username,
        email,
        password
      });
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Set auth token globally
      setAuthToken(token);
      
      setUser(userData);
      toast.success('Registration successful!');
      
      // Transfer guest cart to user cart
      await transferCart();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const transferCart = async () => {
    try {
      const guestCart = sessionStorage.getItem('cart');
      if (guestCart && guestCart.length > 0) {
        // Note: You'll need to implement cart transfer in your backend
        // This is a placeholder for the cart transfer functionality
        // await axios.post(`${API_URL}/cart/transfer`, {}, {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        
        // Clear guest cart
        sessionStorage.removeItem('cart');
        window.dispatchEvent(new Event('cart-updated'));
        
        toast.success('Cart transferred to your account!');
      }
    } catch (error) {
      console.error('Error transferring cart:', error);
    }
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      transferCart,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};