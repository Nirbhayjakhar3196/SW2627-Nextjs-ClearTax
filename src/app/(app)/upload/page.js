"use client";

import { useState } from "react";
import { UploadCloud, File, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth.store";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const validateAndAddFiles = (selectedFiles) => {
    setError(null);
    setSuccessMessage(null);
    const validFiles = [];
    let invalidCount = 0;

    selectedFiles.forEach((file) => {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        validFiles.push(file);
      } else {
        invalidCount++;
      }
    });

    if (invalidCount > 0) {
      setError(`Skipped ${invalidCount} non-CSV file(s).`);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setSuccessMessage(null);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const headers = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          headers,
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }

        setUploadResult(data.data);
      }

      setSuccessMessage("File(s) successfully processed and stored in database!");
      setFiles([]);
    } catch (err) {
      console.error("Upload failed:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 font-outfit">Upload Invoices</h1>
        <p className="text-stone-500 mt-1 text-sm font-sans">
          Upload CSV files for complete end-to-end processing into PostgreSQL database.
        </p>
      </motion.div>

      {error && (
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100/50 flex items-start text-amber-700 backdrop-blur-sm">
          <AlertCircle size={20} className="mr-3 mt-0.5 shrink-0 text-amber-600" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 flex items-start text-emerald-700 backdrop-blur-sm">
          <CheckCircle2 size={20} className="mr-3 mt-0.5 shrink-0 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">{successMessage}</p>
            {uploadResult?.batch && (
              <p className="text-xs text-emerald-600 mt-1">
                Created Batch ID #{uploadResult.batch.id} with {uploadResult.batch.invoices?.length || 0} invoice record(s).
              </p>
            )}
          </div>
        </div>
      )}

      <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}>
        <div
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 relative overflow-hidden ${
            isDragging
              ? "border-[#5a38ef] bg-[#5a38ef]/5 shadow-inner scale-[0.99]"
              : "border-stone-200 bg-white hover:bg-white/80 hover:border-[#5a38ef]/20 hover:shadow-md shadow-sm"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-20 h-20 bg-[#5a38ef]/5 text-[#5a38ef] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[#5a38ef]/10">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2 tracking-tight font-outfit">
            Drag & Drop CSV files here
          </h3>
          <p className="text-stone-500 mb-8 max-w-sm mx-auto leading-relaxed text-sm">
            Select standard CSV files containing invoice data to test the complete upload flow.
          </p>

          <div className="flex items-center justify-center gap-4">
            <input
              type="file"
              id="csv-upload"
              className="hidden"
              accept=".csv"
              multiple
              onChange={handleFileChange}
            />
            <label htmlFor="csv-upload" className="cursor-pointer primary-action">
              Browse Files
            </label>
          </div>
        </div>
      </motion.div>

      {files.length > 0 && (
        <motion.div
          variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-stone-900 font-outfit">
              {files.length} File{files.length !== 1 && "s"} Selected
            </h3>
            <button
              onClick={handleUpload}
              disabled={isProcessing}
              className="primary-action disabled:opacity-70 flex items-center"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading to DB...
                </span>
              ) : (
                <span className="flex items-center">
                  <CheckCircle2 size={18} className="mr-2" /> Start Processing
                </span>
              )}
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-stone-50/50 border border-stone-100 hover:border-[#5a38ef]/10 hover:bg-white/80 transition-all duration-300 group shadow-sm"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <File size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-stone-900 line-clamp-1">{f.name}</p>
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide">
                      {(f.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(i)}
                  disabled={isProcessing}
                  className="p-2 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
