"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileSpreadsheet, History, Settings, User, FileText, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore, getCookie } from "@/store/auth.store";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "@/lib/axios";

export default function AppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const validateToken = async () => {
      const activeToken = token || (typeof document !== "undefined" && getCookie("bip_token"));
      if (activeToken) {
        try {
          const response = await axios.get("/auth/me");
          const data = response.data;
          if (data.success && data.user) {
            setUser(data.user);
            if (!token) {
              setToken(activeToken);
            }
          } else {
            clearUser();
            router.push("/login");
          }
        } catch (err) {
          console.error("Token verification failed:", err);
          clearUser();
          router.push("/login");
        }
      } else {
        const hasAuthCookie = typeof document !== "undefined" && getCookie("bip_auth") === "1";
        if (!hasAuthCookie) {
          clearUser();
          router.push("/login");
        }
      }
    };

    validateToken();
  }, [token, setUser, setToken, clearUser, router]);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName = mounted && user?.name ? user.name : "";
  const displayEmail = mounted && user?.email ? user.email : "";
  const profilePicture = mounted && user?.profilePicture ? user.profilePicture : null;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Invoices", href: "/upload", icon: FileSpreadsheet },
    { name: "Results", href: "/results", icon: FileText },
    { name: "Reports", href: "/reports", icon: History },
    { name: "Library", href: "/library", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#faf9ff] flex font-sans text-stone-900">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-slate-800/40 bg-[#0d0c1d] text-slate-300 z-10 h-screen sticky top-0 shadow-xl">
        <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800/40">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5a38ef] to-[#ff8c70] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/10">CT</span>
          <div className="text-lg font-bold text-white tracking-tight font-outfit">ClearTax</div>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#5a38ef] to-[#7f63f4] text-white font-semibold shadow-[0_4px_18px_rgba(90,56,239,0.3)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-gradient-to-b from-[#ff8c70] to-[#5a38ef] rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon size={18} className={`mr-3 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="text-[13.5px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-800/40 bg-slate-900/10">
          {mounted && user ? (
            <div className="flex items-center mb-4 px-2">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover border border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#5a38ef]/10 flex items-center justify-center text-[#5a38ef] font-bold text-sm border border-[#5a38ef]/5 shadow-inner">
                  {initial}
                </div>
              )}
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                <p className="text-xs text-slate-400 truncate">{displayEmail}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center mb-4 px-2 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-slate-850" />
              <div className="ml-3 space-y-1.5 flex-1">
                <div className="h-3 bg-slate-800 rounded w-20" />
                <div className="h-2.5 bg-slate-800 rounded w-28" />
              </div>
            </div>
          )}
          <button
            onClick={() => {
              clearUser();
              router.push("/");
            }}
            className="flex items-center text-red-400 hover:text-red-300 transition-colors px-2 py-1.5 hover:bg-red-500/10 rounded-lg w-full text-left"
          >
            <LogOut size={14} className="mr-2" />
            <span className="text-xs font-semibold">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#faf9ff] relative overflow-hidden">
        {/* Color changing ambient backdrop glow */}
        <motion.div 
          animate={{
            background: [
              "radial-gradient(circle at 80% 20%, rgba(90,56,239,0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,140,112,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(255,140,112,0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(90,56,239,0.03) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(90,56,239,0.05) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(255,140,112,0.03) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 pointer-events-none z-0"
        />
        {/* Top Header */}
        <header className="h-16 border-b border-stone-100 px-8 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-20">
          <div className="text-sm font-bold text-stone-800 tracking-tight font-outfit">
            {navigation.find(item => item.href === pathname)?.name || "Invoice Processing"}
          </div>

          {/* User Profile Header Dropdown */}
          {mounted && user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 hover:bg-stone-50 p-1.5 rounded-xl transition-all outline-none"
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border border-stone-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#5a38ef]/10 flex items-center justify-center text-[#5a38ef] font-semibold text-sm border border-[#5a38ef]/5">
                    {initial}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-stone-900 leading-none">{displayName}</p>
                  <p className="text-[10px] text-stone-400 font-semibold mt-1 leading-none">{displayEmail}</p>
                </div>
                <ChevronDown size={14} className="text-stone-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-stone-100 shadow-xl py-2 z-30 transition-all animate-fadeIn">
                  <div className="px-4 py-2 border-b border-stone-50 sm:hidden">
                    <p className="text-xs font-bold text-stone-900">{displayName}</p>
                    <p className="text-[10px] text-stone-400 font-medium truncate">{displayEmail}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <User size={14} className="mr-2 text-stone-400" />
                    <span>My Profile</span>
                  </Link>
                  <hr className="my-1 border-stone-50" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      clearUser();
                      router.push("/");
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut size={14} className="mr-2" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-8 w-24 bg-stone-100 rounded-lg animate-pulse" />
          )}
        </header>

        <main className="flex-1 overflow-y-auto p-8 lg:p-10 z-10">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
