import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);

      if (error.response.status === 401) {
        localStorage.removeItem("token");
        // window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Network Error:", error.message);
    } else {
      console.error("Request Error:", error.message);
    }

    return Promise.reject(error);
  },
);

// Type definitions
export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  categories: (Category | string)[];
  isAvailable?: boolean;
  isTopDeal?: boolean; // Add this line
  createdAt?: string;
  updatedAt?: string;
}

// Enhanced Order interface with loyalty points
export interface Order {
  _id: string;
  user?: string;
  customerName: string;
  contactPhone: string;
  orderItems: Array<{
    menuItem: MenuItem | string;
    quantity: number;
    price: number;
    notes?: string;
  }>;
  subtotal: number;
  discountAmount: number;
  loyaltyPointsUsed: number;
  total: number;
  status: "pending" | "preparing" | "completed" | "cancelled";
  deliveryAddress: string;
  paymentMethod: string;
  notes?: string;
  loyaltyPointsEarned: number;
  createdAt?: string;
  updatedAt?: string;
}

// Enhanced User Profile Interface
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  loyaltyPoints: number;
  totalSpent: number;
  loyaltyPointsUsed: number;
  createdAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  phoneNumber?: string;
  preferences?: {
    newsletter: boolean;
    notifications: boolean;
  };
  totalOrders: number;
  joinDate: string;
  tier: "Bronze" | "Silver" | "Gold";
  recentOrders?: Array<{
    orderId: string;
    total: number;
    status: string;
    date: string;
  }>;
}

// Enhanced Order with tracking
export interface OrderWithTracking {
  _id: string;
  orderNumber: string;
  total: number;
  status: "pending" | "preparing" | "completed" | "cancelled";
  statusText: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  itemCount: number;
  deliveryAddress: string;
  contactPhone: string;
  customerName: string;
  createdAt: string;
  estimatedDelivery: {
    estimated: Date;
    isDelivered: boolean;
    timeRemaining?: number;
    deliveredAt?: Date;
  };
  discountApplied: number;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
  paymentMethod: string;
  notes?: string;
}

// Loyalty discount calculation interface
export interface LoyaltyDiscount {
  eligible: boolean;
  discountAmount: number;
  pointsUsed: number;
  discountPercentage: number;
  finalTotal: number;
  remainingPoints: number;
  message?: string;
}

// Loyalty summary interface
export interface LoyaltySummary {
  isLoggedIn: boolean;
  loyaltyPoints: number;
  loyaltyPointsUsed?: number;
  totalSpent: number;
  pointsHistory: Array<{
    orderId: string;
    date: string;
    amount: number;
    pointsEarned: number;
    pointsUsed: number;
    discountApplied: number;
    status: string;
  }>;
  message?: string;
}

// Password change interface
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

// Query parameter interfaces
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

