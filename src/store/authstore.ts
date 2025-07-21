import { create } from "zustand";

type User = {
  name: string;
  email: string;
  isAdmin: boolean;
  cnic: string;
}

type AuthState = {
  user: User | null;
  token: string | null;
  setUser: (userData: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  loadSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,


  setUser: (userData) => set({ user: userData,}),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null,}),
  loadSession: () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      set({
        user: JSON.parse(storedUser),
        token: storedToken,
      });
    }
  },
}));

export default useAuthStore;
