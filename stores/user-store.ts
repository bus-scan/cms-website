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

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,

      setUser: (user: User | null) => {
        set({ user });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      fetchUser: async () => {
        set({ isLoading: true });
        
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
          });

          if (response.ok) {
            const userData = await response.json();
            set({
              user: userData,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          set({
            user: null,
            isLoading: false,
          });
        }
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
          user: null,
          isLoading: false,
        });
      },
    })
  )
);

// Keep the old export for backward compatibility during transition
export const useAuthStore = useUserStore;
