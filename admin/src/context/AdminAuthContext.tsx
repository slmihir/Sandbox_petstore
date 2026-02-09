import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { authApi, setToken, removeToken, getToken, type ApiUser } from '@/utils/api';

interface AdminAuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if we have a stored token and validate it
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    authApi.me()
      .then(({ user }) => {
        if (user.role === 'admin') {
          setUser(user);
        } else {
          // Not an admin — clear token
          removeToken();
        }
      })
      .catch(() => {
        removeToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      if (user.role !== 'admin') {
        return { success: false, error: 'You do not have admin access.' };
      }
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
  }, []);

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
