"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, Loader2, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LibraryPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      // MOCK DATA STANDIN
      setTimeout(() => {
        setJobs([
          { id: "1", createdAt: new Date(Date.now() - 86400000).toISOString(), totalRows: 25, status: "completed" },
          { id: "2", createdAt: new Date(Date.now() - 172800000).toISOString(), totalRows: 95, status: "completed" },
        ]);
        setLoading(false);
      }, 700);
    };
    fetchJobs();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Library</h1>
        <p className="text-gray-500 mt-1 text-sm">Access your historical invoice uploads.</p>
      </motion.div>

      <motion.div 
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
      >
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
            <p>Loading your history...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileSpreadsheet size={32} />
            </div>
            <p className="text-gray-500 font-medium">No invoice batches found.</p>
            <button 
              onClick={() => router.push("/upload")}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Upload your first batch
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 p-4 space-y-4 bg-gray-50/50">
            {jobs.map((job) => (
              <div 
                key={job.id} 
                onClick={() => router.push(`/results?jobId=${job.id}`)}
                className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 hover:shadow transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900">
                      Invoice Batch
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                      <span className="flex items-center">
                        <Calendar size={12} className="mr-1.5" />
                        {formatDate(job.createdAt)}
                      </span>
                      <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md font-medium">
                        {job.totalRows} Invoices
                      </span>
                      <span className={`px-2.5 py-1 rounded-md font-medium ${
                        job.status === "completed" ? "bg-green-100 text-green-700" :
                        job.status === "failed" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-gray-400">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
