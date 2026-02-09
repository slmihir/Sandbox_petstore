import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { promoApi, type ApiProduct } from '@/utils/api';

interface CartItem {
  product: ApiProduct;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  discountPercent: number;
  total: number;
  promoCode: string;
  promoApplied: boolean;
  addToCart: (product: ApiProduct) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyPromo: (code: string) => Promise<{ success: boolean; error?: string }>;
  clearCart: () => void;
}

const CART_KEY = 'pawparadise_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
  };

  const addToCart = useCallback((product: ApiProduct) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      const updated = existing
        ? prev.map(i => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { product, quantity: 1 }];
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems(prev => {
      const updated = prev.filter(i => i.product.id !== productId);
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => {
      const updated = prev.map(i => (i.product.id === productId ? { ...i, quantity } : i));
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const applyPromo = useCallback(async (code: string) => {
    try {
      const result = await promoApi.validate(code);
      setPromoCode(result.code);
      setDiscountPercent(result.discountPercent);
      setPromoApplied(true);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid promo code.' };
    }
  }, []);

  const clearCart = useCallback(() => {
    persist([]);
    setPromoCode('');
    setDiscountPercent(0);
    setPromoApplied(false);
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const discount = promoApplied ? subtotal * (discountPercent / 100) : 0;
  const total = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal,
        discount,
        discountPercent,
        total,
        promoCode,
        promoApplied,
        addToCart,
        removeFromCart,
        updateQuantity,
        applyPromo,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
