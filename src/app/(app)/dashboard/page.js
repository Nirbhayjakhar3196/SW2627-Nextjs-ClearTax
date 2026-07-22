"use client";

import { FileSpreadsheet, CheckCircle, AlertCircle, Clock, User, Mail, Shield, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
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
  const [stats, setStats] = useState({ total: 0, matches: 0, mismatches: 0, pending: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [recentBatches, setRecentBatches] = useState([]);
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

  useEffect(() => {
    let activeIntervalId = null;

    const fetchDashboardData = async () => {
      try {
        // Fetch 5 most recent batches
        const uploadsResponse = await axios.get("/uploads?page=1&limit=5");
        if (uploadsResponse.data.success) {
          const uploads = uploadsResponse.data.data;
          setRecentBatches(uploads);

          // Calculate counts based on ALL historical invoices
          const allRes = await axios.get("/upload");
          if (allRes.data.success) {
            const allUploads = allRes.data.data;
            let total = 0;
            let matches = 0;
            let mismatches = 0;
            let pending = 0;

            allUploads.forEach(batch => {
              if (batch.invoices) {
                batch.invoices.forEach(inv => {
                  total++;
                  if (inv.status === "MATCHED") matches++;
                  else if (inv.status === "MISMATCHED") mismatches++;
                  else if (inv.status === "PENDING" || inv.status === "PROCESSING") pending++;
                });
              }
            });

            setStats({ total, matches, mismatches, pending });
          }

          // Set up polling if there's any active background worker job running
          const hasActiveJob = uploads.some(batch => 
            batch.status === "PENDING" || batch.status === "PROCESSING"
          );

          if (hasActiveJob && !activeIntervalId) {
            activeIntervalId = setInterval(fetchDashboardData, 2000);
          } else if (!hasActiveJob && activeIntervalId) {
            clearInterval(activeIntervalId);
            activeIntervalId = null;
          }
        }
      } catch (err) {
        console.error("Error fetching dashboard statistics:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      if (activeIntervalId) {
        clearInterval(activeIntervalId);
      }
    };
  }, []);

  const containerVariants = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8 animate-fadeIn"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 font-outfit">Dashboard</h1>
          <p className="text-stone-500 mt-1.5 text-sm font-sans">
            Welcome back{profile?.name ? `, ${profile.name}` : ""}. Here is what&apos;s happening with your invoices today.
          </p>
        </div>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-[#5a38ef]/5 rounded-2xl p-6 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-50/20 to-transparent rounded-bl-full pointer-events-none"></div>
        <h2 className="text-[11px] font-bold text-[#5a38ef] tracking-wider uppercase mb-5 font-sans">Your Workspace Profile</h2>
        {profileLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-100 rounded w-48" />
            <div className="h-4 bg-gray-100 rounded w-64" />
            <div className="h-4 bg-gray-100 rounded w-32" />
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5a38ef]">
                <User size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Account Holder</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5">{profile.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5a38ef]">
                <Mail size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5 truncate max-w-[200px]">{profile.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#5a38ef]">
                <Shield size={20} strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Access Tier</p>
                <p className="text-sm font-bold text-stone-900 mt-0.5 capitalize">{profile.role.toLowerCase()}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-stone-400">Could not load profile.</p>
        )}
      </motion.div>

      {/* Stats Counter Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {[
          { name: "Total Invoices", value: statsLoading ? "..." : stats.total, icon: FileSpreadsheet, bg: "bg-blue-50/50", border: "border-blue-100/50", text: "text-blue-600", iconBg: "bg-blue-100/40" },
          { name: "Matches", value: statsLoading ? "..." : stats.matches, icon: CheckCircle, bg: "bg-emerald-50/50", border: "border-emerald-100/50", text: "text-emerald-600", iconBg: "bg-emerald-100/40" },
          { name: "Mismatches", value: statsLoading ? "..." : stats.mismatches, icon: AlertCircle, bg: "bg-rose-50/50", border: "border-rose-100/50", text: "text-rose-600", iconBg: "bg-rose-100/40" },
          { name: "Pending", value: statsLoading ? "..." : stats.pending, icon: Clock, bg: "bg-amber-50/50", border: "border-amber-100/50", text: "text-amber-600", iconBg: "bg-amber-100/40" },
        ].map((stat) => (
          <motion.div
            key={stat.name}
            variants={itemVariants}
            className={`border rounded-2xl p-6 relative overflow-hidden bg-white hover:border-[#5a38ef]/10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group`}
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-[10px] font-bold text-stone-400 tracking-wider uppercase mt-1">{stat.name}</p>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg} ${stat.text} group-hover:scale-110 transition-transform`}>
                <stat.icon size={16} strokeWidth={2.2} />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-stone-900 font-outfit leading-none mb-1">{stat.value}</p>
            <span className={`absolute bottom-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${stat.text.replace("text", "bg")}`}></span>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Uploads Section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-stone-900 font-outfit">Recent Uploads</h2>
          <Link href="/library" className="text-xs font-semibold text-[#5a38ef] hover:text-[#401fd6] transition-colors flex items-center gap-1">
            View All Uploads <ArrowRight size={12} />
          </Link>
        </div>

        {statsLoading && recentBatches.length === 0 ? (
          <div className="bg-white border border-[#5a38ef]/5 rounded-2xl p-10 flex justify-center items-center shadow-sm">
            <Loader2 className="animate-spin text-[#5a38ef] mr-2" size={20} />
            <p className="text-sm text-stone-500 font-medium">Loading recent uploads...</p>
          </div>
        ) : recentBatches.length === 0 ? (
          <div className="bg-white border border-[#5a38ef]/5 rounded-2xl p-10 text-center text-stone-400 text-sm shadow-sm">
            No uploads found. Go to the upload page to upload your invoice CSVs.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {recentBatches.map((batch) => {
              const percentage = batch.totalRows > 0
                ? Math.round((batch.processedRows / batch.totalRows) * 100)
                : 0;

              return (
                <div
                  key={batch.id}
                  onClick={() => router.push(`/results?jobId=${batch.id}`)}
                  className="bg-white border border-[#5a38ef]/5 rounded-2xl p-5 hover:border-[#5a38ef]/15 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50/50 flex items-center justify-center text-[#5a38ef] group-hover:bg-[#5a38ef] group-hover:text-white transition-colors duration-300">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#5a38ef] transition-colors duration-200">{batch.originalFileName}</h3>
                      <p className="text-[11px] text-stone-400 font-medium mt-0.5">
                        Batch #{batch.id} • {new Date(batch.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 max-w-xs px-2">
                    <div className="flex justify-between items-center mb-1 text-[11px]">
                      <span className="text-stone-400 font-bold uppercase tracking-wider">Processing</span>
                      <span className="text-stone-700 font-bold">{percentage}%</span>
                    </div>
                    <div className="w-full bg-stone-50 border border-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 rounded-full ${
                          batch.status === "FAILED"
                            ? "bg-rose-500"
                            : batch.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : "bg-[#5a38ef]"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center mt-1 text-[10px] text-stone-400 font-semibold tracking-wide">
                      <span>{batch.processedRows} of {batch.totalRows} rows</span>
                      <span className="capitalize">{batch.status.toLowerCase()}</span>
                    </div>
                  </div>

                  <div className="flex gap-6 items-center justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Successful / Failed</p>
                      <p className="text-sm font-bold text-stone-900 mt-0.5">
                        <span className="text-emerald-600">{batch.successfulRows}</span>
                        <span className="text-stone-300 mx-1.5">/</span>
                        <span className="text-rose-500">{batch.failedRows}</span>
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-stone-50/50 flex items-center justify-center border border-stone-100 text-stone-400 group-hover:text-[#5a38ef] group-hover:bg-[#5a38ef]/5 transition-all">
                      <ChevronRight size={16} strokeWidth={2.2} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Main Actions section */}
      <motion.div
        variants={itemVariants}
        className="bg-white border border-[#5a38ef]/5 rounded-3xl p-10 text-center min-h-[280px] flex flex-col justify-center items-center shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-50/20 to-transparent rounded-br-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-50/15 to-transparent rounded-tl-full pointer-events-none"></div>
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50/70 text-[#5a38ef] mb-6 shadow-sm border border-indigo-100/30">
          <FileSpreadsheet size={28} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 font-outfit">Upload New Invoices</h2>
        <p className="text-sm text-stone-500 mt-2.5 max-w-md mx-auto leading-relaxed font-sans">
          Start processing a new batch of invoices. We support processing multiple CSV files simultaneously with instant validation queues.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap z-10 relative">
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
