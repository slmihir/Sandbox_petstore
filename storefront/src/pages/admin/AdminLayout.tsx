import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, ArrowLeft, PawPrint, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/inventory', label: 'Inventory', icon: Package, end: false },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart, end: false },
];

export default function AdminLayout() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-gray-900 text-white shrink-0 hidden lg:flex flex-col sticky top-0 h-screen">
        {/* Branding */}
        <div className="px-6 py-5 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <PawPrint className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold">
              Paw<span className="text-indigo-400">Admin</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* User + Back to Store */}
        <div className="px-4 py-4 border-t border-gray-800 space-y-2">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-700"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Store
          </NavLink>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 bg-gray-900 text-white z-40 px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold">Paw<span className="text-indigo-400">Admin</span></span>
        </Link>
        <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
          <Store className="w-4 h-4" />
          Store
        </Link>
      </div>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 flex safe-area-pb">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto pt-16 pb-20 lg:pt-8 lg:pb-8">
        <Outlet />
      </main>
    </div>
  );
}
