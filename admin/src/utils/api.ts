/**
 * API client for PawParadise Admin panel.
 * All data is fetched from the backend API — nothing is hardcoded.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ─── Types ─────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedDate: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  petType: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  weight: string;
  dimensions?: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
  stockCount: number;
  sku: string;
  dateAdded: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface DashboardOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  recentOrders: DashboardOrder[];
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  status: string;
  total: number;
  itemCount: number;
  items: { productName: string; quantity: number; price: number }[];
  shippingAddress: any;
  createdAt: string;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  total: number;
  page: number;
  totalPages: number;
}

export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  stockCount: number;
  inStock: boolean;
}

export interface ProductListResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Token Management ──────────────────────────────

const TOKEN_KEY = 'pawparadise_admin_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ─── Base Request Function ─────────────────────────

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers as Record<string, string> || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: `HTTP ${res.status}` }));
    const error = new ApiError(res.status, body.message || `Request failed with status ${res.status}`);
    // Attach Zod field errors if present so the frontend can display them
    if (body.errors) (error as any).errors = body.errors;
    throw error;
  }

  return res.json();
}

// ─── Auth API ──────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    request<{ user: ApiUser }>('/auth/me'),
};

// ─── Admin API ─────────────────────────────────────

export const adminApi = {
  dashboard: () =>
    request<DashboardResponse>('/admin/dashboard'),

  orders: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<AdminOrdersResponse>(`/admin/orders${query}`);
  },

  updateOrderStatus: (orderId: string, status: string) =>
    request<{ id: string; status: string }>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  inventory: () =>
    request<InventoryProduct[]>('/admin/inventory'),

  createProduct: (data: Record<string, any>) =>
    request<{ id: string; name: string; slug: string }>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateProduct: (id: string, data: Record<string, any>) =>
    request<{ id: string; name: string }>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string) =>
    request<{ message: string }>(`/admin/products/${id}`, {
      method: 'DELETE',
    }),
};

// ─── Products API (for full product data) ──────────

export const productsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<ProductListResponse>(`/products${query}`);
  },

  getById: (id: string) =>
    request<ApiProduct>(`/products/${id}`),

  brands: () =>
    request<string[]>('/products/brands'),

  categories: () =>
    request<string[]>('/products/categories'),
};
