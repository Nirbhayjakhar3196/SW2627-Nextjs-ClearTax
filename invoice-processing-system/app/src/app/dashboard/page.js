"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Shield, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("/auth/me");
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        toast.error("Session expired", {
          description: "Please log in again.",
        });
        clearUser();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, setUser, clearUser]);

  const handleLogout = () => {
    clearUser();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfcff] flex flex-col p-8">
        <div className="max-w-4xl w-full mx-auto space-y-6 animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="glass-card p-8 space-y-6">
            <div className="flex items-center space-x-4 mb-8">
               <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
               <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="h-24 bg-gray-200 rounded-2xl"></div>
               <div className="h-24 bg-gray-200 rounded-2xl"></div>
               <div className="h-24 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfcff] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">Dashboard</h1>
            <p className="text-stone-500 mt-2">Manage your account and invoices</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Button variant="outline" onClick={handleLogout} icon={LogOut}>
              Sign out
            </Button>
          </motion.div>
        </header>

        <motion.div
          className="glass-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#f7f5ff] text-[#9670f8] flex items-center justify-center text-2xl font-bold shadow-sm border border-white uppercase">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-stone-900">Welcome, {user?.name}</h2>
              <p className="text-stone-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <User size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500 mb-1">Full Name</p>
                <p className="font-semibold text-stone-900">{user?.name}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                <Mail size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500 mb-1">Email Address</p>
                <p className="font-semibold text-stone-900">{user?.email}</p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-stone-100 shadow-sm flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-500 mb-1">Role</p>
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  {user?.role || "USER"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
