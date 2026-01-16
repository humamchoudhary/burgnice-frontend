import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { authAPI, setAuthToken, clearAuth, cartAPI } from "@/services/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  loyaltyPoints: number;
  name?: string;
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
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  syncCartAfterLogin: () => Promise<void>;
  fetchCart: () => Promise<void>;
  loading: boolean;

  addToCart: (item: CartItem) => void;
  updateCartItem: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
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

  // Calculate cart metrics whenever cart changes
  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = cart.reduce((sum, item) => sum + item.total, 0);

    setCartCount(count);
    setCartTotal(total);
  }, [cart]);

  // Calculate cart metrics
  const calculateCartMetrics = (cartItems: CartItem[]) => {
    const count = cartItems.reduce((sum, item) => {
      return sum + item.quantity;
    }, 0);
    const total = cartItems.reduce((sum, item) => sum + item.total, 0);
    return { count, total };
  };

  // Fetch user cart from backend
  const fetchCart = async () => {
    if (!user) return;

    try {
      const response = await cartAPI.getCart();
      setCart(response);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  // Get guest cart from sessionStorage
  const getGuestCart = (): CartItem[] => {
    const cartJson = sessionStorage.getItem("cart");
    if (!cartJson) return [];

    try {
      return JSON.parse(cartJson);
    } catch (error) {
      console.error("Error parsing guest cart:", error);
      return [];
    }
  };

  // Sync guest cart to backend after login
  const syncCartAfterLogin = async () => {
    const guestCart = getGuestCart();

    try {
      if (guestCart.length === 0) {
        await fetchCart();
        return;
      }

      const response = await cartAPI.syncCart(
        guestCart.map((item) => ({
          menuItemId: item.menuItem._id,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
      );

      setCart(response.cart);
      sessionStorage.removeItem("cart");
    } catch (error) {
      console.error("Failed to sync cart:", error);
    }
  };

  const persistCart = async (updatedCart: CartItem[]) => {
    setCart(updatedCart);

    if (user) {
      // Persist to backend
      await cartAPI.syncCart(
        updatedCart.map((item) => ({
          menuItemId: item.menuItem._id,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
      );
    } else {
      // Persist to sessionStorage
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const addToCart = async (newItem: CartItem) => {
    if (user) {
      console.log("Add to cart:", newItem);
      const resp = await cartAPI.addToCart(
        newItem.menuItem._id,
        newItem.quantity,
      );
      setCart(resp.cart);
    } else {
      const existingItem = cart.find(
        (item) =>
          item.menuItem._id === newItem.menuItem._id &&
          JSON.stringify(item.customizations) ===
            JSON.stringify(newItem.customizations),
      );

      let updatedCart: CartItem[];

      if (existingItem) {
        updatedCart = cart.map((item) =>
          item === existingItem
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item,
        );
      } else {
        updatedCart = [...cart, newItem];
      }
      console.log("Updated Cart", updatedCart);
      await persistCart(updatedCart);
    }
  };

  const updateCartItem = async (id: string, qty: number) => {
    if (user) {
      if (qty <= 0) {
        await removeFromCart(id);
        return;
      } else {
        const resp = await cartAPI.updateCartItem(id, qty);
        setCart(resp.cart);
      }
    } else {
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item,
      );
      await persistCart(updatedCart);
    }
  };

  const removeFromCart = async (id: string) => {
    if (user) {
      const resp = await cartAPI.removeFromCart(id);
      console.log(resp);
      setCart(resp.cart);
    } else {
      const updatedCart = cart.filter((item) => item.id !== id);
      await persistCart(updatedCart);
    }
  };

  const clearCart = async () => {
    setCart([]);

    if (user) {
      await cartAPI.clearCart();
    } else {
      sessionStorage.removeItem("cart");
    }
  };

  // Initialize auth and cart
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // Step 1: Hydrate cart immediately from sessionStorage (guest cart)
      const guestCart = getGuestCart();
      setCart(guestCart);

      if (token && storedUser) {
        setAuthToken(token);
        setUser(JSON.parse(storedUser));

        // Step 2: Fetch backend cart and overwrite guest cart
        try {
          const backendCart = await cartAPI.getCart();
          setCart(backendCart);
        } catch (error) {
          console.error("Failed to fetch cart on init:", error);
        }
      }

      setLoading(false);
    };

    init();
  }, []);

  const fetchProfileAndCart = async () => {
    try {
      const profileData = await authAPI.getProfile();
      const userObj = profileData.user || profileData;

      if (!userObj || !userObj.id) {
        throw new Error("Invalid user data received");
      }

      setUser(userObj);
      localStorage.setItem("user", JSON.stringify(userObj));
      await fetchCart();
    } catch (error) {
      console.error("Failed to fetch profile/cart:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchCartFromBackend = async () => {
    try {
      const cart = await cartAPI.getCart();
      console.log("Auth Cart", cart);
      return cart;
    } catch (error) {
      console.error("Error fetching cart:", error);
      return { cart: [] };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);

      const userObj = response.user || response;
      const token = response.token;

      if (!userObj || !token) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userObj));
      setAuthToken(token);
      setUser(userObj);

      toast.success("Login successful!");
      await syncCartAfterLogin();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    try {
      setLoading(true);
      const response = await authAPI.register({
        username,
        email,
        password,
      });

      const userObj = response.user || response;
      const token = response.token;

      if (!userObj || !token) {
        throw new Error("Invalid registration response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userObj));
      setAuthToken(token);
      setUser(userObj);

      toast.success("Registration successful!");
      await syncCartAfterLogin();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    localStorage.removeItem("user");
    sessionStorage.removeItem("cart");
    setUser(null);
    setCart([]);
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
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
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
