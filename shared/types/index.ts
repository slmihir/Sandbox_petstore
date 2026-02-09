// ─── Product Types ────────────────────────────────────────
export type ProductCategory = 'food' | 'toys' | 'beds' | 'accessories' | 'grooming' | 'health';
export type PetType = 'dog' | 'cat' | 'bird' | 'fish' | 'reptile' | 'all';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  petType: PetType;
  brand: string;
  price: number;
  originalPrice?: number;   // for showing discounts
  image: string;
  images: string[];
  description: string;
  features: string[];
  weight: string;           // e.g. "5 lbs", "12 oz"
  dimensions?: string;      // e.g. "24 x 18 x 6 in"
  rating: number;           // 1-5
  reviewCount: number;
  featured: boolean;
  inStock: boolean;
  stockCount: number;
  sku: string;
  dateAdded: string;        // ISO date
}

// ─── User / Auth Types ────────────────────────────────────
export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;     // mock plaintext for demo
  role: UserRole;
  avatar: string;
  joinedDate: string;
}

// ─── Cart Types ───────────────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Order Types ──────────────────────────────────────────
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Review Types ─────────────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;       // 1-5
  comment: string;
  createdAt: string;
}

// ─── Testimonial Types ────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  comment: string;
  rating: number;
  productType: string;
}

// ─── Contact Form ─────────────────────────────────────────
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ─── Filter / Sort ────────────────────────────────────────
export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

export interface FilterState {
  categories: ProductCategory[];
  petType: PetType | '';
  brand: string;
  minPrice: number;
  maxPrice: number;
  search: string;
  sort: SortOption;
}
