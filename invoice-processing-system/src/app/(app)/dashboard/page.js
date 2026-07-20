"use client";

import { FileSpreadsheet, CheckCircle, AlertCircle, Clock, User, Mail, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/auth/me");
        if (response.data.success) {
          setProfile(response.data.user);
        }
      } catch {
        clearUser();
        toast.error("Session expired", {
          description: "Please sign in again.",
        });
        router.push("/login");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [clearUser, router]);

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back{profile?.name ? `, ${profile.name}` : ""}. Here is what&apos;s happening with your invoices today.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-200 rounded-2xl p-6"
      >
        <h2 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-4">Your Profile</h2>
        {profileLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-64" />
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <User size={18} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Name</p>
                <p className="text-sm font-semibold text-gray-900">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Mail size={18} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-900">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                <Shield size={18} className="text-indigo-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Role</p>
                <p className="text-sm font-semibold text-gray-900">{profile.role}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Could not load profile.</p>
        )}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {[
          { name: "Total Invoices", value: profileLoading ? "..." : "--", icon: FileSpreadsheet, accent: "bg-blue-400" },
          { name: "Matches", value: profileLoading ? "..." : "--", icon: CheckCircle, accent: "bg-emerald-400" },
          { name: "Mismatches", value: profileLoading ? "..." : "--", icon: AlertCircle, accent: "bg-rose-400" },
          { name: "Pending", value: profileLoading ? "..." : "--", icon: Clock, accent: "bg-indigo-400" },
        ].map((stat) => (
          <motion.div
            key={stat.name}
            variants={itemVariants}
            className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all"
          >
            <div className={`absolute top-4 right-4 w-6 h-6 rounded-lg opacity-80 ${stat.accent}`} />
            <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">{stat.name}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-white border border-gray-200 rounded-2xl p-8 text-center min-h-[260px] flex flex-col justify-center items-center shadow-sm"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mb-4">
          <FileSpreadsheet size={32} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">Upload New Invoices</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
          Start processing a new batch of invoices. We support processing multiple CSV files at once.
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link href="/upload">
            <Button icon={ArrowRight}>Go to Upload</Button>
          </Link>
          <Link href="/library">
            <Button variant="secondary">View old records</Button>
          </Link>
          <Link href="/reports">
            <Button variant="secondary">Analytics &amp; Reports</Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
