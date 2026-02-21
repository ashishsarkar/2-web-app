import { useAuthStore } from '@/lib/store/authStore';

export function useAuth() {
  const { user, token, setUser, setToken, logout } = useAuthStore();
  return { user, token, setUser, setToken, logout, isAuthenticated: !!token };
}
