/**
 * API client for PawParadise backend.
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

export interface ApiReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ApiTestimonial {
  id: string;
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  productType: string;
}

export interface ApiOrder {
  id: string;
  userId: string;
  status: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  promoCode: string | null;
  shippingAddress: any;
  items: { id: string; productId: string; productName: string; quantity: number; price: number }[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: ApiProduct[];
  total: number;
  page: number;
  totalPages: number;
}

// ─── Token Management ──────────────────────────────

const TOKEN_KEY = 'pawparadise_token';

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
    throw new ApiError(res.status, body.message || `Request failed with status ${res.status}`);
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

  signup: (name: string, email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  me: () =>
    request<{ user: ApiUser }>('/auth/me'),
};

// ─── Products API ──────────────────────────────────

export const productsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<ProductListResponse>(`/products${query}`);
  },

  featured: () =>
    request<ApiProduct[]>('/products/featured'),

  getById: (id: string) =>
    request<ApiProduct>(`/products/${id}`),

  related: (id: string) =>
    request<ApiProduct[]>(`/products/${id}/related`),

  brands: () =>
    request<string[]>('/products/brands'),

  categories: () =>
    request<string[]>('/products/categories'),

  priceRange: () =>
    request<{ min: number; max: number }>('/products/price-range'),
};

// ─── Reviews API ───────────────────────────────────

export const reviewsApi = {
  getByProduct: (productId: string) =>
    request<ApiReview[]>(`/reviews/${productId}`),

  create: (productId: string, data: { rating: number; comment: string }) =>
    request<ApiReview>(`/reviews/${productId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Orders API ────────────────────────────────────

export const ordersApi = {
  list: () =>
    request<ApiOrder[]>('/orders'),

  getById: (id: string) =>
    request<ApiOrder>(`/orders/${id}`),

  create: (data: {
    items: { productId: string; quantity: number }[];
    shippingAddress: any;
    promoCode?: string;
  }) =>
    request<ApiOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ─── Testimonials API ──────────────────────────────

export const testimonialsApi = {
  list: () =>
    request<ApiTestimonial[]>('/testimonials'),
};

// ─── Promo API ─────────────────────────────────────

export const promoApi = {
  validate: (code: string) =>
    request<{ code: string; discountPercent: number }>('/promo/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),
};

// ─── Admin API Types ──────────────────────────────

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

// ─── Admin API ────────────────────────────────────

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
