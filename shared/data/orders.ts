import type { Order } from '../types';

export const orders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-002',
    items: [
      { productId: 'food-001', productName: 'Premium Chicken & Rice Dog Food', quantity: 2, price: 54.99 },
      { productId: 'toy-001', productName: 'Indestructible Chew Bone', quantity: 1, price: 18.99 },
    ],
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 Oak Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      phone: '(512) 555-0123',
    },
    total: 128.97,
    status: 'delivered',
    createdAt: '2025-11-10T14:30:00Z',
    updatedAt: '2025-11-15T09:00:00Z',
  },
  {
    id: 'ORD-002',
    userId: 'user-003',
    items: [
      { productId: 'bed-001', productName: 'Orthopedic Memory Foam Dog Bed', quantity: 1, price: 79.99 },
      { productId: 'groom-001', productName: 'Professional Deshedding Brush', quantity: 1, price: 27.99 },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Maple Avenue',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      phone: '(503) 555-0456',
    },
    total: 107.98,
    status: 'shipped',
    createdAt: '2026-01-05T10:15:00Z',
    updatedAt: '2026-01-07T11:30:00Z',
  },
  {
    id: 'ORD-003',
    userId: 'user-002',
    items: [
      { productId: 'acc-001', productName: 'Adjustable No-Pull Dog Harness', quantity: 1, price: 29.99 },
      { productId: 'acc-003', productName: 'Retractable Dog Leash – 16ft', quantity: 1, price: 22.49 },
      { productId: 'health-001', productName: 'Joint Support Soft Chews for Dogs', quantity: 2, price: 32.99 },
    ],
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 Oak Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      phone: '(512) 555-0123',
    },
    total: 118.46,
    status: 'processing',
    createdAt: '2026-01-28T16:45:00Z',
    updatedAt: '2026-01-28T16:45:00Z',
  },
  {
    id: 'ORD-004',
    userId: 'user-003',
    items: [
      { productId: 'toy-002', productName: 'Interactive Feather Wand Cat Toy', quantity: 3, price: 12.99 },
      { productId: 'food-002', productName: 'Grain-Free Salmon Cat Food', quantity: 1, price: 42.99 },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Maple Avenue',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      phone: '(503) 555-0456',
    },
    total: 81.96,
    status: 'pending',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
  },
  {
    id: 'ORD-005',
    userId: 'user-002',
    items: [
      { productId: 'health-003', productName: 'Flea & Tick Prevention Drops', quantity: 1, price: 44.99 },
      { productId: 'groom-002', productName: 'Oatmeal & Aloe Pet Shampoo', quantity: 2, price: 15.99 },
    ],
    shippingAddress: {
      firstName: 'Jane',
      lastName: 'Smith',
      address: '123 Oak Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      phone: '(512) 555-0123',
    },
    total: 76.97,
    status: 'delivered',
    createdAt: '2025-12-20T12:00:00Z',
    updatedAt: '2025-12-25T10:00:00Z',
  },
];

export const getOrdersByUserId = (userId: string): Order[] =>
  orders.filter(o => o.userId === userId);
