import axios from "axios";
import { useAuthStore, getCookie } from "../store/auth.store";

const getBaseURL = () => {
  // 1. If running in the browser, check current hostname
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    // Local development mode
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000/api";
    }
  }

  // 2. If env variable is specified and is NOT localhost, use it
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")) {
    const cleanUrl = process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
    if (cleanUrl.endsWith("/api")) {
      return cleanUrl;
    }
    return `${cleanUrl}/api`;
  }

  // 3. Default production URL for deployed Vercel frontend to talk to Render backend
  return "https://sw2627-nextjs-cleartax-6.onrender.com/api";
};

const baseURL = getBaseURL();

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token || (typeof document !== "undefined" && getCookie("bip_token"));
  if (token) {
    if (config.headers && typeof config.headers.set === "function") {
      config.headers.set("Authorization", `Bearer ${token}`);
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      if (!url.includes("/auth/login") && !url.includes("/auth/signup")) {
        useAuthStore.getState().clearUser();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
