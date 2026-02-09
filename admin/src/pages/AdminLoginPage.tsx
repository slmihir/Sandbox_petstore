import { useState } from 'react';
import { ClipboardList, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Both fields are required.'); return; }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) setError(result.error || 'Login failed.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <ClipboardList className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400 mt-1">Sign in to manage PawParadise</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-5">
          {error && (
            <div className="bg-red-900/50 border border-red-800 text-red-300 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@pawparadise.com"
              className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500 pr-10"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
          </button>

          <div className="bg-gray-700/50 rounded-xl p-3 text-xs text-gray-400">
            <p className="font-medium mb-1 text-gray-300">Demo Credentials:</p>
            <p>Email: admin@pawparadise.com</p>
            <p>Password: admin123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
