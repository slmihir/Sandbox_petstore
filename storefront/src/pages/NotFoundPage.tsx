import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-lg">
        <div className="text-8xl font-extrabold text-indigo-100 select-none mb-4">404</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Sorry, the page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
