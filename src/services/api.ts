import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Type definitions to match backend
export interface Category {
  _id: string;
  name: string;
  description?: string;
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
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'completed' | 'cancelled';
  deliveryAddress?: string;
  contactPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API functions
export const categoryAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

export const menuItemAPI = {
  getAll: async (): Promise<MenuItem[]> => {
    const response = await api.get('/menu-items');
    return response.data;
  },
  
  getByCategory: async (categoryId: string): Promise<MenuItem[]> => {
    const response = await api.get(`/menu-items?category=${categoryId}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<MenuItem> => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  },
};

export const orderAPI = {
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export default api;

