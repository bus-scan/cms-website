import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";

// Types
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  login: (tokens: AuthTokens, user?: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  updateTokens: (tokens: AuthTokens) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        tokens: null,

        login: (tokens: AuthTokens, user?: User) => {
          set({
            isAuthenticated: true,
            tokens,
            user: user || null,
            isLoading: false,
          });
        },

        logout: () => {
          set({
            isAuthenticated: false,
            tokens: null,
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

        updateTokens: (tokens: AuthTokens) => {
          set({ tokens });
        },
      }),
      {
        name: "auth-storage",
      }
    )
  )
);
