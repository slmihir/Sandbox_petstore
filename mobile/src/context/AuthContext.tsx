import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { setToken, removeToken, getToken } from '../services/storage';
import type { ApiUser } from '../types';

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const { user } = await authApi.me();
        if (user.role === 'admin') {
          setUser(user);
        } else {
          await removeToken();
        }
      } catch {
        await removeToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      if (user.role !== 'admin') {
        return { success: false, error: 'You do not have admin access.' };
      }
      await setToken(token);
      setUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await removeToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
