import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, LogOut, ArrowLeft, ChevronRight, Settings, Heart, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout, isAdmin } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { to: '/orders', icon: Package, label: 'My Orders', desc: 'View your order history and track shipments' },
    { to: '/products', icon: Heart, label: 'Shop Products', desc: 'Browse our full catalog of pet products' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-2">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Account</h1>

      {/* Profile Card */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full capitalize">
                <User className="w-3 h-3" />
                {user.role}
              </span>
              <span className="text-xs text-gray-400">Member since {user.joinedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Link */}
      {isAdmin && (
        <a
          href="/admin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 hover:bg-amber-100 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900">Admin Dashboard</p>
              <p className="text-sm text-amber-700">Manage products, orders, and store settings</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-amber-400 group-hover:text-amber-600 transition-colors" />
        </a>
      )}

      {/* Menu Items */}
      <div className="space-y-3 mb-6">
        {menuItems.map(item => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                <item.icon className="w-5 h-5 text-gray-500 group-hover:text-indigo-600 transition-colors" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.label}</p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Account Info */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          Account Details
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Full Name</p>
            <p className="font-medium text-gray-900 mt-0.5">{user.name}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
            <p className="font-medium text-gray-900 mt-0.5">{user.email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Account Type</p>
            <p className="font-medium text-gray-900 mt-0.5 capitalize">{user.role}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Joined</p>
            <p className="font-medium text-gray-900 mt-0.5">{user.joinedDate}</p>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