export interface MenuItemQueryParams extends QueryParams {
  category?: string;
  isAvailable?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderQueryParams extends QueryParams {
  status?: string;
  user?: string;
  startDate?: string;
  endDate?: string;
}

// User orders response
export interface UserOrdersResponse {
  data: Order[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Response wrapper for paginated data
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Order history response (from getUserOrderHistory)
export interface OrderHistoryResponse {
  orders: OrderWithTracking[];
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
  recentOrder: OrderWithTracking | null;
}

// Enhanced API functions
export const categoryAPI = {
  // Basic CRUD
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  create: async (categoryData: Partial<Category>): Promise<Category> => {
    const response = await api.post("/categories", categoryData);
    return response.data;
  },

  update: async (
    id: string,
    categoryData: Partial<Category>,
  ): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // Advanced queries
  search: async (query: string): Promise<Category[]> => {
    const response = await api.get("/categories/search", {
      params: { q: query },
    });
    return response.data;
  },
};

export const menuItemAPI = {
  // Basic CRUD
  getAll: async (params?: MenuItemQueryParams): Promise<MenuItem[]> => {
    const response = await api.get("/menu-items", { params });
    return response.data;
  },

  getTopDeals: async (limit?: number): Promise<MenuItem[]> => {
    const response = await api.get("/menu-items", {
      params: { isTopDeal: true, limit },
    });
    return response.data;
  },

  getPaginated: async (
    params?: MenuItemQueryParams,
  ): Promise<PaginatedResponse<MenuItem>> => {
    const response = await api.get("/menu-items/paginated", { params });
    return response.data;
  },

  getById: async (id: string): Promise<MenuItem> => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  },

  create: async (menuItemData: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await api.post("/menu-items", menuItemData);
    return response.data;
  },

  update: async (
    id: string,
    menuItemData: Partial<MenuItem>,
  ): Promise<MenuItem> => {
    const response = await api.put(`/menu-items/${id}`, menuItemData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/menu-items/${id}`);
  },

  // Specialized operations
  getByCategory: async (
    categoryId: string,
    params?: QueryParams,
  ): Promise<MenuItem[]> => {
    const response = await api.get(`/menu-items/category/${categoryId}`, {
      params,
    });
    return response.data;
  },

  updateAvailability: async (
    id: string,
    isAvailable: boolean,
  ): Promise<MenuItem> => {
    const response = await api.patch(`/menu-items/${id}/availability`, {
      isAvailable,
    });
    return response.data;
  },

  search: async (query: string, params?: QueryParams): Promise<MenuItem[]> => {
    const response = await api.get("/menu-items/search", {
      params: { q: query, ...params },
    });
    return response.data;
  },

  getFeatured: async (limit?: number): Promise<MenuItem[]> => {
    const response = await api.get("/menu-items/featured", {
      params: { limit },
    });
    return response.data;
  },
};

export const orderAPI = {
  // Basic CRUD
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getAll: async (params?: OrderQueryParams): Promise<Order[]> => {
    const response = await api.get("/orders", { params });
    return response.data;
  },

  getPaginated: async (
    params?: OrderQueryParams,
  ): Promise<PaginatedResponse<Order>> => {
    const response = await api.get("/orders/paginated", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  update: async (id: string, orderData: Partial<Order>): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

  // Specialized operations
  updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },

  getMyOrders: async (params?: OrderQueryParams): Promise<Order[]> => {
    const response = await api.get("/orders/user", { params });
    return response.data;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },

  getStats: async (): Promise<any> => {
    const response = await api.get("/orders/stats");
    return response.data;
  },

  // Loyalty points operations
  getLoyaltySummary: async (): Promise<LoyaltySummary> => {
    const response = await api.get("/orders/loyalty-summary");
    return response.data;
  },

  calculateLoyaltyDiscount: async (
    orderTotal: number,
  ): Promise<LoyaltyDiscount> => {
    const response = await api.post("/orders/calculate-loyalty-discount", {
      orderTotal,
    });
    return response.data;
  },

  // Enhanced create order with loyalty points
  createOrderWithLoyalty: async (orderData: {
    orderItems: Array<{
      menuItem: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    discountAmount?: number;
    loyaltyPointsUsed?: number;
    total: number;
    deliveryAddress: string;
    paymentMethod: string;
    notes?: string;
    contactPhone: string;
    customerName: string;
    loyaltyPointsEarned?: number;
  }): Promise<{
    order: Order;
    loyaltyPointsEarned: number;
    loyaltyPointsUsed: number;
    discountAmount: number;
    totalLoyaltyPoints: number;
    user?: {
      id: string;
      username: string;
      loyaltyPoints: number;
    };
  }> => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  // Get order history (main endpoint for user orders)
  getOrderHistory: async (): Promise<OrderHistoryResponse> => {
    const response = await api.get("/orders/history");
    return response.data;
  },

  // Get order tracking
  getOrderTracking: async (
    orderId: string,
  ): Promise<{
    orderId: string;
    orderNumber: string;
    status: string;
    statusText: string;
    trackingInfo: any;
    estimatedDelivery: {
      estimated: string;
      isDelivered: boolean;
      timeRemaining?: number;
      deliveredAt?: string;
    };
    createdAt: string;
    updatedAt: string;
  }> => {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  login: async (
    email: string,
    password: string,
  ): Promise<{
    token: string;
    user: any;
    cart?: any[];
    sessionCartSynced?: boolean;
  }> => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (userData: any): Promise<{ token: string; user: any }> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<any> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  updateProfile: async (userData: any): Promise<any> => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  changePassword: async (
    passwordData: PasswordChangeData,
  ): Promise<{ message: string }> => {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post("/auth/refresh-token");
    return response.data;
  },
};

// User Profile API
export const userAPI = {
  // Get detailed user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // DEPRECATED: Use orderAPI.getOrderHistory() instead
  // Get user orders with pagination
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<UserOrdersResponse> => {
    console.warn(
      "userAPI.getOrders() is deprecated. Use orderAPI.getOrderHistory() instead.",
    );
    const response = await api.get("/orders/history", { params });
    return response.data;
  },

  // Get specific order details
  getOrderDetails: async (orderId: string): Promise<OrderWithTracking> => {
    const response = await api.get(`/orders/${orderId}/details`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (
    userData: Partial<UserProfile>,
  ): Promise<UserProfile> => {
    const response = await api.put("/auth/profile", userData);
    return response.data;
  },

  // Change password
  changePassword: async (
    passwordData: PasswordChangeData,
  ): Promise<{ message: string }> => {
    const response = await api.put("/auth/change-password", passwordData);
    return response.data;
  },

  // Get order history (legacy endpoint - use orderAPI.getOrderHistory instead)
  getOrderHistory: async (): Promise<OrderHistoryResponse> => {
    const response = await api.get("/orders/history");
    return response.data;
  },

  // Get order tracking
  getOrderTracking: async (
    orderId: string,
  ): Promise<{
    orderId: string;
    orderNumber: string;
    status: string;
    statusText: string;
    trackingInfo: any;
    estimatedDelivery: {
      estimated: string;
      isDelivered: boolean;
      timeRemaining?: number;
      deliveredAt?: string;
    };
    createdAt: string;
    updatedAt: string;
  }> => {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  },
};

// Loyalty API utilities
export const loyaltyAPI = {
  // Get user's current loyalty points
  getPoints: async (): Promise<number> => {
    const response = await api.get("/orders/loyalty-summary");
    return response.data.loyaltyPoints || 0;
  },

  // Check if user is eligible for discount
  checkDiscountEligibility: async (
    orderTotal: number,
  ): Promise<{
    eligible: boolean;
    discountAmount: number;
    pointsNeeded: number;
    message: string;
  }> => {
    try {
      const response = await api.post("/orders/calculate-loyalty-discount", {
        orderTotal,
      });
      return {
        eligible: response.data.eligible || false,
        discountAmount: response.data.discountAmount || 0,
        pointsNeeded: response.data.pointsNeeded || 0,
        message: response.data.message || "",
      };
    } catch (error) {
      return {
        eligible: false,
        discountAmount: 0,
        pointsNeeded: 0,
        message: "Unable to check discount eligibility",
      };
    }
  },

  // Get loyalty points history
  getHistory: async (): Promise<LoyaltySummary["pointsHistory"]> => {
    const response = await api.get("/orders/loyalty-summary");
    return response.data.pointsHistory || [];
  },
};

export const checkoutAPI = {
  // Create Stripe checkout session
  createSession: async (checkoutData: {
    prods: Array<{ id: string; quantity: number }>;
    customerName: string;
    contactPhone: string;
    deliveryAddress: string;
    paymentMethod: string;
    notes?: string;
    orderType: "delivery" | "pickup";
    discountAmount: number;
    loyaltyPointsUsed: number;
    loyaltyPointsEarned: number;
  }): Promise<{ url: string; message: string }> => {
    const response = await api.post("/checkout/create-session", checkoutData);
    return response.data;
  },

  // Check payment status
  checkStatus: async (orderId: string): Promise<boolean> => {
    const response = await api.get("/checkout/status", {
      params: { orderid: orderId },
    });
    console.log(response.data);
    return response.data;
  },
};

// Cart API utilities (for session storage sync)
export const cartAPI = {
  // Sync cart from guest to logged-in user
  syncCart: async (cartItems: any[]): Promise<any> => {
    const response = await api.post("/cart/sync", { cartItems });
    return response.data;
  },

  // Get cart from backend (for logged-in users)
  getCart: async (): Promise<any[]> => {
    try {
      console.log("GET CART");
      const response = await api.get("/cart");
      console.log(response);
      return response.data.cart || [];
    } catch (error) {
      console.warn("Failed to get cart from backend:", error);
      return [];
    }
  },

  // Add item to cart
  addToCart: async (
    menuItemId: string,
    quantity: number = 1,
    customizations: any = {},
  ): Promise<any> => {
    const response = await api.post("/cart/add", {
      menuItemId,
      quantity,
      customizations,
    });
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (
    cartItemId: string,
    quantity: number,
  ): Promise<any> => {
    const response = await api.put("/cart/update", { cartItemId, quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: string): Promise<any> => {
    const response = await api.delete(`/cart/remove/${cartItemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<any> => {
    const response = await api.delete("/cart/clear");
    return response.data;
  },

  // Get cart count
  getCartCount: async (): Promise<{ count: number }> => {
    const response = await api.get("/cart/count");
    return response.data;
  },
};

// Auth utilities
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

export const clearAuth = (): void => {
  setAuthToken(null);
};

// Utility function to calculate discount locally
export const calculateLocalDiscount = (
  points: number,
  orderTotal: number,
): {
  eligible: boolean;
  discountAmount: number;
  pointsUsed: number;
  discountPercentage: number;
  message: string;
} => {
  if (points < 10 || orderTotal < 10) {
    return {
      eligible: false,
      discountAmount: 0,
      pointsUsed: 0,
      discountPercentage: 0,
      message:
        points < 10
          ? "Minimum 10 loyalty points required"
          : "Minimum £10 order required for loyalty discount",
    };
  }

  // Calculate how many 10-point stacks can be used
  const maxStacks = Math.floor(points / 10);
  const discountPercentage = Math.min(maxStacks * 10, 50); // Max 50% discount
  const discountAmount = (orderTotal * discountPercentage) / 100;
  const pointsUsed = maxStacks * 10;

  return {
    eligible: true,
    discountAmount: parseFloat(discountAmount.toFixed(2)),
    pointsUsed,
    discountPercentage,
    message: `${discountPercentage}% discount applied using ${pointsUsed} points`,
  };
};

// Password validation utility
export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  requirements: Array<{ met: boolean; text: string }>;
} => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar,
    requirements: [
      { met: password.length >= minLength, text: "At least 8 characters" },
      { met: hasUpperCase, text: "One uppercase letter" },
      { met: hasLowerCase, text: "One lowercase letter" },
      { met: hasNumbers, text: "One number" },
      { met: hasSpecialChar, text: "One special character" },
    ],
  };
};

// Format date utility
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Format currency utility
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Initialize auth token on app start
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

// Export default api instance
export default api;
