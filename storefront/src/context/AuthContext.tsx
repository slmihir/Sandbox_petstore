import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { authApi, setToken, removeToken, getToken, type ApiUser } from '@/utils/api';

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
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
      .then(({ user }) => setUser(user))
      .catch(() => {
        // Token is invalid or expired
        removeToken();
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed.' };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const { token, user } = await authApi.signup(name, email, password);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Signup failed.' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
