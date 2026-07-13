"use client";

import { FileSpreadsheet, CheckCircle, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    matches: 0,
    mismatches: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // MOCK DATA STANDIN
    const fetchStats = async () => {
      setTimeout(() => {
        setStats({
          totalInvoices: 4258,
          matches: 4002,
          mismatches: 124,
          pending: 132
        });
        setLoading(false);
      }, 600);
    };
    fetchStats();
  }, []);

  const statCards = [
    { name: "Total Invoices", value: loading ? "..." : stats.totalInvoices.toLocaleString(), icon: FileSpreadsheet, color: "text-blue-600", bg: "bg-blue-100", accent: "bg-blue-400" },
    { name: "Matches", value: loading ? "..." : stats.matches.toLocaleString(), icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-100", accent: "bg-emerald-400" },
    { name: "Mismatches", value: loading ? "..." : stats.mismatches.toLocaleString(), icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100", accent: "bg-rose-400" },
    { name: "Pending", value: loading ? "..." : stats.pending.toLocaleString(), icon: Clock, color: "text-indigo-600", bg: "bg-indigo-100", accent: "bg-indigo-400" },
  ];

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here is what&apos;s happening with your invoices today.</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {statCards.map((stat) => (
          <motion.div 
            key={stat.name} 
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
            className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden hover:shadow-sm hover:-translate-y-0.5 transition-all"
          >
            <div className={`absolute top-4 right-4 w-6 h-6 rounded-lg opacity-80 ${stat.accent}`}></div>
            <p className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2">{stat.name}</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        className="bg-white border border-gray-200 rounded-2xl p-8 text-center mt-8 min-h-[260px] flex flex-col justify-center items-center shadow-sm"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mb-4">
          <FileSpreadsheet size={32} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">Upload New Invoices</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
          Start processing a new batch of invoices. We support processing multiple CSV files at once.
        </p>
        <div className="mt-6 flex justify-center gap-3 flex-wrap">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
          >
            Go to Upload
          </Link>
          <Link
            href="/library"
            className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
          >
            View old records
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm"
          >
            Analytics & Reports
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
