"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet, Download, Loader2, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, getCookie } from "@/store/auth.store";
import axios from "@/lib/axios";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobId = searchParams.get("jobId");
  
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.token);

  // Pagination states for Job list
  const [jobsPage, setJobsPage] = useState(1);
  const [jobsTotalPages, setJobsTotalPages] = useState(1);
  const [jobsTotalRows, setJobsTotalRows] = useState(0);
  const jobsLimit = 5;

  // Pagination, search, and filter states for Invoice detailed view
  const [invoicePage, setInvoicePage] = useState(1);
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("all");
  const invoiceLimit = 10;

  useEffect(() => {
    let intervalId;

    const fetchJob = async (id) => {
      try {
        const response = await axios.get(`/upload/${id}`);
        const data = response.data;
        
        if (data.success) {
          const batch = data.data;
          
          setJob({
            id: batch.uploadId,
            createdAt: new Date(batch.createdAt || new Date()).toLocaleString(),
            totalRows: batch.totalRows,
            status: batch.status.toLowerCase(),
            results: batch.invoices.map((inv, idx) => ({
              id: inv.id,
              rowNumber: idx + 1,
              fileName: batch.fileName ? (batch.fileName.split('_').slice(1).join('_') || batch.fileName) : "",
              invoiceNumber: inv.invoiceNumber,
              vendor: inv.vendor,
              amount: inv.amount,
              taxAmount: Math.round(inv.amount * 0.18 * 100) / 100,
              status: inv.status.toLowerCase() === 'matched' ? 'match' : inv.status.toLowerCase() === 'mismatched' ? 'mismatch' : inv.status.toLowerCase() === 'pending' ? 'pending' : 'failed',
              errorMsg: inv.errorMessage
            }))
          });
          
          if (batch.status.toLowerCase() === 'completed' || batch.status.toLowerCase() === 'failed') {
            if (intervalId) clearInterval(intervalId);
          }
        } else {
          setError(data.message || "Failed to fetch job details");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "An error occurred while fetching job details");
      } finally {
        setLoading(false);
      }
    };

    const fetchAllJobs = async () => {
      try {
        const response = await axios.get(`/uploads?page=${jobsPage}&limit=${jobsLimit}`);
        const data = response.data;
        
        if (data.success) {
          setJobs(data.data.map(batch => ({
            id: batch.id,
            createdAt: new Date(batch.createdAt).toLocaleString(),
            totalRows: batch.totalRows,
            status: batch.status.toLowerCase()
          })));
          setJobsTotalPages(data.meta.totalPages || 1);
          setJobsTotalRows(data.meta.total || 0);
        } else {
          setError(data.message || "Failed to fetch uploads list");
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "An error occurred while fetching uploads");
      } finally {
        setLoading(false);
      }
    };

    const activeToken = token || (typeof document !== "undefined" && getCookie("bip_token"));
    if (activeToken) {
      if (jobId) {
        fetchJob(jobId);
        intervalId = setInterval(() => fetchJob(jobId), 1500);
      } else {
        fetchAllJobs();
      }
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId, token, jobsPage]);

  // Reset page when search or status filter changes
  useEffect(() => {
    setInvoicePage(1);
  }, [invoiceSearch, invoiceStatus]);

  if (loading && !job && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#5a38ef] mb-4" size={36} />
        <p className="text-sm text-stone-500 font-medium">Retrieving invoice records...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-xl font-medium">{error}</div>;
  }

  // View 1: List of all uploads (Jobs)
  if (!jobId) {
    return (
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">All Results</h1>
          <p className="text-gray-500 mt-1 text-sm">Select an upload batch to view detailed transaction results.</p>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-gray-100 bg-gray-50/50 p-4 space-y-4">
            {jobs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">No jobs processed yet.</div>
            ) : (
              jobs.map((j, index) => (
                <motion.div 
                  key={j.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10px" }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  onClick={() => router.push(`/results?jobId=${j.id}`)}
                  className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#5a38ef]/15 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between group"
                >
                  <div className="mb-4 md:mb-0">
                    <p className="font-bold text-[15px] text-gray-900 group-hover:text-[#5a38ef] transition-colors">Job Batch: #{j.id}</p>
                    <p className="text-[12px] text-gray-400 font-semibold mt-1">{j.createdAt}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-md text-gray-700 font-semibold">{j.totalRows} Invoices</span>
                    <span className={`text-xs px-3 py-1 rounded-md font-bold uppercase ${
                      j.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      j.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {j.status}
                    </span>
                    <span className="text-[#5a38ef] font-bold text-xs group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                      View Details <ChevronRight size={14} />
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Jobs Pagination controls */}
          {jobsTotalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100 rounded-b-2xl">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  disabled={jobsPage === 1}
                  onClick={() => setJobsPage(prev => Math.max(prev - 1, 1))}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-stone-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={jobsPage === jobsTotalPages}
                  onClick={() => setJobsPage(prev => Math.min(prev + 1, jobsTotalPages))}
                  className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-stone-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                    Showing Page <span className="font-bold text-[#5a38ef]">{jobsPage}</span> of <span className="font-bold text-[#5a38ef]">{jobsTotalPages}</span> ({jobsTotalRows} total batches)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      disabled={jobsPage === 1}
                      onClick={() => setJobsPage(prev => Math.max(prev - 1, 1))}
                      className="relative inline-flex items-center px-3 py-1.5 rounded-l-lg border border-gray-200 bg-white text-xs font-semibold text-stone-500 hover:bg-stone-50 hover:text-[#5a38ef] disabled:opacity-40 transition-colors"
                    >
                      Prev
                    </button>
                    
                    {Array.from({ length: jobsTotalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isCurrent = pageNum === jobsPage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setJobsPage(pageNum)}
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
                      disabled={jobsPage === jobsTotalPages}
                      onClick={() => setJobsPage(prev => Math.min(prev + 1, jobsTotalPages))}
                      className="relative inline-flex items-center px-3 py-1.5 rounded-r-lg border border-gray-200 bg-white text-xs font-semibold text-stone-500 hover:bg-stone-50 hover:text-[#5a38ef] disabled:opacity-40 transition-colors"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    );
  }

  // View 2: Detailed invoice results for a specific Job
  if (!job) return null;

  // Compute status totals dynamically from the job payload
  const matches = job.results.filter(r => r.status === 'match').length;
  const mismatches = job.results.filter(r => r.status === 'mismatch').length;
  const failedRows = job.results.filter(r => r.status === 'failed').length;
  const pendingRows = job.results.filter(r => r.status === 'pending').length;
  const processedCount = matches + mismatches + failedRows;

  // Filter invoices based on status filter and search query
  const filteredResults = job.results.filter(r => {
    const matchesStatus = 
      invoiceStatus === "all" ||
      (invoiceStatus === "match" && r.status === "match") ||
      (invoiceStatus === "mismatch" && r.status === "mismatch") ||
      (invoiceStatus === "failed" && r.status === "failed") ||
      (invoiceStatus === "pending" && r.status === "pending");

    const matchesSearch = 
      !invoiceSearch ||
      (r.invoiceNumber && r.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase())) ||
      (r.vendor && r.vendor.toLowerCase().includes(invoiceSearch.toLowerCase())) ||
      (r.errorMsg && r.errorMsg.toLowerCase().includes(invoiceSearch.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Paginated chunk
  const paginatedInvoices = filteredResults.slice(
    (invoicePage - 1) * invoiceLimit,
    invoicePage * invoiceLimit
  );
  
  const totalInvoicePages = Math.max(1, Math.ceil(filteredResults.length / invoiceLimit));

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <button 
            onClick={() => router.push("/results")} 
            className="text-xs font-semibold text-[#5a38ef] hover:underline mb-2 flex items-center gap-0.5"
          >
            &larr; Back to all batches
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 font-outfit">Batch Details</h1>
          <p className="text-gray-500 mt-1 text-sm font-sans">Details for Job ID: #{job.id} • Processed on {job.createdAt}</p>
        </div>
        <button
          onClick={() => {
            const csv = Papa.unparse(job.results.map(r => ({
              File: r.fileName || "",
              Row: r.rowNumber,
              InvoiceNumber: r.invoiceNumber || "",
              Vendor: r.vendor || "",
              Amount: r.amount || "",
              Tax: r.taxAmount || "",
              Status: r.status,
              ErrorDetails: r.errorMsg || ""
            })));
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `job_${job.id}_results.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="inline-flex items-center bg-[#5a38ef] hover:bg-[#401fd6] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-500/10 hover:-translate-y-0.5"
        >
          <Download size={16} className="mr-2" /> Download CSV Report
        </button>
      </motion.div>

      {/* Progress Bar for Active Processing */}
      {(job.status === 'processing' || job.status === 'pending') && (
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="bg-white border border-gray-255 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin text-[#5a38ef]" size={16} />
              Processing Invoices in Background...
            </span>
            <span>{Math.round((processedCount / job.totalRows) * 100) || 0}%</span>
          </div>
          <div className="w-full bg-stone-50 border border-stone-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#5a38ef] h-full transition-all duration-300 rounded-full" 
              style={{ width: `${(processedCount / job.totalRows) * 100}%` }}
            />
          </div>
          <p className="text-xs text-stone-400 font-semibold mt-2">
            Processed {processedCount} of {job.totalRows} invoices
          </p>
        </motion.div>
      )}

      {/* Stats Board */}
      <motion.div 
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} 
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { name: "Total Rows", val: job.totalRows, icon: FileSpreadsheet, text: "text-blue-600", bg: "bg-blue-50/50" },
          { name: "Row Matches", val: matches, icon: CheckCircle2, text: "text-emerald-600", bg: "bg-emerald-50/50" },
          { name: "Row Mismatches", val: mismatches, icon: AlertTriangle, text: "text-orange-600", bg: "bg-orange-50/50" },
          { name: "Row Failures", val: failedRows, icon: XCircle, text: "text-rose-600", bg: "bg-rose-50/50" }
        ].map((c) => (
          <div key={c.name} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center shadow-sm hover:scale-[1.03] transition-transform duration-200">
            <c.icon className={`${c.text} mb-2`} size={24} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{c.name}</span>
            <span className="text-2xl font-extrabold text-gray-900 font-outfit">{c.val}</span>
          </div>
        ))}
      </motion.div>

      {/* Table filters and table layout */}
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="space-y-4">
        {/* Search and status filter header */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
          {/* Status buttons */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {[
              { id: "all", label: "All", count: job.results.length },
              { id: "match", label: "Matches", count: matches },
              { id: "mismatch", label: "Mismatches", count: mismatches },
              { id: "failed", label: "Failures", count: failedRows }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setInvoiceStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  invoiceStatus === tab.id
                    ? "bg-[#5a38ef]/10 text-[#5a38ef] border border-[#5a38ef]/20"
                    : "text-stone-500 hover:bg-stone-50 border border-transparent"
                }`}
              >
                {tab.label} <span className="opacity-60 ml-0.5">({tab.count})</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
              <Search size={14} />
            </div>
            <input
              type="text"
              placeholder="Search invoice or vendor..."
              value={invoiceSearch}
              onChange={(e) => setInvoiceSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-stone-50/50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5a38ef] focus:border-[#5a38ef] placeholder-stone-400 font-semibold"
            />
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Row</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice No.</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tax</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Error Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <AnimatePresence mode="popLayout">
                  {paginatedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-10 text-center text-sm text-stone-400 font-medium bg-white">
                        No transactions match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedInvoices.map((result, idx) => (
                      <motion.tr 
                        key={result.id}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-5px" }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        className="hover:bg-indigo-50/20 hover:scale-[1.01] hover:shadow-sm transition-all duration-200 cursor-pointer origin-center"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.rowNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{result.invoiceNumber || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{result.vendor || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">${result.amount?.toLocaleString() || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">${result.taxAmount?.toLocaleString() || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {result.status === 'match' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700"><CheckCircle2 size={12} className="mr-1.5"/> Match</span>}
                          {result.status === 'mismatch' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-700"><AlertTriangle size={12} className="mr-1.5"/> Mismatch</span>}
                          {result.status === 'failed' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-red-100 text-red-700"><XCircle size={12} className="mr-1.5"/> Failed</span>}
                          {result.status === 'pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-blue-100 text-blue-700"><Loader2 size={12} className="mr-1.5 animate-spin"/> Processing</span>}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                          {result.errorMsg ? <span className="text-red-500">{result.errorMsg}</span> : <span className="text-gray-400">None</span>}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Table Pagination Controls */}
          {totalInvoicePages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-100">
              <div className="flex justify-between flex-1 sm:hidden">
                <button
                  disabled={invoicePage === 1}
                  onClick={() => setInvoicePage(prev => Math.max(prev - 1, 1))}
                  className="relative inline-flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-stone-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={invoicePage === totalInvoicePages}
                  onClick={() => setInvoicePage(prev => Math.min(prev + 1, totalInvoicePages))}
                  className="relative inline-flex items-center px-4 py-2 ml-3 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-stone-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-stone-500 font-semibold uppercase tracking-wider">
                    Showing Page <span className="font-bold text-[#5a38ef]">{invoicePage}</span> of <span className="font-bold text-[#5a38ef]">{totalInvoicePages}</span> ({filteredResults.length} filtered rows)
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      disabled={invoicePage === 1}
                      onClick={() => setInvoicePage(prev => Math.max(prev - 1, 1))}
                      className="relative inline-flex items-center px-3 py-1.5 rounded-l-lg border border-gray-200 bg-white text-xs font-semibold text-stone-500 hover:bg-stone-50 hover:text-[#5a38ef] disabled:opacity-40 transition-colors"
                    >
                      Prev
                    </button>
                    
                    {Array.from({ length: totalInvoicePages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isCurrent = pageNum === invoicePage;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setInvoicePage(pageNum)}
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
                      disabled={invoicePage === totalInvoicePages}
                      onClick={() => setInvoicePage(prev => Math.min(prev + 1, totalInvoicePages))}
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
      </motion.div>
    </motion.div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#5a38ef] mb-4" size={36} />
        <p className="text-sm text-stone-500 font-medium">Loading page dependencies...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
