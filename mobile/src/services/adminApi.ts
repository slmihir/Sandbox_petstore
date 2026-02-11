import { request } from './api';
import type {
  DashboardResponse,
  AdminOrdersResponse,
  InventoryProduct,
} from '../types';

export const adminApi = {
  dashboard: () => request<DashboardResponse>('/admin/dashboard'),

  orders: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<AdminOrdersResponse>(`/admin/orders${query}`);
  },

  updateOrderStatus: (orderId: string, status: string) =>
    request<{ id: string; status: string }>(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  inventory: () => request<InventoryProduct[]>('/admin/inventory'),

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
