import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setCredentials: (user, token) => {
        if (typeof window !== "undefined") {
          document.cookie = "bip_auth=1; path=/; max-age=604800"; // 7 days
        }
        set({ user, token });
      },
      clearUser: () => {
        if (typeof window !== "undefined") {
          document.cookie = "bip_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
