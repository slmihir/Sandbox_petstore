import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminLoginPage from '@/pages/AdminLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import InventoryPage from '@/pages/InventoryPage';
import OrdersPage from '@/pages/OrdersPage';
import { Loader2, Menu, X, ClipboardList } from 'lucide-react';

function AdminLayout() {
  const { isAuthenticated, loading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Mobile top bar */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between bg-gray-900 px-4 py-3 border-b border-gray-800 md:hidden">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">
            Paw<span className="text-indigo-400">Admin</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="relative w-64 h-full">
            <div className="absolute inset-0 bg-gray-900 shadow-xl transform transition-transform duration-300 translate-x-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Paw<span className="text-indigo-400">Admin</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AdminSidebar />
            </div>
          </div>
          <button
            type="button"
            className="flex-1 bg-black/50"
            aria-label="Close navigation overlay"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 bg-gray-50 p-4 md:p-6 lg:p-8 overflow-auto pt-16 md:pt-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AdminLayout />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
