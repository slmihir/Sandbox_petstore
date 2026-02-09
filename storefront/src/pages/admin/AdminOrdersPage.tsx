import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { adminApi, type AdminOrder } from '@/utils/api';

const statusOptions = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '20' };
      if (filterStatus) params.status = filterStatus;
      const result = await adminApi.orders(params);
      setOrders(result.orders);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingOrder(orderId);
    try {
      const result = await adminApi.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: result.status } : o)));
    } catch (err) {
      console.error('Failed to update order status:', err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  const filtered = search
    ? orders.filter(o => {
        const q = search.toLowerCase();
        return o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.items.some(i => i.productName.toLowerCase().includes(q));
      })
    : orders;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">{total} total order{total !== 1 ? 's' : ''}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
          <option value="">All Statuses</option>
          {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => {
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="font-bold text-gray-900">{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm text-gray-700">{order.customer}</p>
                      <p className="text-xs text-gray-400">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[order.status] || ''}`}>{order.status}</span>
                    <span className="font-bold text-gray-900">${order.total.toLocaleString()}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-6 pb-5 border-t border-gray-100 pt-4">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Items</h3>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.productName} x{item.quantity}</span>
                              <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Shipping Address</h3>
                        {order.shippingAddress ? (
                          <div className="text-sm text-gray-600 space-y-0.5">
                            <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                            <p>{order.shippingAddress.address}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                            <p>{order.shippingAddress.phone}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">No address data</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Customer:</span> {order.customer} ({order.email})
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-700">Update Status:</label>
                      <select value={order.status.toUpperCase()} onChange={e => updateStatus(order.id, e.target.value)} disabled={updatingOrder === order.id} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50">
                        {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                      </select>
                      {updatingOrder === order.id && <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-center py-20 text-gray-400"><p className="text-lg">No orders found.</p></div>}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
          <span className="text-sm text-gray-600 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
        </div>
      )}
    </div>
  );
}
