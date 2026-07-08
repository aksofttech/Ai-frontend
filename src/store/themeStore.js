import { create } from 'zustand';

const useThemeStore = create((set) => ({
  darkMode: false,
  
  toggleDarkMode: () => {
    localStorage.setItem('dashboard-theme', 'light');
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
    set({ darkMode: false });
  },

  syncTheme: () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('dashboard-theme', 'light');
      document.documentElement.classList.remove('dark');
      set({ darkMode: false });
    }
  }
}));

export default useThemeStore;
