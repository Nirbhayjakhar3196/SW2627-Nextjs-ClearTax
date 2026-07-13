"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileSpreadsheet, History, Settings, User, FileText } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { useState, useEffect } from "react";
export default function AppLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearUser = useAuthStore((state) => state.clearUser);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = mounted && user?.name ? user.name : "hakuna";
  const displayEmail = mounted && user?.email ? user.email : "muehehe790@gmail.com";
  const initial = displayName.charAt(0).toUpperCase();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Invoices", href: "/upload", icon: FileSpreadsheet },
    { name: "Results", href: "/results", icon: FileText },
    { name: "Reports", href: "/reports", icon: History },
    { name: "Library", href: "/library", icon: FileText },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white flex font-sans text-stone-900">
      {/* Sidebar */}
      <div className="w-64 flex flex-col border-r border-gray-100 bg-white z-10 h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="text-xl font-bold text-[#5a38ef] tracking-tight">ClearTax</div>
        </div>
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#f4f2ff] text-[#5a38ef] font-medium"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={18} className={`mr-3 ${isActive ? "text-[#5a38ef]" : "text-gray-400"}`} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[14px]">{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#f4f2ff] flex items-center justify-center text-[#5a38ef] font-medium text-sm">
              {initial}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearUser();
              router.push("/");
            }}
            className="flex items-center text-red-600 hover:text-red-700 transition-colors px-2"
          >
            <div className="w-6 h-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px] mr-2">
              N
            </div>
            <span className="text-xs font-semibold">Log out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
