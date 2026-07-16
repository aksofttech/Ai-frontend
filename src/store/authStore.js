import { create } from 'zustand';
import Cookies from 'js-cookie';

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      userRole: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      isInitializing: true,
    };
  }

  const token = Cookies.get('rag_token') || localStorage.getItem('rag_token') || null;
  const userRole = localStorage.getItem('userRole') || localStorage.getItem('rag_user_role') || null;
  let user = null;
  try {
    const savedUser = localStorage.getItem('rag_user');
    if (savedUser) {
      user = JSON.parse(savedUser);
    }
  } catch (_) {}

  if (user && !user.role && userRole) {
    user.role = userRole;
  }

  const isAuthenticated = !!token;

  return {
    user: user || (userRole ? { role: userRole } : null),
    userRole: userRole || user?.role || null,
    token,
    isAuthenticated,
    isLoading: !isAuthenticated && !userRole,
    isInitializing: !isAuthenticated && !userRole,
  };
};

const useAuthStore = create((set, get) => ({
  ...getInitialState(),

  setAuth: (user, token) => {
    Cookies.set('rag_token', token, { expires: 7 }); // Expires in 7 days
    const role = user?.role || (typeof window !== 'undefined' ? (localStorage.getItem('userRole') || localStorage.getItem('rag_user_role')) : null) || 'teacher';
    if (typeof window !== 'undefined') {
      localStorage.setItem('rag_token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('rag_user_role', role);
      if (user) {
        localStorage.setItem('rag_user', JSON.stringify(user));
      }
    }
    set({ user, userRole: role, token, isAuthenticated: true, isLoading: false, isInitializing: false });
  },

  logout: () => {
    Cookies.remove('rag_token');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rag_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('rag_user_role');
      localStorage.removeItem('rag_user');
    }
    set({ user: null, userRole: null, token: null, isAuthenticated: false, isLoading: false, isInitializing: false });
  },

  fetchProfile: async () => {
    try {
      const api = (await import('@/services/api')).default;
      const response = await api.get('/users/me');
      const data = response.data?.data || response.data;
      const role = data?.role || get().userRole || 'teacher';
      if (typeof window !== 'undefined' && data) {
        if (role) {
          localStorage.setItem('userRole', role);
          localStorage.setItem('rag_user_role', role);
        }
        localStorage.setItem('rag_user', JSON.stringify(data));
      }
      set({ user: data, userRole: role });
      return data;
    } catch (err) {
      console.warn('Failed to fetch user profile:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        Cookies.remove('rag_token');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('rag_token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('rag_user_role');
          localStorage.removeItem('rag_user');
        }
        set({ user: null, userRole: null, token: null, isAuthenticated: false });
      }
      return null;
    }
  },

  initializeAuth: async () => {
    if (typeof window === 'undefined') return;
    const token = Cookies.get('rag_token') || localStorage.getItem('rag_token');
    const storedRole = localStorage.getItem('userRole') || localStorage.getItem('rag_user_role');
    let storedUser = null;
    try {
      const u = localStorage.getItem('rag_user');
      if (u) storedUser = JSON.parse(u);
    } catch (_) {}

    if (!token) {
      set({ user: null, userRole: null, token: null, isAuthenticated: false, isLoading: false, isInitializing: false });
      return;
    }

    const resolvedRole = storedRole || storedUser?.role || 'teacher';
    set({
      token,
      isAuthenticated: true,
      userRole: resolvedRole,
      user: storedUser || { role: resolvedRole, email: 'admin@yugsoft.com' },
    });

    try {
      await get().fetchProfile();
    } catch (_) {}

    set({ isLoading: false, isInitializing: false });
  },

  setUser: (user) => {
    const role = user?.role || get().userRole;
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem('rag_user', JSON.stringify(user));
      if (role) {
        localStorage.setItem('userRole', role);
        localStorage.setItem('rag_user_role', role);
      }
    }
    set({ user, userRole: role });
  },
}));

export default useAuthStore;
