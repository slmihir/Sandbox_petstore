import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from '@/context/AdminAuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminLoginPage from '@/pages/AdminLoginPage';
import DashboardPage from '@/pages/DashboardPage';
import InventoryPage from '@/pages/InventoryPage';
import OrdersPage from '@/pages/OrdersPage';
import { Loader2 } from 'lucide-react';

function AdminLayout() {
  const { isAuthenticated, loading } = useAdminAuth();

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
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
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
