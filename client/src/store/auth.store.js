import { create } from "zustand";
import { persist } from "zustand/middleware";

export function getCookie(name) {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (typeof window !== "undefined" && token) {
          document.cookie = `bip_token=${token}; path=/; max-age=604800`;
        }
        set({ token });
      },
      setCredentials: (user, token) => {
        if (typeof window !== "undefined") {
          document.cookie = "bip_auth=1; path=/; max-age=604800"; // 7 days
          if (token) {
            document.cookie = `bip_token=${token}; path=/; max-age=604800`;
          }
        }
        set({ user, token });
      },
      clearUser: () => {
        if (typeof window !== "undefined") {
          document.cookie = "bip_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "bip_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
        set({ user: null, token: null });
      },
      getToken: () => {
        const stateToken = get().token;
        if (stateToken) return stateToken;
        return getCookie("bip_token");
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
