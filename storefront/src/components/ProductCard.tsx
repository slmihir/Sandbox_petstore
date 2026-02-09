import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Plus, Minus, Check } from 'lucide-react';
import { useState } from 'react';
import type { ApiProduct } from '@/utils/api';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';

interface ProductCardProps {
  product: ApiProduct;
}

const categoryLabels: Record<string, string> = {
  food: 'Food',
  toys: 'Toys',
  beds: 'Beds',
  accessories: 'Accessories',
  grooming: 'Grooming',
  health: 'Health',
};

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = items.find(i => i.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleIncrement = () => {
    addToCart(product);
  };

  const handleDecrement = () => {
    if (quantity <= 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, quantity - 1);
    }
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all duration-300">
      <Link to={`/products/${product.id}`} className="block relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-xs font-medium rounded-full text-gray-700">
            {categoryLabels[product.category] || product.category}
          </span>
          {hasDiscount && (
            <span className="px-2.5 py-1 bg-red-500/90 backdrop-blur text-xs font-bold rounded-full text-white">
              -{discountPct}%
            </span>
          )}
          {product.featured && (
            <span className="px-2.5 py-1 bg-amber-400/90 backdrop-blur text-xs font-bold rounded-full text-amber-900">
              Featured
            </span>
          )}
        </div>
        <button
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-gray-400 hover:text-red-500 transition-colors"
          aria-label={`Add ${product.name} to wishlist`}
          onClick={(e) => { e.preventDefault(); }}
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Quantity badge on image */}
        {quantity > 0 && (
          <div className="absolute bottom-3 right-3 w-7 h-7 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
            {quantity}
          </div>
        )}
      </Link>

      <div className="p-4">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{product.brand}</p>
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg font-bold text-indigo-600">{formatCurrency(product.price)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice!)}</span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Link
            to={`/products/${product.id}`}
            className="flex-1 text-center py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Details
          </Link>

          {quantity === 0 ? (
            /* Not in cart — show Add button */
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingCart className="w-4 h-4" />
              Add
            </button>
          ) : (
            /* In cart — show quantity controls */
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleDecrement}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold text-indigo-600">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* "Added" confirmation toast */}
        {justAdded && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-green-600 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            Added to cart
          </div>
        )}
      </div>
    </div>
  );
}
