import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension";

// Types
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  role: string;
  status: string;
  emailVerified: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,

      login: (user: User) => {
        set({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
      },

      logout: async () => {
        // Call logout API to clear cookies
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error("Error during logout:", error);
        }

        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setUser: (user: User) => {
        set({ user });
      },

      checkAuthStatus: async () => {
        set({ isLoading: true });
        
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const userData = await response.json();
            console.log("🚀 ~ userData:", userData)
            set({
              isAuthenticated: true,
              user: userData,
              isLoading: false,
            });
          } else {
            set({
              isAuthenticated: false,
              user: null,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      },
    })
  )
);
