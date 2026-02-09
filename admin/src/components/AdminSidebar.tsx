import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ClipboardList } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
];

export default function AdminSidebar() {
  const { user, logout } = useAdminAuth();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col min-h-screen shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-indigo-400" />
          <span className="text-lg font-bold">
            Paw<span className="text-indigo-400">Admin</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
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

      {/* User / Logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        {user && (
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
