import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, PawPrint, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/utils/validators';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!password) { setError('Password is required.'); return; }

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) navigate('/');
    else setError(result.error || 'Login failed.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <PawPrint className="w-10 h-10 text-indigo-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your PawParadise account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-indigo-600 font-medium hover:text-indigo-700">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
