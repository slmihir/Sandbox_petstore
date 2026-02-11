import { request } from './api';
import type { ApiUser } from '../types';

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ user: ApiUser }>('/auth/me'),
};
