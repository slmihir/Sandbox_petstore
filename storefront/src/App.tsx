import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import AccountPage from '@/pages/AccountPage';
import MyOrdersPage from '@/pages/MyOrdersPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PrivacyPage from '@/pages/PrivacyPage';
import TermsPage from '@/pages/TermsPage';
import ShippingReturnsPage from '@/pages/ShippingReturnsPage';
import FAQPage from '@/pages/FAQPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminInventoryPage from '@/pages/admin/AdminInventoryPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

/** Storefront shell — Navbar + Footer shown on all non-admin pages */
function StorefrontShell() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<CatalogPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/orders" element={<MyOrdersPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ScrollToTop />
          <Routes>
            {/* Admin panel — own layout, no storefront Navbar/Footer */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
            </Route>

            {/* Everything else — storefront shell with Navbar + Footer */}
            <Route path="/*" element={<StorefrontShell />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
