"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet, Download, Loader2 } from "lucide-react";
import Papa from "papaparse";
import { motion } from "framer-motion";
import { useAuthStore, getCookie } from "@/store/auth.store";
import axios from "@/lib/axios";

function ResultsContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.token);

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
              vendorName: inv.vendor,
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
        const response = await axios.get("/upload");
        const data = response.data;
        
        if (data.success) {
          setJobs(data.data.map(batch => ({
            id: batch.id,
            createdAt: new Date(batch.createdAt).toLocaleString(),
            totalRows: batch.totalRows,
            status: batch.status.toLowerCase()
          })));
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
  }, [jobId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500 mb-4" size={36} />
        <p className="text-sm text-stone-500 font-medium">Retrieving invoice records...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 bg-red-50 p-4 rounded-xl">{error}</div>;
  }

  // If no specific job, list all jobs
  if (!jobId) {
    return (
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">All Results</h1>
          <p className="text-gray-500 mt-1 text-sm">Select a job to view detailed row-by-row results.</p>
        </motion.div>
        
        <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <ul className="divide-y divide-gray-100 bg-gray-50/50 p-4 space-y-4">
            {jobs.length === 0 ? (
              <li className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100">No jobs processed yet.</li>
            ) : (
              jobs.map(j => (
                <li key={j.id} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 hover:shadow transition-all flex flex-col md:flex-row md:items-center justify-between group">
                  <div className="mb-4 md:mb-0">
                    <p className="font-semibold text-[15px] text-gray-900">Job: #{j.id}</p>
                    <p className="text-[13px] text-gray-500 mt-1">{j.createdAt}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-md text-gray-700 font-medium">{j.totalRows} Rows</span>
                    <span className={`text-xs px-3 py-1 rounded-md font-medium ${
                      j.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      j.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {j.status}
                    </span>
                    <a href={`/results?jobId=${j.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors">View Details &rarr;</a>
                  </div>
                </li>
              ))
            )}
          </ul>
        </motion.div>
      </motion.div>
    );
  }

  // Detailed view
  if (!job) return null;

  const matches = job.results.filter(r => r.status === 'match').length;
  const mismatches = job.results.filter(r => r.status === 'mismatch').length;
  const failedRows = job.results.filter(r => r.status === 'failed').length;
  const processedCount = matches + mismatches + failedRows;

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Job Results</h1>
          <p className="text-gray-500 mt-1 text-sm">Details for Job ID: #{job.id}</p>
        </div>
        <button
          onClick={() => {
            const csv = Papa.unparse(job.results.map(r => ({
              File: r.fileName || "",
              Row: r.rowNumber,
              InvoiceNumber: r.invoiceNumber || "",
              Vendor: r.vendorName || "",
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
          className="inline-flex items-center bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={16} className="mr-2" /> Download CSV
        </button>
      </motion.div>

      {/* Progress Bar for Active Job */}
      {(job.status === 'processing' || job.status === 'pending') && (
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin text-indigo-500" size={16} />
              Processing Invoices...
            </span>
            <span>{Math.round((processedCount / job.totalRows) * 100) || 0}%</span>
          </div>
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-500 h-full transition-all duration-300" 
              style={{ width: `${(processedCount / job.totalRows) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Processed {processedCount} of {job.totalRows} invoices
          </p>
        </motion.div>
      )}

      <motion.div 
        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center shadow-sm">
          <FileSpreadsheet className="text-blue-500 mb-2" size={24} />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Rows</span>
          <span className="text-2xl font-bold text-gray-900">{job.totalRows}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center shadow-sm">
          <CheckCircle2 className="text-green-500 mb-2" size={24} />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Row Matches</span>
          <span className="text-2xl font-bold text-gray-900">{matches}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center shadow-sm">
          <AlertTriangle className="text-orange-500 mb-2" size={24} />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Row Mismatches</span>
          <span className="text-2xl font-bold text-gray-900">{mismatches}</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center shadow-sm">
          <XCircle className="text-red-500 mb-2" size={24} />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Row Failures</span>
          <span className="text-2xl font-bold text-gray-900">{failedRows}</span>
        </div>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">File</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Row</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice No.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tax</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Error Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {job.results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{result.fileName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.rowNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.invoiceNumber || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.vendorName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.amount ? `$${result.amount}` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.taxAmount ? `$${result.taxAmount}` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {result.status === 'match' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-green-100 text-green-700"><CheckCircle2 size={12} className="mr-1.5"/> Match</span>}
                    {result.status === 'mismatch' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-orange-100 text-orange-700"><AlertTriangle size={12} className="mr-1.5"/> Mismatch</span>}
                    {result.status === 'failed' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-red-100 text-red-700"><XCircle size={12} className="mr-1.5"/> Failed</span>}
                    {result.status === 'pending' && <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-blue-100 text-blue-700"><Loader2 size={12} className="mr-1.5 animate-spin"/> Processing</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {result.errorMsg ? <span className="text-red-600">{result.errorMsg}</span> : <span className="text-gray-400">None</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500 text-center">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
