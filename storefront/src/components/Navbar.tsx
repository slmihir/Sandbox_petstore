import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, PawPrint, LogOut, Shield, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu and user menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    if (!userMenuOpen) return;
    const handleClick = () => setUserMenuOpen(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [userMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
          : 'bg-white/80 backdrop-blur-lg border-b border-transparent'
      }`}
    >
      {/* Top bar — promotional strip */}
      <div className="bg-indigo-600 text-white text-center text-xs sm:text-sm py-1.5 font-medium tracking-wide">
        Free shipping on orders over $49 &nbsp;&middot;&nbsp; Use code <span className="font-bold">SAVE20</span> for 20% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="PawParadise Home">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-700 transition-colors">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">
              Paw<span className="text-indigo-600">Paradise</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                aria-label="Admin Dashboard"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}

            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-indigo-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden md:block relative">
                <button
                  onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <img
                    src={user!.avatar}
                    alt={user!.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                  />
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user!.name.split(' ')[0]}</span>
                </button>

                {/* Desktop dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{user!.name}</p>
                      <p className="text-xs text-gray-500">{user!.email}</p>
                    </div>
                    <Link to="/account" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User className="w-4 h-4 text-gray-400" /> My Account
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Package className="w-4 h-4 text-gray-400" /> My Orders
                    </Link>
                    <hr className="my-1 border-gray-50" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <nav className="px-4 py-3 space-y-1" aria-label="Mobile navigation">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-gray-100" />
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <img src={user!.avatar} alt={user!.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user!.name}</p>
                    <p className="text-xs text-gray-500">{user!.email}</p>
                  </div>
                </div>
                <Link
                  to="/account"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  My Account
                </Link>
                <Link
                  to="/orders"
                  className="block px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  My Orders
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
