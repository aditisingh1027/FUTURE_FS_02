import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current user on mount
  useEffect(() => {
    authService.getMe()
      .then((res) => setUser(res.data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    const user = res.data?.user ?? null;
    setUser(user);
    toast.success(`Welcome aboard, ${user?.name || 'new user'}!`);
    return user;
  }, []);

  const login = useCallback(async (data) => {
    const res = await authService.login(data);
    const user = res.data?.user ?? null;
    setUser(user);
    toast.success(`Welcome back, ${user?.name || 'there'}!`);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    toast.success('Logged out successfully.');
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
