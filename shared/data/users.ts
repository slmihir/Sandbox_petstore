import type { User } from '../types';

export const users: User[] = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@pawparadise.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    joinedDate: '2025-01-01',
  },
  {
    id: 'user-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    joinedDate: '2025-06-15',
  },
  {
    id: 'user-003',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    joinedDate: '2025-08-20',
  },
];

export const getUserByEmail = (email: string): User | undefined =>
  users.find(u => u.email === email);

export const getUserById = (id: string): User | undefined =>
  users.find(u => u.id === id);
