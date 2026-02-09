import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatCurrency';

export default function CartPage() {
  const { items, itemCount, subtotal, discount, total, promoApplied, promoCode, addToCart, removeFromCart, updateQuantity, applyPromo } = useCart();
  const [code, setCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = async () => {
    const result = await applyPromo(code);
    if (!result.success) setPromoError(result.error || 'Invalid code');
    else setPromoError('');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-6">Looks like you haven't added any products yet.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Browse Products <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Shopping Cart <span className="text-lg font-normal text-gray-500">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={item.product.id}
              className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <Link to={`/products/${item.product.id}`} className="shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-28 h-28 rounded-xl object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/products/${item.product.id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-500">{item.product.brand} &middot; {item.product.weight}</p>
                  </div>
                  <p className="font-bold text-indigo-600 text-lg">{formatCurrency(item.product.price * item.quantity)}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.product)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> {promoCode}
                  </span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-green-600">{subtotal >= 49 ? 'Free' : formatCurrency(5.99)}</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-indigo-600">{formatCurrency(total + (subtotal >= 49 ? 0 : 5.99))}</span>
              </div>
            </div>

            {/* Promo Code */}
            {!promoApplied && (
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={e => { setCode(e.target.value); setPromoError(''); }}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Promo code"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
              </div>
            )}

            <Link
              to="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/products"
              className="mt-3 w-full block text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
