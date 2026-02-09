import { Link } from 'react-router-dom';
import { PawPrint, Mail, Phone, Facebook, Twitter, Instagram, Youtube, CreditCard, Shield, Truck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Trust Badges */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $49' },
              { icon: Shield, title: 'Vet-Approved', desc: 'Every product reviewed' },
              { icon: CreditCard, title: 'Secure Payment', desc: '256-bit SSL encryption' },
            ].map(badge => (
              <div key={badge.title} className="flex items-center gap-3 justify-center sm:justify-start">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                  <badge.icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{badge.title}</p>
                  <p className="text-xs text-gray-400">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Paw<span className="text-indigo-400">Paradise</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 mb-5">
              Your trusted destination for premium pet products. Vet-approved food, toys, beds, grooming, and health supplies — because your pet deserves the best.
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?category=food', label: 'Pet Food' },
                { to: '/products?category=toys', label: 'Toys' },
                { to: '/products?category=beds', label: 'Beds' },
                { to: '/products?category=accessories', label: 'Accessories' },
                { to: '/products?category=grooming', label: 'Grooming' },
                { to: '/products?category=health', label: 'Health & Wellness' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/faq', label: 'FAQs' },
                { to: '/shipping-returns', label: 'Shipping & Returns' },
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
              ].map(link => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get in Touch</h3>
            <div className="space-y-3 mb-5">
              <a href="mailto:support@pawparadise.com" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                support@pawparadise.com
              </a>
              <a href="tel:+18005551234" className="flex items-center gap-2.5 text-sm hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                1-800-555-PAWS
              </a>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">Business Hours</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Mon - Sat: 9:00 AM - 7:00 PM ET</p>
                <p>Sunday: 10:00 AM - 5:00 PM ET</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} PawParadise Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            <Link to="/shipping-returns" className="hover:text-gray-300 transition-colors">Shipping</Link>
            <Link to="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
