import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('Network Error:', error.message);
    } else {
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
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
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: Category | string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  _id: string;
  user?: string;
  orderItems: Array<{
    menuItem: MenuItem | string;
    quantity: number;
    notes?: string;
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  deliveryAddress?: string;
  contactPhone?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Query parameter interfaces
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
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

// Response wrapper for paginated data
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// API functions
export const categoryAPI = {
  // Basic CRUD
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  
  create: async (categoryData: Partial<Category>): Promise<Category> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  
  update: async (id: string, categoryData: Partial<Category>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
  
  // Advanced queries
  search: async (query: string): Promise<Category[]> => {
    const response = await api.get('/categories/search', { params: { q: query } });
    return response.data;
  },
};

export const menuItemAPI = {
  // Basic CRUD
  getAll: async (params?: MenuItemQueryParams): Promise<MenuItem[]> => {
    const response = await api.get('/menu-items', { params });
    return response.data;
  },
  
  getPaginated: async (params?: MenuItemQueryParams): Promise<PaginatedResponse<MenuItem>> => {
    const response = await api.get('/menu-items/paginated', { params });
    return response.data;
  },
  
  getById: async (id: string): Promise<MenuItem> => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  },
  
  create: async (menuItemData: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await api.post('/menu-items', menuItemData);
    return response.data;
  },
  
  update: async (id: string, menuItemData: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await api.put(`/menu-items/${id}`, menuItemData);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await api.delete(`/menu-items/${id}`);
  },
  
  // Specialized operations
  getByCategory: async (categoryId: string, params?: QueryParams): Promise<MenuItem[]> => {
    const response = await api.get(`/menu-items/category/${categoryId}`, { params });
    return response.data;
  },
  
  updateAvailability: async (id: string, isAvailable: boolean): Promise<MenuItem> => {
    const response = await api.patch(`/menu-items/${id}/availability`, { isAvailable });
    return response.data;
  },
  
  search: async (query: string, params?: QueryParams): Promise<MenuItem[]> => {
    const response = await api.get('/menu-items/search', { params: { q: query, ...params } });
    return response.data;
  },
  
  getFeatured: async (limit?: number): Promise<MenuItem[]> => {
    const response = await api.get('/menu-items/featured', { params: { limit } });
    return response.data;
  },
};

export const orderAPI = {
  // Basic CRUD
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getAll: async (params?: OrderQueryParams): Promise<Order[]> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  
  getPaginated: async (params?: OrderQueryParams): Promise<PaginatedResponse<Order>> => {
    const response = await api.get('/orders/paginated', { params });
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
  updateStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
  
  getMyOrders: async (params?: OrderQueryParams): Promise<Order[]> => {
    const response = await api.get('/orders/my-orders', { params });
    return response.data;
  },
  
  cancelOrder: async (id: string): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/cancel`);
    return response.data;
  },
  
  getStats: async (): Promise<any> => {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ token: string; user: any }> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any): Promise<{ token: string; user: any }> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getProfile: async (): Promise<any> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any): Promise<any> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
};

// Auth utilities
export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const clearAuth = (): void => {
  setAuthToken(null);
};

// Initialize auth token on app start
const token = getAuthToken();
if (token) {
  setAuthToken(token);
}

export default api;