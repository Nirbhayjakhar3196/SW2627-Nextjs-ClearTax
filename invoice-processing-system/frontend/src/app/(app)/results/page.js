"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, AlertTriangle, FileSpreadsheet, Download } from "lucide-react";
import Papa from "papaparse";
import { motion } from "framer-motion";

function ResultsContent() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  
  const [job, setJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);

  useEffect(() => {
    // MOCK DATA STANDIN
    const fetchJob = async (id) => {
      setTimeout(() => {
        setJob({
          id,
          createdAt: new Date().toISOString(),
          totalRows: 25,
          status: 'completed',
          results: [
            { id: 1, rowNumber: 1, invoiceNumber: "INV-001", vendorName: "Acme Corp", amount: 150.0, taxAmount: 15.0, status: "match" },
            { id: 2, rowNumber: 2, invoiceNumber: "INV-002", vendorName: "Globex", amount: 200.0, taxAmount: 20.0, status: "mismatch", errorMsg: "Amount difference detected" },
            { id: 3, rowNumber: 3, invoiceNumber: "INV-003", vendorName: "Initech", amount: null, taxAmount: null, status: "failed", errorMsg: "Invalid invoice format" },
          ]
        });
        setLoading(false);
      }, 600);
    };

    const fetchAllJobs = async () => {
      setTimeout(() => {
        setJobs([
          { id: "cmrerputx00014hmk7ersk25", createdAt: "7/10/2026, 3:33:35 PM", totalRows: 25, status: "completed" },
          { id: "cmrer9oph00024hi9jrqgklso", createdAt: "7/10/2026, 3:21:01 PM", totalRows: 95, status: "completed" },
        ]);
        setLoading(false);
      }, 600);
    };

    if (jobId) {
      fetchJob(jobId);
    } else {
      fetchAllJobs();
    }
  }, [jobId]);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-pulse flex space-x-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>;
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
                    <p className="font-semibold text-[15px] text-gray-900">Job: {j.id}</p>
                    <p className="text-[13px] text-gray-500 mt-1">{j.createdAt}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs bg-gray-100 px-3 py-1 rounded-md text-gray-700 font-medium">{j.totalRows} Rows</span>
                    <span className={`text-xs px-3 py-1 rounded-md font-medium ${j.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
  
  let failedFiles = [];
  if (job.failedFiles) {
    try {
      failedFiles = JSON.parse(job.failedFiles);
    } catch {}
  }

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
          <p className="text-gray-500 mt-1 text-sm">Details for Job ID: {job.id}</p>
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

      {failedFiles.length > 0 && (
        <div className="bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm">
          <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="mr-2" /> Files that completely failed
          </h3>
          <ul className="space-y-3">
            {failedFiles.map((f, i) => (
              <li key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                <span className="font-medium text-gray-900">{f.name}</span>
                <span className="text-red-600 text-sm mt-1 md:mt-0">{f.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

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
