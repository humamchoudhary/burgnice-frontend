import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { authAPI, setAuthToken, clearAuth, cartAPI } from '@/services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  loyaltyPoints: number;
  name?: string; // Add optional name field
}

interface CartItem {
  id: string;
  menuItem: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  quantity: number;
  customizations: Record<string, string>;
  addedAt: string;
  total: number;
}

interface AuthContextType {
  user: User | null;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  syncCartAfterLogin: () => Promise<void>;
  fetchCart: () => Promise<void>;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Calculate cart metrics
  const calculateCartMetrics = (cartItems: CartItem[]) => {
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const total = cartItems.reduce((sum, item) => sum + item.total, 0);
    return { count, total };
  };

  // Fetch user cart from backend
  const fetchCart = async () => {
    try {
      if (!user) return;
      
      const response = await fetchCartFromBackend();
      setCart(response.cart || []);
      const { count, total } = calculateCartMetrics(response.cart || []);
      setCartCount(count);
      setCartTotal(total);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  // Get guest cart from sessionStorage
  const getGuestCart = (): CartItem[] => {
    const cartJson = sessionStorage.getItem('cart');
    if (!cartJson) return [];
    
    try {
      return JSON.parse(cartJson);
    } catch (error) {
      console.error('Error parsing guest cart:', error);
      return [];
    }
  };

  // Sync guest cart to backend after login
  const syncCartAfterLogin = async () => {
    try {
      const guestCart = getGuestCart();
      if (guestCart.length === 0) return;
      
      // Convert guest cart format to backend format
      const cartItems = guestCart.map((item: any) => ({
        menuItemId: item.id,
        quantity: item.quantity,
        customizations: item.customizations || {},
        addedAt: item.addedAt || new Date().toISOString()
      }));
      
      // Call backend sync endpoint
      const response = await cartAPI.syncCart(cartItems);
      
      if (response && response.cart) {
        setCart(response.cart);
        const { count, total } = calculateCartMetrics(response.cart);
        setCartCount(count);
        setCartTotal(total);
      }
      
      // Clear guest cart
      sessionStorage.removeItem('cart');
      window.dispatchEvent(new Event('cart-updated'));
      
      toast.success(`Synced ${guestCart.length} items from guest cart!`);
    } catch (error) {
      console.error('Error syncing cart after login:', error);
      toast.error('Failed to sync cart items');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        setAuthToken(token);
        // Parse the stored user (it might be nested or flat)
        const parsedUser = JSON.parse(storedUser);
        // Handle both nested (user.user) and flat (user) structures
        const userObj = parsedUser.user || parsedUser;
        setUser(userObj);
        
        // Fetch user profile and cart
        await fetchProfileAndCart();
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const fetchProfileAndCart = async () => {
    try {
      // Fetch user profile
      const profileData = await authAPI.getProfile();
      
      // Handle both nested and flat response structures
      const userObj = profileData.user || profileData;
      if (!userObj || !userObj.id) {
        throw new Error('Invalid user data received');
      }
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      // Fetch cart separately since authAPI doesn't return cart
      await fetchCart();
    } catch (error) {
      console.error('Failed to fetch profile/cart:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Helper to fetch cart from backend
  const fetchCartFromBackend = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { cart: [] };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      // Handle both nested and flat response structures
      const userObj = response.user || response;
      const token = response.token;
      
      if (!userObj || !token) {
        throw new Error('Invalid login response');
      }
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      // Set auth token globally
      setAuthToken(token);
      
      // Set user state
      setUser(userObj);
      
      toast.success('Login successful!');
      
      // Sync guest cart after successful login
      await syncCartAfterLogin();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.register({
        username,
        email,
        password
      });
      
      // Handle both nested and flat response structures
      const userObj = response.user || response;
      const token = response.token;
      
      if (!userObj || !token) {
        throw new Error('Invalid registration response');
      }
      
      // Store token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      // Set auth token globally
      setAuthToken(token);
      
      // Set user state
      setUser(userObj);
      
      toast.success('Registration successful!');
      
      // Sync guest cart after successful registration
      await syncCartAfterLogin();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem('user');
    sessionStorage.removeItem('cart');
    setUser(null);
    setCart([]);
    setCartCount(0);
    setCartTotal(0);
    toast.success('Logged out successfully');
  };

  // Listen for cart updates from other components
  useEffect(() => {
    const handleCartUpdate = () => {
      if (user) {
        fetchCart();
      } else {
        // For guest users, update from sessionStorage
        const guestCart = getGuestCart();
        setCart(guestCart);
        const { count, total } = calculateCartMetrics(guestCart);
        setCartCount(count);
        setCartTotal(total);
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      cart,
      cartCount,
      cartTotal,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      syncCartAfterLogin,
      fetchCart,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};