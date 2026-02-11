import { request } from './api';
import type { ProductListResponse, ApiProduct } from '../types';

export const productsApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<ProductListResponse>(`/products${query}`);
  },

  getById: (id: string) => request<ApiProduct>(`/products/${id}`),

  brands: () => request<string[]>('/products/brands'),

  categories: () => request<string[]>('/products/categories'),
};
