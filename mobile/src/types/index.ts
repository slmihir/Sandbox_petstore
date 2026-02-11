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
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  } | null;
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
