"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileSpreadsheet, Loader2, Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore, getCookie } from "@/store/auth.store";
import axios from "@/lib/axios";

export default function LibraryPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const limit = 5;
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/uploads?page=${page}&limit=${limit}`);
        const data = response.data;
        
        if (data.success) {
          setJobs(data.data.map(batch => ({
            id: batch.id,
            createdAt: batch.createdAt,
            totalRows: batch.totalRows,
            status: batch.status.toLowerCase()
          })));
          setTotalPages(data.meta.totalPages || 1);
          setTotalRows(data.meta.total || 0);
        }
      } catch (err) {
        console.error("Error fetching library batches:", err);
      } finally {
        setLoading(false);
      }
    };

    const activeToken = token || (typeof document !== "undefined" && getCookie("bip_token"));
    if (activeToken) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [token, page]);

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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Library</h1>
        <p className="text-gray-500 mt-1 text-sm">Access your historical invoice uploads.</p>
      </motion.div>

      <motion.div 
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
        className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
      >
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="animate-spin mb-4 text-[#5a38ef]" size={32} />
            <p className="text-sm font-semibold">Loading your history...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileSpreadsheet size={32} />
            </div>
            <p className="text-gray-500 font-medium">No invoice batches found.</p>
            <button 
              onClick={() => router.push("/upload")}
              className="mt-4 text-[#5a38ef] hover:text-[#401fd6] font-medium"
            >
              Upload your first batch
            </button>
          </div>
        ) : (
          <div className="bg-gray-50/50">
            <div className="divide-y divide-gray-100 p-4 space-y-4">
              {jobs.map((job, index) => (
                <motion.div 
                  key={job.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  onClick={() => router.push(`/results?jobId=${job.id}`)}
                  className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#5a38ef]/15 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300">
                      <FileSpreadsheet size={20} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-gray-900 group-hover:text-[#5a38ef] transition-colors duration-200">
                        Invoice Batch #{job.id}
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
                  <div className="text-gray-400 group-hover:text-[#5a38ef] group-hover:translate-x-1 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 rounded-b-2xl">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-350 rounded-md hover:bg-stone-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                    className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-350 rounded-md hover:bg-stone-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                      Showing Page <span className="font-bold text-[#5a38ef]">{page}</span> of <span className="font-bold text-[#5a38ef]">{totalPages}</span> ({totalRows} total batches)
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        className="relative inline-flex items-center px-3 py-1.5 rounded-l-lg border border-gray-200 bg-white text-xs font-semibold text-stone-500 hover:bg-stone-50 hover:text-[#5a38ef] disabled:opacity-40 transition-colors"
                      >
                        Prev
                      </button>
                      
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const pageNum = idx + 1;
                        const isCurrent = pageNum === page;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`relative inline-flex items-center px-3.5 py-1.5 border border-gray-200 text-xs font-bold transition-all ${
                              isCurrent 
                                ? "z-10 bg-[#5a38ef] border-[#5a38ef] text-white" 
                                : "bg-white text-stone-600 hover:bg-stone-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        disabled={page === totalPages}
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        className="relative inline-flex items-center px-3 py-1.5 rounded-r-lg border border-gray-200 bg-white text-xs font-semibold text-stone-500 hover:bg-stone-50 hover:text-[#5a38ef] disabled:opacity-40 transition-colors"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
