"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle2, FileSpreadsheet, Loader2, AlertCircle, FileCheck, ShieldAlert, BarChart3 } from "lucide-react";

export default function FeaturesCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const slides = [
    {
      id: 0,
      badge: "High Capacity",
      title: "Bulk Uploads & Schema Checking",
      description: "Import high-volume CSV invoice batches without slowing down finance operations. Our instant validator checks headers, columns, and data types before processing begins.",
      color: "from-blue-500/10 to-indigo-500/5",
      textColor: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-100",
      visual: (
        <div className="w-full h-full flex flex-col justify-center p-6 bg-white rounded-2xl border border-stone-200/60 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -z-10" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100/50">
              <UploadCloud size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-stone-700">invoice_batch_july_2026.csv</p>
              <p className="text-[10px] text-stone-400">4.8 MB • 12,450 invoices</p>
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/30 text-[11px]">
              <span className="flex items-center gap-2 font-medium text-emerald-800">
                <CheckCircle2 size={14} className="text-emerald-600" /> Headers Mapped
              </span>
              <span className="font-bold text-emerald-700">100% Passed</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/30 text-[11px]">
              <span className="flex items-center gap-2 font-medium text-emerald-800">
                <CheckCircle2 size={14} className="text-emerald-600" /> Data Types Verified
              </span>
              <span className="font-bold text-emerald-700">12,450 / 12,450</span>
            </div>
          </div>
          <div className="mt-4 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="text-stone-400 font-medium">Ready to Process</span>
            <span className="px-2.5 py-1 bg-blue-600 text-white rounded-full font-semibold shadow-sm shadow-blue-500/10">Start Batch</span>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      badge: "Real-time Queue",
      title: "Async Processing Background Workers",
      description: "Track jobs in real time while parsing, validation, and matching run in the background. Finance teams can continue other tasks while the system matches thousands of lines.",
      color: "from-amber-500/10 to-orange-500/5",
      textColor: "text-amber-700",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-100",
      visual: (
        <div className="w-full h-full flex flex-col justify-center p-6 bg-white rounded-2xl border border-stone-200/60 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Job #B-194</p>
              <h4 className="text-sm font-bold text-stone-800 mt-0.5">Matching Reconciliation</h4>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/60 rounded-full">
              <Loader2 size={12} className="animate-spin text-amber-600" />
              <span className="text-[10px] font-bold text-amber-700">Processing</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-xs font-semibold text-stone-600 mb-1.5">
              <span>Progress</span>
              <span>87%</span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: "87%" }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="p-2 bg-stone-50 rounded-lg">
              <p className="text-stone-400 font-medium">Valid Invoices</p>
              <p className="text-sm font-bold text-stone-800 mt-0.5">10,831</p>
            </div>
            <div className="p-2 bg-stone-50 rounded-lg">
              <p className="text-stone-400 font-medium">Flagged Mismatches</p>
              <p className="text-sm font-bold text-rose-600 mt-0.5">124</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      badge: "Smart Resolution",
      title: "Faster Reviews & Exception Handling",
      description: "Surface mismatches and exceptions early so teams spend less time reconciling manually. Flagged entries show visual indicators of mismatch reasons (e.g. GSTIN mismatch or pricing discrepancy).",
      color: "from-rose-500/10 to-red-500/5",
      textColor: "text-rose-600",
      badgeBg: "bg-rose-50 text-rose-800 border-rose-100",
      visual: (
        <div className="w-full h-full flex flex-col justify-center p-5 bg-white rounded-2xl border border-stone-200/60 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-600" />
              <span className="text-xs font-bold text-stone-800">Exception Review</span>
            </div>
            <span className="text-[10px] font-bold text-rose-600 px-2 py-0.5 bg-rose-50 border border-rose-100 rounded-full">1 Action Required</span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="p-2.5 rounded-xl border border-rose-100/60 bg-rose-50/20 text-[11px] space-y-1">
              <div className="flex justify-between font-bold text-stone-800">
                <span>Invoice #INV-2901</span>
                <span className="text-rose-600">Price Mismatch</span>
              </div>
              <div className="grid grid-cols-2 text-[10px] text-stone-500 pt-1">
                <div>Portal Value: <span className="font-semibold text-stone-700">₹45,200</span></div>
                <div>CSV Value: <span className="font-semibold text-rose-600">₹49,000</span></div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-1.5 border border-stone-200 text-stone-600 font-bold rounded-lg text-[10px] hover:bg-stone-50 transition-colors">
              Use Portal
            </button>
            <button className="flex-1 py-1.5 bg-[#d2543d] text-white font-bold rounded-lg text-[10px] hover:bg-[#be452f] transition-colors shadow-sm shadow-[#d2543d]/15">
              Accept CSV
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      badge: "Enterprise Security",
      title: "Reporting & Enterprise Visibility",
      description: "Keep reporting, invoice status, and audit trails in one secure workspace. Export clean PDF reports and trigger direct ledger syncs to systems of record with complete security.",
      color: "from-emerald-500/10 to-teal-500/5",
      textColor: "text-emerald-700",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-100",
      visual: (
        <div className="w-full h-full flex flex-col justify-center p-6 bg-white rounded-2xl border border-stone-200/60 shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-emerald-700" />
              <span className="text-xs font-bold text-stone-800">Batch Report Summary</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full">Sync Active</span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>Total Reconciled</span>
              <span className="font-bold text-stone-700">₹1,24,50,000</span>
            </div>
            <div className="flex justify-between text-[11px] text-stone-500">
              <span>Audit Trail Hash</span>
              <span className="font-mono text-[9px] text-[#d2543d]">sha256:7f9a8...</span>
            </div>
          </div>

          <div className="w-full bg-emerald-50/50 border border-emerald-100/60 p-2.5 rounded-xl text-center">
            <p className="text-[10px] font-bold text-emerald-800">✓ ERP Ledger Sync Complete</p>
            <p className="text-[8px] text-stone-400 mt-0.5">Synced with SAP Ledger at 14:23 PM</p>
          </div>
        </div>
      ),
    },
  ];

  // Auto scroll logic (slides leftward)
  useEffect(() => {
    if (isHovered) return;

    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered]);

  const handleDotClick = (id) => {
    setActiveSlide(id);
  };

  return (
    <div 
      className="w-full relative mt-4 mb-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Active slide layout container */}
      <div className="min-h-[380px] md:min-h-[320px] flex items-stretch">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full grid md:grid-cols-12 gap-8 items-center"
          >
            {/* Visual Column */}
            <div className="md:col-span-5 h-[240px] md:h-full flex items-center justify-center">
              <div className={`w-full max-w-[340px] h-[220px] rounded-3xl bg-gradient-to-br ${slides[activeSlide].color} p-4 flex items-center justify-center relative shadow-sm border border-stone-200/30`}>
                {slides[activeSlide].visual}
              </div>
            </div>

            {/* Feature Content Column */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4 text-left">
              <span className={`px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full border w-fit ${slides[activeSlide].badgeBg}`}>
                {slides[activeSlide].badge}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-900 leading-tight">
                {slides[activeSlide].title}
              </h3>
              <p className="text-sm md:text-base text-stone-500 leading-relaxed max-w-xl">
                {slides[activeSlide].description}
              </p>
              
              <div className="pt-2">
                <a 
                  href="/signup" 
                  className={`inline-flex items-center gap-2 text-sm font-bold ${slides[activeSlide].textColor} hover:underline`}
                >
                  Explore feature workflow →
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dot Indicators */}
      <div className="flex justify-center items-center gap-2.5 mt-8">
        {slides.map((slide) => (
          <button
            key={slide.id}
            onClick={() => handleDotClick(slide.id)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              activeSlide === slide.id 
                ? "w-8 bg-[#d2543d]" 
                : "w-2.5 bg-stone-300 hover:bg-stone-400"
            }`}
            aria-label={`Go to slide ${slide.id + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
