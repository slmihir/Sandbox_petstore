import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ChevronDown, Loader2, ShoppingBag, ArrowLeft, Clock, Truck, Check, X as XIcon, RotateCcw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ordersApi, type ApiOrder } from '@/utils/api';
import { formatCurrency } from '@/utils/formatCurrency';

const statusConfig: Record<string, { icon: typeof Clock; color: string; bgColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: RotateCcw, color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Processing' },
  shipped: { icon: Truck, color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Shipped' },
  delivered: { icon: Check, color: 'text-green-700', bgColor: 'bg-green-100', label: 'Delivered' },
  cancelled: { icon: XIcon, color: 'text-red-700', bgColor: 'bg-red-100', label: 'Cancelled' },
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    ordersApi.list()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center">
          <Package className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const isExpanded = expandedOrder === order.id;
            const statusInfo = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = statusInfo.icon;

            return (
              <div key={order.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${statusInfo.bgColor}`}>
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    <span className="hidden sm:inline font-bold text-gray-900">{formatCurrency(order.total)}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                    {/* Items */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
                    <div className="space-y-3 mb-5">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} &middot; {formatCurrency(item.price)} each</p>
                          </div>
                          <span className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount {order.promoCode ? `(${order.promoCode})` : ''}</span>
                          <span>-{formatCurrency(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Shipping</span>
                        <span className={order.shippingCost === 0 ? 'text-green-600' : ''}>{order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}</span>
                      </div>
                      <hr className="border-gray-200" />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span className="text-indigo-600">{formatCurrency(order.total)}</span>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div className="mt-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Shipped To</h3>
                        <div className="text-sm text-gray-600 space-y-0.5">
                          <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
