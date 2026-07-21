"use client";

import { useState } from "react";
import { UploadCloud, File, AlertCircle, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const router = useRouter();

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
      // Flow: Frontend -> multipart/form-data -> API Route -> Service -> Repository -> DB
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
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
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">Upload Invoices</h1>
        <p className="text-stone-500 mt-1 text-sm">
          Upload CSV files for complete end-to-end processing into PostgreSQL database.
        </p>
      </motion.div>

      {error && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-100 flex items-start text-amber-700">
          <AlertCircle size={20} className="mr-3 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start text-emerald-700">
          <CheckCircle2 size={20} className="mr-3 mt-0.5 shrink-0" />
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
          className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
            isDragging
              ? "border-[#9670f8] bg-[#f7f5ff]"
              : "border-stone-200 glass-card hover:bg-white/80 hover:border-stone-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="mx-auto w-20 h-20 bg-[#f7f5ff] text-[#9670f8] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-xl font-semibold text-stone-900 mb-2 tracking-tight">
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
            <h3 className="font-semibold text-stone-900">
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
                className="flex items-center justify-between p-4 rounded-xl bg-[rgba(247,245,255,0.5)] border border-white/40 hover:bg-white/80 transition-colors group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-4 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                    <File size={20} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-stone-900 line-clamp-1">{f.name}</p>
                    <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wide">
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
