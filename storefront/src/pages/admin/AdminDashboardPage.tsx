import { useState, useEffect } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, Users, Tag, Loader2 } from 'lucide-react';
import { adminApi, productsApi, type DashboardResponse } from '@/utils/api';

const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const barColors = ['bg-indigo-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500', 'bg-rose-500', 'bg-cyan-500'];

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [categories, setCategoryBreakdown] = useState<{ category: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [dashboardData, productList] = await Promise.all([
          adminApi.dashboard(),
          productsApi.list({ limit: '200' }),
        ]);
        setData(dashboardData);

        const catCount: Record<string, number> = {};
        productList.products.forEach(p => {
          catCount[p.category] = (catCount[p.category] || 0) + 1;
        });
        const entries = Object.entries(catCount)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count);
        setCategoryBreakdown(entries);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 text-lg">{error || 'Failed to load dashboard.'}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 font-medium hover:text-indigo-700">
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentOrders } = data;
  const maxCount = Math.max(...categories.map(e => e.count), 1);
  const pendingOrders = recentOrders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'bg-indigo-100 text-indigo-600', trend: 'In inventory' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'bg-amber-100 text-amber-600', trend: `${pendingOrders} pending` },
    { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600', trend: 'All time' },
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'bg-purple-100 text-purple-600', trend: 'Registered users' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here is an overview of your store.</p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {statCards.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-50">
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Items</th>
                  <th className="px-6 py-3 font-medium">Total</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No orders yet.</td></tr>
                ) : (
                  recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </td>
                      <td className="px-6 py-3 text-gray-600">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</td>
                      <td className="px-6 py-3 font-medium">${order.total.toLocaleString()}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[order.status] || ''}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Products by Category</h2>
          {categories.length === 0 ? (
            <p className="text-gray-400 text-sm">No product data available.</p>
          ) : (
            <div className="space-y-4">
              {categories.map(({ category, count }, i) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-gray-700 font-medium">{category}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${barColors[i % barColors.length]} transition-all duration-500`}
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
            <Tag className="w-4 h-4" />
            <span>{stats.totalProducts} total products in inventory</span>
          </div>
        </div>
      </div>
    </div>
  );
}
